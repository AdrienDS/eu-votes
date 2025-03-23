import { MemberVote, Position, SearchFilters } from '@/types';

export const filterVotes = (votes: MemberVote[], filters: SearchFilters): MemberVote[] => {
  return votes.filter(mv => 
    (filters.countries.length === 0 || filters.countries.includes(mv.member.country.iso_alpha_2)) &&
    (filters.groups.length === 0 || filters.groups.includes(mv.member.group.code))
  );
};

export const calculateVoteStats = (votes: MemberVote[]) => {
  return {
    FOR: votes.filter(mv => mv.position === 'FOR').length,
    AGAINST: votes.filter(mv => mv.position === 'AGAINST').length,
    ABSTENTION: votes.filter(mv => mv.position === 'ABSTENTION').length,
    DID_NOT_VOTE: votes.filter(mv => mv.position === 'DID_NOT_VOTE').length
  };
}; 

export const positionNames = {
  FOR: 'For',
  AGAINST: 'Against',
  ABSTENTION: 'Abstain',
  DID_NOT_VOTE: 'No Vote',
};

export const positionColors = {
  FOR: 'green-600',
  AGAINST: 'red-600',
  ABSTENTION: 'gray-400',
  DID_NOT_VOTE: 'gray-300',
};

// export const positionBgColors = {
//   FOR: 'bg-green-600',
//   AGAINST: 'bg-red-600',
//   ABSTENTION: 'bg-gray-400',
//   DID_NOT_VOTE: 'bg-gray-300',
// };

// export const positionTextColors = {
//   FOR: 'text-green-600',
//   AGAINST: 'text-red-600',
//   ABSTENTION: 'text-gray-400',
//   DID_NOT_VOTE: 'text-gray-300',
// };

export const positionsOrders: {[key: string]: Position[]} = {
  bar: [
    'FOR',
    'ABSTENTION',
    'DID_NOT_VOTE',
    'AGAINST',
  ],
  tooltip: [
    'FOR',
    'AGAINST',
    'ABSTENTION',
    'DID_NOT_VOTE',
  ],
}