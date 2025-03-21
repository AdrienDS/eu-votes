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

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    countries: [],
    groups: [],
  });
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedVotes, setExpandedVotes] = useState<Set<string>>(new Set());
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const isInitialLoad = useRef(true);
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { results: newVotes, total: totalVotes } = await searchVotesWithDetails(filters);
      setVotes(newVotes);
      setTotal(totalVotes);
      setHasSearched(true);
      console.log('Search results:', { votes: newVotes.length, total: totalVotes });
    } catch (err) {
      setError('Failed to fetch votes. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!isInitialLoad.current) return;
    
    const params = parseUrlParams();
    if (params.searchTerm) {
      setLoading(true);
      setError(null);
      setFilters(params);
      searchVotesWithDetails(params).then(({ results: newVotes, total: totalVotes }) => {
        setVotes(newVotes);
        setTotal(totalVotes);
        setHasSearched(true);
        console.log('Search results:', { votes: newVotes.length, total: totalVotes });
      }).catch((err) => {
        setError('Failed to fetch votes. Please try again.');
        console.error('Search error:', err);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setFilters(params);
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

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="space-y-4">
          {!hasSearched ? (
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
            />
          )}
        </div>
      )}

      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
    </main>
  );
}
