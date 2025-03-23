import { VoteStats } from '@/types';

interface VoteBarProps {
  stats: VoteStats['total'];
  total: number;
}

export function VoteBar({ stats, total }: VoteBarProps) {
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);
  const getWidth = (value: number) => ((value / total) * 100).toFixed(1);

  if (total === 0) return (
    <div className="relative group min-w-[200px]">
      <div className="flex h-6 rounded-xl overflow-hidden">
        <div 
          className="bg-gray-200 text-gray-400 text-xs flex items-center justify-center" 
          style={{ width: '100%', fontSize: '0.65rem' }}
        >
          No position matching these filters
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative group min-w-[200px]">
      <div className="flex h-6 rounded-xl overflow-hidden">
        <div
          className="bg-green-600 text-white text-xs flex items-center justify-center"
          style={{ width: `${getWidth(stats.FOR)}%` }}
        >
          {Number(getPercentage(stats.FOR)) > 10 && stats.FOR}
        </div>
        <div
          className="bg-gray-400 text-white text-xs flex items-center justify-center"
          style={{ width: `${getWidth(stats.ABSTENTION)}%` }}
        >
          {Number(getPercentage(stats.ABSTENTION)) > 10 && stats.ABSTENTION}
        </div>
        <div
          className="bg-gray-300 text-white text-xs flex items-center justify-center"
          style={{ width: `${getWidth(stats.DID_NOT_VOTE)}%` }}
        >
          {Number(getPercentage(stats.DID_NOT_VOTE)) > 10 && stats.DID_NOT_VOTE}
        </div>
        <div
          className="bg-red-600 text-white text-xs flex items-center justify-center"
          style={{ width: `${getWidth(stats.AGAINST)}%` }}
        >
          {Number(getPercentage(stats.AGAINST)) > 10 && stats.AGAINST}
        </div>
      </div>
      <div className="absolute z-10 hidden group-hover:block bg-white border rounded-lg shadow-lg p-2 text-xs whitespace-nowrap top-6 left-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
            <span className="primary-text">For: {stats.FOR}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
            <span className="primary-text">Against: {stats.AGAINST}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
            <span className="primary-text">Abstain: {stats.ABSTENTION}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
            <span className="primary-text">No Vote: {stats.DID_NOT_VOTE}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 