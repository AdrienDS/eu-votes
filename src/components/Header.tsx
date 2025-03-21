import { HelpModal } from './HelpModal';
import { AboutModal } from './AboutModal';
import { Share } from '@/components/icons';
import { useState } from 'react';
import { SearchFilters } from '@/types';
import Image from 'next/image';

interface HeaderProps {
  filters: SearchFilters;
}

export const Header = ({ filters }: HeaderProps) => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();
    
    // Add search term if present
    if (filters.searchTerm) {
      params.set('q', filters.searchTerm);
    }
    
    // Add countries if any are selected
    if (filters.countries.length > 0) {
      params.set('countries', filters.countries.join(','));
    }
    
    // Add groups if any are selected
    if (filters.groups.length > 0) {
      params.set('groups', filters.groups.join(','));
    }
    
    // Only add params if there are any
    if (params.toString()) {
      url.search = params.toString();
    }
    
    return url.toString();
  };

  const hasSearchParams = () => {
    return filters.searchTerm || filters.countries.length > 0 || filters.groups.length > 0;
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EU Votes Search',
          text: 'Search and explore votes in the European Parliament',
          url: shareUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
        copyToClipboardFallback(shareUrl);
      }
    } else {
      copyToClipboardFallback(shareUrl);
    }
  };

  const copyToClipboardFallback = (url: string) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    try {
      // Select the text
      textarea.select();
      textarea.setSelectionRange(0, 99999); // For mobile devices
      
      // Execute copy command
      document.execCommand('copy');
      
      // Show feedback
      alert(hasSearchParams() 
        ? 'Link copied to clipboard with your current search and filters'
        : 'Link copied to clipboard'
      );
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      alert('Could not copy link. Please copy it manually: ' + url);
    } finally {
      // Clean up
      document.body.removeChild(textarea);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative h-[50px] w-[50px]">
            <Image
              src="/favicon.svg"
              alt="EU Votes Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-lg sm:text-xl font-bold primary-text flex flex-col sm:flex-row sm:gap-1">
            <span>EU Votes</span>
            <span>Search</span>
          </h1>
        </div>
        <div className="flex gap-6">
          <button
            onClick={handleShare}
            className="link-secondary cursor-pointer flex items-center gap-1"
            title="Share"
          >
            <Share className="h-5 w-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => setHelpModalOpen(true)}
            className="link-secondary cursor-pointer"
          >
            Help
          </button>
          <button
            onClick={() => setAboutModalOpen(true)}
            className="link-secondary cursor-pointer"
          >
            About
          </button>
        </div>
      </div>

      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
    </>
  );
}; 