import pako from 'pako';
import { Member, Vote, MemberVote } from '@/types';
import { decodePositions, encodePositions, MetaVote } from './compression';
import { base64ToUint8Array, uint8ArrayToBase64 } from './encoding';

const CACHE_KEY = 'eu_votes_vote_cache';
const CACHE_KEY_MEP = 'eu_votes_mep_cache';

const HOUR_IN_MS = 60 * 60 * 1000;
const CACHE_EXPIRY = 7 * 24 * HOUR_IN_MS;

const MAX_CACHE_SIZE = 1000; // Maximum number of votes to cache
const MAX_MEP_CACHE_SIZE = 1500; // Maximum number of MEP to cache
const VERBOSE_CACHE_LOGS = false;


interface VoteCacheEntry {
  t: number;
  m: string;
  v: string;
  n: number;
}

interface MEPCacheEntry {
  t: number;
  m: string;
}

interface VoteCache {
  [key: string]: VoteCacheEntry;
}

interface MEPCache {
  [key: string]: MEPCacheEntry;
}

interface DatedCache {
  [key: string]: { t: number; }
}

export async function getCachedVote(voteId: string): Promise<Vote | null> {
  function log(msg: string) {
    if (!VERBOSE_CACHE_LOGS) return;
    console.log(`getCachedVote(${voteId}). ${msg}`);
  }
  try {
    const cacheStr = localStorage.getItem(CACHE_KEY);
    log(`Cache is ${(Math.round(cacheStr?.length || 0) / 1024)} kB`);
    if (!cacheStr) return null;

    const cache: VoteCache = JSON.parse(cacheStr);
    const entry = cache[voteId];
    
    if (!entry) {
      log(`No entry found`);
      return null;
    }
    
    // Check if cache is expired
    if (Date.now() - entry.t > CACHE_EXPIRY) {
      log(`Cache expired (Set on: ${new Date(entry.t).toLocaleString()})`);
      delete cache[voteId];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      return null;
    }

    return await decodeVote(entry);
  } catch (error) {
    console.error(`Error reading vote ${voteId} from cache:`, error);
    // Clear potentially corrupted cache
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

export async function setCachedVote (voteId: string, vote: Vote) {
  const dtFetched = Date.now();
  const cacheStr = localStorage.getItem(CACHE_KEY);
  let cache: VoteCache = cacheStr ? JSON.parse(cacheStr) : {};
  logCacheSize(`setCachedVote(${voteId})`, cacheStr?.length, cache);
  cache = pruneCache(cache);
  cache[voteId] = await encodeVote(vote);
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  await storeAllMEPs(vote.member_votes.map(mv => mv.member), dtFetched);
}

export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_KEY_MEP);
  if (VERBOSE_CACHE_LOGS) console.log('Caches cleared');
} 

function pruneCache (cache: VoteCache, maxSize?: number): VoteCache;
function pruneCache (cache: MEPCache, maxSize?: number): MEPCache;
function pruneCache (cache: DatedCache, maxSize: number = MAX_CACHE_SIZE): DatedCache {
  const entries = Object.entries(cache);
  if (entries.length >= maxSize) {
    // Sort by timestamp and keep only the most recent entries
    // entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    entries.sort((a, b) => b[1].t - a[1].t);
    const newCache: DatedCache = {};
    entries.slice(0, maxSize - 1).forEach(([key, value]) => {
      newCache[key] = value;
    });
    return newCache;
  }
  return cache;
}

async function hydrateCachedMEP (votesMeta: MetaVote[]): Promise<MemberVote[] | null> {
  const cacheStr = localStorage.getItem(CACHE_KEY_MEP);
  if (!cacheStr) return null;

  const cache: MEPCache= JSON.parse(cacheStr);
  const memberVotes: MemberVote[] = [];
  for (const vm of votesMeta) {
    const entry = cache[vm.member.id];
    if (!entry) return null; // If we're missing even 1 MEP, return null to force re-fetch
    const buff = await base64ToUint8Array(entry.m);
    const member = JSON.parse(new TextDecoder().decode(pako.inflate(buff)));
    memberVotes.push({ member, position: vm.position });
  }
  return memberVotes;
}

async function setMEPinCache (cache: MEPCache, mep: Member, dtFetched: number) {
  const t = cache[mep.id]?.t ?? 0;
  if (t + 2 * HOUR_IN_MS> dtFetched) return false // A MEP fetched less than 2 hours ago should be up to date
  cache[mep.id] = {
    t: dtFetched,
    m: await uint8ArrayToBase64(pako.deflate(JSON.stringify(mep))),
  }
  return true
}

async function storeAllMEPs (meps: Member[], dtFetched: number) {
  const cacheStr = localStorage.getItem(CACHE_KEY_MEP);
  let cache: MEPCache = cacheStr ? JSON.parse(cacheStr) : {};
  let updated = false;
  for (const mep of meps) {
    if(await setMEPinCache(cache, mep, dtFetched)) updated = true
  }
  if (updated) {
    cache = pruneCache(cache, MAX_MEP_CACHE_SIZE);
    localStorage.setItem(CACHE_KEY_MEP, JSON.stringify(cache));
    logCacheSize(`storeAllMEPs`, cacheStr?.length, cache);
  }
}

async function encodeVote (vote: Vote): Promise<VoteCacheEntry> {
  const { member_votes: memberVotes, ...voteMetadata } = vote;
  const metaBuffer = pako.deflate(JSON.stringify(voteMetadata));
  const votesBuffer = encodePositions(memberVotes);
  return {
    t: Date.now(),
    m: await uint8ArrayToBase64(metaBuffer),
    v: await uint8ArrayToBase64(votesBuffer),
    n: memberVotes.length,
  }
}

export function attemptToSetCachedVote (voteId: string, vote: Vote) {
  setCachedVote(voteId, vote).catch(e => {
    console.error('Error setting cached vote:', e);
  });
}

function logCacheSize (prefix: string, cacheLength: number | undefined, cache: VoteCache|MEPCache|Cache) {
  if (!VERBOSE_CACHE_LOGS) return;
  const cacheSize = Math.round((cacheLength || 0) / 1024);
  const nbEntries = Object.keys(cache).length;
  console.log(`${prefix}. Cache has ${nbEntries} entries and is ${cacheSize} kB (${(cacheSize / nbEntries).toFixed(2)} kB per entry)`);
}

async function decodeVote(data: VoteCacheEntry): Promise<Vote | null> {
  const metaBuffer = await base64ToUint8Array(data.m);
  const votesBuffer = await base64ToUint8Array(data.v);
  const voteMetadata = JSON.parse(new TextDecoder().decode(pako.inflate(metaBuffer)));
  const metaVotes = decodePositions(votesBuffer, data.n);
  const memberVotes = await hydrateCachedMEP(metaVotes);
  if (VERBOSE_CACHE_LOGS) console.log(`decodeVote(${voteMetadata.id}). Member votes: ${memberVotes?.length}`);
  if (!memberVotes) return null;
  // await Promise.all(memberVotes.map(async mv => mv.member = await getCachedMEP(mv.member.id)));
  return {
    ...voteMetadata,
    member_votes: memberVotes,
  }
}

// ====== Functions for individual MEPs: Not used since we always cache/retrieve a whole list ======

// async function storeMEP (mep: Member, dtFetched: number) {
//   const cacheStr = localStorage.getItem(CACHE_KEY_MEP);
//   let cache: MEPCache = cacheStr ? JSON.parse(cacheStr) : {};
//   if (await setMEPinCache(cache, mep, dtFetched)) {
//     localStorage.setItem(CACHE_KEY_MEP, JSON.stringify(cache));
//   }
// }

// async function getCachedMEP (mepId: string): Promise<Member | null> {
//   const cacheStr = localStorage.getItem(CACHE_KEY_MEP);
//   if (!cacheStr) return null;

//   const cache: MEPCache= JSON.parse(cacheStr);
//   const entry = cache[mepId];
//   if (!entry) return null;

//   const buff = await base64ToUint8Array(entry.m);
//   return JSON.parse(new TextDecoder().decode(pako.inflate(buff)));
// }