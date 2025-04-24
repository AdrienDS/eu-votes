import { Search } from '@/components/icons';
import SearchableModal from './SearchableModal';
import { SearchFilters, SortOption } from '@/types';
import { SortDropdown } from './SortDropdown';

interface SearchPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  searchTerm: string;
  onSearchTermChange: (searchTerm: string) => void;
  onSearch: () => void;
  countries: Array<{ value: string; label: string; short_label?: string }>;
  groups: Array<{ value: string; label: string; short_label?: string }>;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

export const SearchPanel = ({ 
  searchTerm,
  onSearchTermChange,
  filters, 
  onFiltersChange, 
  onSearch,
  countries,
  groups,
  sortBy,
  onSortChange
}: SearchPanelProps) => {
  return (
    <div className="mb-8">
      <div className="flex gap-4 mb-1">
        <div className="flex-1 relative">
          <input
            id="search-bar"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search votes..."
            className="w-full px-4 py-2 border rounded-lg text-gray-900 bg-white pr-12"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <button
            id="search-btn"
            onClick={onSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
            title="Search"
            aria-label="Search"
          >
            <Search className="h-6 w-6" />
          </button>
        </div>
        <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />
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
          minWidth="180px"
        />
      </div>
    </div>
  );
}; 