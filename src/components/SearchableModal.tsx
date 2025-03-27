'use client';

import { useState, useRef, useEffect } from 'react';
import { Flag } from './Flag';
import { Filter } from './icons';

interface SearchableModalProps {
  title: string;
  singularTitle?: string;
  items: Array<{
    value: string;
    label: string;
    short_label?: string;
  }>;
  selectedItems: string[];
  onSelect: (items: string[]) => void;
  showFlags?: boolean;
  minWidth?: string;
}

export default function SearchableModal({ 
  title, 
  singularTitle,
  items, 
  selectedItems, 
  onSelect,
  showFlags = false,
  minWidth = 'auto'
}: SearchableModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItem = (value: string) => {
    const newSelected = selectedItems.includes(value)
      ? selectedItems.filter(item => item !== value)
      : [...selectedItems, value];
    onSelect(newSelected);
  };

  const getDisplayLabel = (selectedItems: string[]) => {
    if (selectedItems.length === 0) return title;
    if (selectedItems.length === 1) return `1 ${singularTitle || title.slice(0, -1)}`;
    return `${selectedItems.length} ${title}`;
  };

  const getDisplayCount = () => {
    if (typeof window === 'undefined') return 4;
    return window.innerWidth < 768 ? 3 : 4;
  };

  return (
    <div className="relative mt-6" ref={modalRef}>
      {selectedItems.length > 0 && (
        <div className="absolute -top-5 left-2 text-xs secondary-text flex items-center gap-2">
          {getDisplayLabel(selectedItems)}
        </div>
      )}
      <button
        id={`${title}-modal-btn`}
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 border rounded-lg primary-text hover:bg-gray-50 flex items-center gap-2 cursor-pointer hover:ring-1 hover:ring-gray-100"
        style={{ minWidth }}
      >
        {selectedItems.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Filter className="h-4.5 w-4.5" />
            <span className="secondary-text">
              {title}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {selectedItems.length === 1 ? (
              showFlags ? (
                <Flag 
                  countryCode={selectedItems[0]} 
                  alt={`${items.find(i => i.value === selectedItems[0])?.label} flag`}
                />
              ) : (
                <span className="primary-text" id={`${title}-modal-item-list`}>
                  {items.find(i => i.value === selectedItems[0])?.short_label || items.find(i => i.value === selectedItems[0])?.label}
                </span>
              )
            ) : (
              <>
                {selectedItems.slice(0, getDisplayCount()).map((item) => (
                  showFlags ? (
                    <Flag 
                      key={item}
                      countryCode={item}
                      alt={`${items.find(i => i.value === item)?.label} flag`}
                    />
                  ) : (
                    <span key={item} className="primary-text" id={`${title}-modal-item-${item}`}>
                      {items.find(i => i.value === item)?.short_label || items.find(i => i.value === item)?.label}
                    </span>
                  )
                ))}
                {selectedItems.length > getDisplayCount() && (
                  <span className="secondary-text">+{selectedItems.length - getDisplayCount()}</span>
                )}
              </>
            )}
          </div>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 mt-1 w-[90vw] max-w-[384px] bg-white border rounded-lg shadow-lg"
          style={{
            left: 'calc(min(0px, 100vw - 90vw - 2rem))',
            maxWidth: 'min(70vw, 400px)'
          }}
        >
          <div className="p-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border rounded-lg mb-4 primary-text"
            />
            <div className="max-h-96 overflow-y-auto">
              {filteredItems.map((item) => (
                <label key={item.value} className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.value)}
                    onChange={() => toggleItem(item.value)}
                    className="rounded-sm text-blue-600 cursor-pointer"
                  />
                  {showFlags && (
                    <Flag 
                      countryCode={item.value}
                      alt={`${item.label} flag`}
                    />
                  )}
                  <span className="primary-text">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 