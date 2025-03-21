import { Search } from '@/components/icons';
import SearchableModal from './SearchableModal';
import { SearchFilters } from '@/types';

interface SearchPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  countries: Array<{ value: string; label: string; short_label?: string }>;
  groups: Array<{ value: string; label: string; short_label?: string }>;
}

export const SearchPanel = ({ 
  filters, 
  onFiltersChange, 
  onSearch,
  countries,
  groups
}: SearchPanelProps) => {
  return (
    <div className="mb-8">
      <div className="flex gap-4 mb-1">
        <div className="flex-1 relative">
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
            placeholder="Search votes..."
            className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white pr-12"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <button
            onClick={onSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            title="Search"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <SearchableModal
          title="Countries"
          singularTitle='Country'
          items={countries}
          selectedItems={filters.countries}
          onSelect={(items: string[]) => onFiltersChange({ ...filters, countries: items })}
          showFlags
          minWidth="80px"
        />
        <SearchableModal
          title="Political Groups"
          singularTitle='Political Group'
          items={groups}
          selectedItems={filters.groups}
          onSelect={(items: string[]) => onFiltersChange({ ...filters, groups: items })}
          minWidth="110px"
        />
      </div>
    </div>
  );
}; 