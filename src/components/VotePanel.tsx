import { SearchFilters, Vote, Position } from '@/types';
import { AutoSizer } from 'react-virtualized';
import { formatDate } from '@/utils/date';
import { VoteBar } from './VoteBar';
import { ChevronDown, Filter, OpenInNew } from './icons';
import { Facts } from './Facts';
import { Grid, GridCellProps } from 'react-virtualized';
import { MEPCard } from './MEPCard';
import { useState, useCallback } from 'react';
import { calculateVoteStats, filterVotes, positionColors, positionNames, positionsOrders } from '@/utils/votes';

interface VoteBarProps {
  vote: Vote;
  filters: SearchFilters;
  onToggleVote: (voteId: string) => void;
  expandedVotes: Set<string>;
}

export function VotePanel({ vote, filters, onToggleVote, expandedVotes }: VoteBarProps) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [positionFilter, setPositionFilter] = useState<Position[]>([]);

  const toggleDetailsVisible = useCallback(() => {
    setDetailsVisible(!detailsVisible);
  }, [detailsVisible]);

  const togglePositionFilter = useCallback((position: Position) => {
    setPositionFilter(prev => prev.includes(position) ? prev.filter(p => p !== position) : [...prev, position]);
  }, []);

  const filteredVotes = filterVotes(vote.member_votes, filters);

  const stats = calculateVoteStats(filteredVotes);

  const visibleVotes = positionFilter.filter(p => stats[p] > 0).length > 0 ?
    filteredVotes.filter(vote => positionFilter.includes(vote.position)) :
    filteredVotes;


  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div key={vote.id} className="border rounded-lg overflow-hidden">
      <button
        onClick={() => onToggleVote(vote.id)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center text-left cursor-pointer gap-2 sm:gap-4 min-h-[96px]"
      >
        <div className="flex-1 self-start">
          <h2 className="text-lg font-semibold primary-text">{vote.display_title}</h2>
          <p className="text-sm secondary-text">{formatDate(vote.timestamp)}</p>
        </div>
        <div className="flex items-center gap-4 self-start mt-[2px]">
          <div className="w-full sm:flex-none">
            {(
              <div className="w-full">
                <VoteBar stats={stats} total={total} />
              </div>
            )}
          </div>
          <div className="shrink-0 secondary-text md:hidden">
            <ChevronDown className={`h-6 w-6 transform transition-transform ${expandedVotes.has(vote.id) ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {expandedVotes.has(vote.id) && (
        <div className="px-4 py-3 border-t border-gray-100">                
          <Facts facts={vote.facts} />

          {/* Mobile Details Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => toggleDetailsVisible()}
              className="flex items-center gap-2 secondary-text hover:text-gray-400 cursor-pointer"
            >
              <span className="font-semibold">Details</span>
              <ChevronDown className={`h-5 w-5 transform transition-transform ${detailsVisible ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Details Grid - Hidden on mobile unless expanded */}
          <div className={`${detailsVisible ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <h3 className="font-semibold primary-text">Procedure</h3>
                <p className="primary-text">
                  {vote.procedure && typeof vote.procedure === 'object' 
                    ? `${vote.procedure.title} (${vote.procedure.reference})`
                    : vote.procedure || 'No procedure information'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold primary-text">Description</h3>
                <p className="primary-text mb-4">{vote.description}</p>
                <h3 className="font-semibold primary-text">Total Votes</h3>
                <p className="primary-text">
                  {Object.values(vote.stats.total).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              {vote.sources.length > 0 && (
                <div>
                  <h3 className="font-semibold primary-text">Sources</h3>
                  <ul className="list-disc list-inside primary-text">
                    {vote.sources.map((source, index) => (
                      <li key={index}>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:text-blue-600"
                        >
                          {source.name}
                          <OpenInNew className="inline-block w-4 h-4 ml-1 mb-0.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="items-center justify-between sm:flex mb-2">
              <div className="flex items-center gap-2 text-gray-500 sm:hidden float-right">
                  <Filter className="h-5 w-5 mr-1" />
                </div>
              <h3 className="font-semibold primary-text mb-2">MEP Votes</h3>
              <div className="grid grid-cols-2 gap-2 sm:flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-gray-500 hidden sm:block">
                  <Filter className="h-5 w-5 mr-1" />
                </div>
                {positionsOrders.tooltip.map(position => {
                  const isEnabled = stats[position] > 0;
                  const isActive = positionFilter.includes(position) && isEnabled;
                  return (
                    <button
                      key={position}
                      onClick={() => isEnabled ? togglePositionFilter(position) : null}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1 border border-gray-200 ${isActive ? 'bg-gray-200' : ''} ${isEnabled ? 'cursor-pointer hover:ring-1 hover:ring-gray-100' : 'cursor-not-allowed'}`}
                    >
                      <div className={`w-3 h-3 bg-${positionColors[position]} rounded-sm`}></div>
                      <span className={`${isEnabled ? 'primary-text hover:text-gray-700' : 'secondary-text'}`}>{positionNames[position]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="h-[400px] md:h-[600px] pr-4">
              <AutoSizer>
                {({ width, height }) => {
                  const cardWidth = 420;
                  const columnCount = Math.max(1, Math.floor(width / cardWidth));
                  const rowCount = Math.ceil(visibleVotes.length / columnCount);
                  // console.log('AutoSizer', { width, height, columnCount, rowCount });
                  const cellRenderer = ({ columnIndex, rowIndex, key, style }: GridCellProps) => {
                    const index = rowIndex * columnCount + columnIndex;
                    if (index >= visibleVotes.length) return null;
                    return (
                      <MEPCard
                        key={key}
                        vote={visibleVotes[index]}
                        style={{
                          ...style,
                          width: Math.min(400, width / columnCount - 20),
                          margin: '5px',
                          height: width < 768 ? '160px' : '130px'
                        }}
                      />
                    );
                  };

                  return (
                    <Grid
                      className="scrollbar-custom"
                      cellRenderer={cellRenderer}
                      columnCount={columnCount}
                      columnWidth={width / columnCount}
                      height={height}
                      rowCount={rowCount}
                      rowHeight={width < 768 ? 170 : 140}
                      width={width}
                      style={{ padding: '5px' }}
                    />
                  );
                }}
              </AutoSizer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 