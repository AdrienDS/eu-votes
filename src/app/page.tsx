'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { SearchFilters, Vote } from '@/types';
import { searchVotesWithDetails, parseUrlParams } from '@/utils/api';
import { VoteList } from '@/components/VoteList';
import { COUNTRIES, GROUPS } from '@/constants/filters';
import { Header } from '@/components/Header';
import { SearchPanel } from '@/components/SearchPanel';
import { Loader } from '@/components/Loader';
import { sampleSearchTerms } from '@/utils/votes';
import { initMixpanel, trackEvent } from '@/utils/mixpanelClient';
import { debounce } from '@/utils/utils';

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({
    countries: [],
    groups: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const isInitialLoad = useRef(true);
  const latestFilters = useRef(filters);

  const debouncedFilterChanged = useMemo(() => debounce(() => {
    trackEvent('Filters Changed', latestFilters.current);
  }, 3000, false), []);

  useEffect(() => {
    const current = JSON.stringify(latestFilters.current)
    if (current !== JSON.stringify(filters)) {
      latestFilters.current = filters;
      debouncedFilterChanged(); // if (current !== '{}') 
    }
  }, [filters, debouncedFilterChanged]);

  useEffect(() => {
    initMixpanel();
  }, []);

  async function searchVotes (searchTerm: string, filters: SearchFilters, loadingSetter: (loading: boolean) => void, page?: number | null) {
    loadingSetter(true);
    setError(null);
    try {
      const { 
        results: newVotes, total: totalVotes, page: newPage, has_next: newHasNext,
       } = await searchVotesWithDetails(searchTerm, filters, page);
      setPage(newPage);
      setHasNext(newHasNext);
      setCurrentSearch(searchTerm);
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
    const newVotes = await searchVotes(currentSearch, filters, setLoadingMore, (page || 1) + 1);
    trackEvent('Search More', { searchTerm: currentSearch, page: (page || 1) + 1, nbResults: newVotes?.length, filters });
    if (newVotes?.length) setVotes([...votes, ...newVotes]);
  }, [currentSearch, hasNext, page, votes, filters]);

  const handleSearch = useCallback(async () => {
    const newVotes = await searchVotes(searchTerm, filters, setLoading);
    if (searchTerm) trackEvent('Search', { searchTerm, nbResults: newVotes?.length, filters, type: 'regular' });
    if (newVotes?.length) setVotes(newVotes);
  }, [filters, searchTerm]);

  const handleSeachAndRun = useCallback(async (term: string) => {
    setFilters(filters);
    setSearchTerm(term);
    const newVotes = await searchVotes(term, filters, setLoading);
    trackEvent('Search', { searchTerm: term, nbResults: newVotes?.length, filters, type: 'sample' });
    if (newVotes?.length) setVotes(newVotes);
  }, [filters]);

  useEffect(() => {
    if (!isInitialLoad.current) return;
    
    const { searchTerm, filters } = parseUrlParams();
    setFilters(filters);
    if (searchTerm) {
      setSearchTerm(searchTerm);
      searchVotes(searchTerm, filters, setLoading).then(newVotes => {
        trackEvent('Search', { searchTerm, nbResults: newVotes?.length, type: 'initial' });
        // console.log('Initial Search results:', { votes: newVotes.length });
        if (newVotes?.length) setVotes(newVotes);
      });
    }
    isInitialLoad.current = false;
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <Header filters={filters} searchTerm={searchTerm} />
      <SearchPanel
        filters={filters}
        onFiltersChange={setFilters}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        countries={COUNTRIES}
        groups={GROUPS}
      />

      {loading && (<Loader className="py-8" />)}
      {error && <div className="text-center text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="space-y-4">
          {isInitialLoad.current ? '' : (!hasSearched || (!searchTerm && !total)) ? (
            <div className="text-center text-gray-900 py-8">
              Try searching votes using keywords, for example:
              <br />
              {
                sampleSearchTerms.map(term => (
                  <button 
                    key={term}
                    className="link mx-1 px-1 cursor-pointer" 
                    onClick={() => handleSeachAndRun(term)}
                  >
                    {term}
                  </button>
                ))
              }
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
              filters={filters}
              loadingMore={loadingMore}
              hasNext={hasNext}
              searchMore={searchMore}
            />
          )}
        </div>
      )}
    </main>
  );
}
