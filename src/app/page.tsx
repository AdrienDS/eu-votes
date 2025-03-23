'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { SearchFilters, Vote } from '@/types';
import { searchVotesWithDetails, parseUrlParams } from '@/utils/api';
import { VoteList } from '@/components/VoteList';
import { COUNTRIES, GROUPS } from '@/constants/filters';
import { Header } from '@/components/Header';
import { SearchPanel } from '@/components/SearchPanel';
import { HelpModal } from '@/components/HelpModal';
import { AboutModal } from '@/components/AboutModal';
import { Loader } from '@/components/Loader';

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    countries: [],
    groups: [],
  });
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedVotes, setExpandedVotes] = useState<Set<string>>(new Set());
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const isInitialLoad = useRef(true);
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  async function searchVotes (filters: SearchFilters, loadingSetter: (loading: boolean) => void, page?: number | null) {
    loadingSetter(true);
    setError(null);
    try {
      const { 
        results: newVotes, total: totalVotes, page: newPage, has_next: newHasNext,
       } = await searchVotesWithDetails(filters, page);
      setPage(newPage);
      setHasNext(newHasNext);
      setCurrentSearch(filters.searchTerm);
      setTotal(totalVotes);
      setHasSearched(true);
      // console.log('Search results:', { votes: newVotes.length, total: totalVotes, page: newPage, hasNext: newHasNext });
      return newVotes;
    } catch (err) {
      setError('Failed to fetch more votes. Please try again.');
      console.error('Search error:', err);
      return [];
    } finally {
      loadingSetter(false);
    }
  }

  const searchMore = useCallback(async () => {
    if (!hasNext) return;
    const newVotes = await searchVotes({ ...filters, searchTerm: currentSearch }, setLoadingMore, (page || 1) + 1);
    if (newVotes?.length) setVotes([...votes, ...newVotes]);
  }, [currentSearch, hasNext, page, votes, filters]);

  const handleSearch = useCallback(async () => {
    const newVotes = await searchVotes(filters, setLoading);
    if (newVotes?.length) setVotes(newVotes);
  }, [filters]);

  useEffect(() => {
    if (!isInitialLoad.current) return;
    
    const params = parseUrlParams();
    setFilters(params);
    if (params.searchTerm) {
      searchVotes(params, setLoading).then(newVotes => {
        // console.log('Initial Search results:', { votes: newVotes.length });
        if (newVotes?.length) setVotes(newVotes);
      });
    }
    isInitialLoad.current = false;
  }, []);

  const toggleVote = (voteId: string) => {
    setExpandedVotes(prev => {
      const next = new Set(prev);
      if (next.has(voteId)) {
        next.delete(voteId);
      } else {
        next.add(voteId);
      }
      return next;
    });
  };

  const toggleDetails = (voteId: string) => {
    setExpandedDetails(prev => {
      const next = new Set(prev);
      if (next.has(voteId)) {
        next.delete(voteId);
      } else {
        next.add(voteId);
      }
      return next;
    });
  };

  const toggleAllVotes = (expand: boolean) => {
    setExpandedVotes(expand ? new Set(votes.map(v => v.id)) : new Set());
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Header filters={filters} />
      <SearchPanel
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        countries={COUNTRIES}
        groups={GROUPS}
      />

      {loading && (<Loader className="py-8" />)}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="space-y-4">
          {isInitialLoad.current ? '' : !hasSearched ? (
            <div className="text-center text-gray-900 py-8">
              Try searching votes using keywords
            </div>
          ) : total === 0 ? (
            <div className="text-center text-gray-900 py-8">
              No votes found. Try searching for something.
            </div>
          ) : votes.length === 0 ? (
            <div className="text-center text-gray-900 py-8">
              Found {total} votes but no results to display. Try adjusting your filters.
            </div>
          ) : (
            <VoteList
              votes={votes}
              expandedVotes={expandedVotes}
              expandedDetails={expandedDetails}
              filters={filters}
              onToggleVote={toggleVote}
              onToggleDetails={toggleDetails}
              onToggleAllVotes={toggleAllVotes}
              loadingMore={loadingMore}
              hasNext={hasNext}
              searchMore={searchMore}
            />
          )}
        </div>
      )}

      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
    </main>
  );
}
