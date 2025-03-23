import { Vote, SearchFilters } from '@/types';
import { ChevronDown } from './icons';
import { Loader } from './Loader';
import { VotePanel } from './VotePanel';
import { useState } from 'react';

interface VoteListProps {
  votes: Vote[];
  filters: SearchFilters;
  loadingMore: boolean;
  hasNext: boolean;
  searchMore: () => void;
}

export function VoteList({
  votes,
  filters,
  loadingMore,
  hasNext,
  searchMore,
}: VoteListProps) {
  const [expandedVotes, setExpandedVotes] = useState<Set<string>>(new Set());

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

  const toggleAllVotes = (expand: boolean) => {
    setExpandedVotes(expand ? new Set(votes.map(v => v.id)) : new Set());
  };

  return (
    <>
      {votes.length > 0 && toggleAllVotes && (
        <div className="flex justify-between items-center mb-4">
          <div className="primary-text">
            {votes.length} votes
          </div>
          <div className="space-x-2">
            <button
              onClick={() => toggleAllVotes(true)}
              className="p-2 primary-text hover:text-gray-600"
              aria-label="Expand all"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
            <button
              onClick={() => toggleAllVotes(false)}
              className="p-2 primary-text hover:text-gray-600"
              aria-label="Collapse all"
            >
              <ChevronDown className="h-6 w-6 rotate-180" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {votes.map((vote) => (
          <VotePanel
            key={vote.id}
            vote={vote}
            filters={filters}
            onToggleVote={toggleVote}
            expandedVotes={expandedVotes}
          />
        ))}

        <div>
        {loadingMore ? (
          <Loader className="py-4" />
        ) : (
          hasNext && (
            <div className="flex justify-center items-center py-4">
              <button onClick={searchMore} className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer">
                Load More
              </button>
            </div>
          )
        )}
        </div>
      </div>
    </>
  );
} 