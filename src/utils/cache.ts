import { Vote } from '@/types';
import pako from 'pako';

const CACHE_KEY = 'eu_votes_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 100; // Maximum number of votes to cache

interface CacheEntry {
  data: string; // compressed JSON
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry;
}

export function getCachedVote(voteId: string): Vote | null {
  try {
    const cacheStr = localStorage.getItem(CACHE_KEY);
    if (!cacheStr) return null;

    const cache: Cache = JSON.parse(cacheStr);
    const entry = cache[voteId];
    
    if (!entry) return null;
    
    // Check if cache is expired
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      delete cache[voteId];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      return null;
    }

    // Decompress the data
    const compressed = new Uint8Array(entry.data.split(',').map(Number));
    const decompressed = pako.inflate(compressed);
    return JSON.parse(new TextDecoder().decode(decompressed));
  } catch (error) {
    console.error('Error reading from cache:', error);
    // Clear potentially corrupted cache
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

export function setCachedVote(voteId: string, vote: Vote): void {
  try {
    const cacheStr = localStorage.getItem(CACHE_KEY);
    let cache: Cache = cacheStr ? JSON.parse(cacheStr) : {};

    // If cache is too large, remove oldest entries
    const entries = Object.entries(cache);
    if (entries.length >= MAX_CACHE_SIZE) {
      // Sort by timestamp and keep only the most recent entries
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const newCache: Cache = {};
      entries.slice(0, MAX_CACHE_SIZE - 1).forEach(([key, value]) => {
        newCache[key] = value;
      });
      cache = newCache;
    }

    // Compress the vote data
    const voteStr = JSON.stringify(vote);
    const compressed = pako.deflate(voteStr);

    // Store in cache
    cache[voteId] = {
      data: Array.from(compressed).join(','),
      timestamp: Date.now()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error writing to cache:', error);
    // Clear potentially corrupted cache
    localStorage.removeItem(CACHE_KEY);
  }
}

export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
  console.log('Cache cleared');
} 