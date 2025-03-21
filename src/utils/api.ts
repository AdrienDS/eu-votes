import { SearchFilters, Vote, SearchResponse } from '@/types';
import { getCachedVote, setCachedVote } from './cache';

const API_BASE_URL = 'https://howtheyvote.eu/api';

export async function searchVotes(filters: SearchFilters): Promise<SearchResponse> {
  console.log('Attempting to search votes with filters:', filters);
  // Don't make the API call if there's no search term
  if (!filters.searchTerm.trim()) {
    return {
      results: [],
      total: 0,
      page: 1,
      page_size: 20,
      has_prev: false,
      has_next: false
    };
  }

  const params = new URLSearchParams();
  params.set('q', filters.searchTerm.trim());

  const response = await fetch(`${API_BASE_URL}/votes/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch votes');
  }

  return response.json();
}

export async function getVote(voteId: string): Promise<Vote> {
  // Try to get from cache first
  const cachedVote = getCachedVote(voteId);
  if (cachedVote) {
    return cachedVote;
  }

  // If not in cache, fetch from API
  const response = await fetch(`${API_BASE_URL}/votes/${voteId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch vote details');
  }

  const vote = await response.json();
  
  // Cache the vote
  setCachedVote(voteId, vote);
  
  return vote;
}

export async function searchVotesWithDetails(filters: SearchFilters): Promise<SearchResponse> {
  try {
    // First, get the search results
    const searchResponse = await searchVotes(filters);
    
    // Then, fetch details for each vote
    const votesWithDetails = await Promise.all(
      searchResponse.results.map(async (voteMetadata) => {
        try {
          const voteDetails = await getVote(voteMetadata.id);
          return {
            ...voteMetadata,
            member_votes: voteDetails.member_votes,
            stats: voteDetails.stats,
            facts: voteDetails.facts,
            sources: voteDetails.sources,
            procedure: voteDetails.procedure,
            sharepic_url: voteDetails.sharepic_url,
            related: voteDetails.related
          };
        } catch (error) {
          console.error(`Error fetching details for vote ${voteMetadata.id}:`, error);
          return voteMetadata as Vote; // Return the basic vote if details fetch fails
        }
      })
    );

    return {
      results: votesWithDetails,
      total: searchResponse.total,
      page: searchResponse.page,
      page_size: searchResponse.page_size,
      has_prev: searchResponse.has_prev,
      has_next: searchResponse.has_next
    };
  } catch (error) {
    console.error('Error in searchVotesWithDetails:', error);
    throw error;
  }
}

export const parseUrlParams = (): SearchFilters => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return { searchTerm: '', countries: [], groups: [] };
  }
  
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      searchTerm: params.get('q') || '',
      countries: params.get('countries')?.split(',').filter(Boolean) || [],
      groups: params.get('groups')?.split(',').filter(Boolean) || [],
    };
  } catch (error) {
    console.error('Error parsing URL params:', error);
    return { searchTerm: '', countries: [], groups: [] };
  }
};

export const generateShareUrl = (filters: SearchFilters): string => {
  if (typeof window === 'undefined') return '';
  
  const params = new URLSearchParams();
  if (filters.searchTerm) params.set('q', filters.searchTerm);
  if (filters.countries.length > 0) params.set('countries', filters.countries.join(','));
  if (filters.groups.length > 0) params.set('groups', filters.groups.join(','));
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}; 