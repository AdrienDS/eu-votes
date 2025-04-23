import { Vote, Member } from '@/types';
import { Modal } from './Modal';
import { VoteBar } from './VoteBar';
import { formatDate } from '@/utils/date';
import { calculateVoteStats } from '@/utils/votes';
import { Flag } from './Flag';

interface MEPVotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  votes: Vote[];
}

export function MEPVotesModal({ isOpen, onClose, member, votes }: MEPVotesModalProps) {
  const memberVotes = votes.map(vote => ({
    ...vote,
    member_votes: vote.member_votes.filter(mv => mv.member.id === member.id)
  })).filter(vote => vote.member_votes.length > 0);

  const stats = calculateVoteStats(memberVotes.flatMap(vote => vote.member_votes));
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Voting History - ${member.first_name} ${member.last_name}`}
      modalClass="md:w-[750px] lg:w-[900px]"
      width="custom"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold primary-text mb-4">{member.first_name} {member.last_name}</h3>
            <h4 className="flex items-center gap-2">
                <Flag countryCode={member.country.iso_alpha_2} alt={member.country.label} /> 
                {member.group.label}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold primary-text mb-4">Overall Voting Pattern</h3>
            <VoteBar stats={stats} total={total} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold primary-text">Vote Details</h3>
          <div className="space-y-3">
            {memberVotes.map(vote => {
              const memberVote = vote.member_votes[0];
              return (
                <div key={vote.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 border rounded-lg p-4">
                  <div className="min-w-0">
                    <h4 className="font-medium primary-text line-clamp-2">{vote.display_title}</h4>
                    <div className="text-sm secondary-text">{formatDate(vote.timestamp)}</div>
                  </div>
                  <div className="flex items-center justify-end md:justify-center">
                    <div className={`w-full md:w-24 h-7 md:h-12 flex items-center justify-center rounded-lg text-sm font-medium ${
                      memberVote.position === 'FOR' ? 'bg-green-100 text-green-800' :
                      memberVote.position === 'AGAINST' ? 'bg-red-100 text-red-800' :
                      memberVote.position === 'ABSTENTION' ? 'bg-gray-100 text-gray-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {memberVote.position === 'DID_NOT_VOTE' ? 'NO VOTE' : 
                       memberVote.position === 'ABSTENTION' ? 'ABSTAIN' : 
                       memberVote.position}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
} 