import { useState, useRef, useEffect } from 'react';
import { Sort } from './icons';
import { SortOption } from '@/types';

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  onSearch: () => void;
}

export function SortDropdown({ sortBy, onSortChange, onSearch }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSortLabel = (sort: SortOption, expanded = false) => {
    switch (sort) {
      case 'RELEVANCE':
        return expanded ? 'Best Match' : 'Best';
      case 'NEWEST':
        return expanded ? 'Newest First' : 'Newest';
      case 'OLDEST':
        return expanded ? 'Oldest First' : 'Oldest';
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    onSortChange(newSort);
    setIsOpen(false);
    onSearch();
  };

  const sortOptions: SortOption[] = ['RELEVANCE', 'NEWEST', 'OLDEST'];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Button */}
      <button
        id="sort-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex w-[120px] md:w-[160px] px-4 py-2 border rounded-lg secondary-text bg-white hover:bg-gray-50 items-center cursor-pointer hover:ring-1 hover:ring-gray-100"
        title={`Sort by ${getSortLabel(sortBy, true)}`}
      >
        <Sort className="h-5 w-5 shrink-0" />
        <span className="ml-2 text-right flex-1">
          <span className="hidden md:inline">{getSortLabel(sortBy, true)}</span>
          <span className="md:hidden">{getSortLabel(sortBy, false)}</span>
        </span>
      </button>

      {/* Mobile Button */}
      <button
        id="sort-btn-mobile"
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden px-4 py-2 border rounded-lg secondary-text bg-white hover:bg-gray-50 flex items-center gap-2 cursor-pointer hover:ring-1 hover:ring-gray-100"
        title={`Sort by ${getSortLabel(sortBy, true)}`}
      >
        <Sort className="h-5 w-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b">
            Sort By
          </div>
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleSortChange(option)}
              className={`w-full px-4 py-2 cursor-pointer text-left hover:bg-gray-50 ${
                option === sortBy ? 'bg-gray-50' : ''
              }`}
            >
              {getSortLabel(option, true)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 