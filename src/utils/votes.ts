import { MemberVote, SearchFilters } from '@/types';

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