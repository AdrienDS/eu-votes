import { VoteStats } from '@/types';
import { positionNames, positionColors, positionsOrders } from '@/utils/votes';

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
        {positionsOrders.bar.map((position) => (
          <div
            key={position}
            className={`bg-${positionColors[position]} text-white text-xs flex items-center justify-center`}
            style={{ width: `${getWidth(stats[position])}%` }}
          >
            {Number(getPercentage(stats[position])) > 10 && stats[position]}
          </div>
        ))}
      </div>
      <div className="absolute z-10 hidden group-hover:block bg-white border rounded-lg shadow-lg p-2 text-xs whitespace-nowrap top-6 left-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {positionsOrders.tooltip.map((position) => (
            <div className="flex items-center gap-2" key={position}>
              <div className={`w-3 h-3 bg-${positionColors[position]} rounded-sm`}></div>
              <span className="primary-text">{positionNames[position]}: {stats[position]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 