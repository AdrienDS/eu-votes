import Image from 'next/image';
import { MemberVote, Vote } from '@/types';
import { MEP_CARD } from '@/constants/styles';
import { Email, Facebook, Twitter, Globe } from '@/components/icons';
import { Flag } from '@/components/Flag';
import { useState } from 'react';
import { MEPVotesModal } from './MEPVotesModal';

interface MEPCardProps {
  vote: MemberVote;
  style?: React.CSSProperties;
  allVotes: Vote[];
}

export function MEPCard({ vote, style, allVotes }: MEPCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div style={style} className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-4 p-3 card-hover h-full border rounded-lg">
        {/* Column 1: Picture */}
        <div className="shrink-0 flex items-center">
          <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
            <Image
              src={`https://howtheyvote.eu${vote.member.thumb_url}`}
              alt={`${vote.member.first_name} ${vote.member.last_name}`}
              fill
              className="object-cover"
              sizes={MEP_CARD.PICTURE_SIZE}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Column 2: Data */}
        <div className="flex flex-col justify-center gap-1 min-w-0">
          {/* Row 1: Name */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-left w-full cursor-pointer"
          >
            <span className="font-medium primary-text truncate hover:text-blue-600">
              {vote.member.first_name} {vote.member.last_name}
            </span>
          </button>
          
          {/* Row 2: Country */}
          <div className="flex items-center gap-2 text-sm secondary-text">
            <Flag countryCode={vote.member.country.iso_alpha_2} alt={`${vote.member.country.label} flag`} />
            <span>{vote.member.country.label}</span>
          </div>

          {/* Row 3: Group */}
          <div className="relative group">
            <span className="text-sm secondary-text truncate block">
              {vote.member.group.label}
            </span>
            <div className="tooltip">
              {vote.member.group.label}
            </div>
          </div>

          {/* Row 4: Links */}
          <div className="flex items-center gap-2 text-sm">
            {vote.member.email && (
              <a
                href={`mailto:${vote.member.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-secondary"
              >
                <Email className="h-4 w-4" />
              </a>
            )}
            {vote.member.facebook && (
              <a
                href={vote.member.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="link-secondary"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {vote.member.twitter && (
              <a
                href={vote.member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="link-secondary"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            <a
              href={`https://www.europarl.europa.eu/meps/en/${vote.member.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-secondary"
            >
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Column 3: Vote */}
        <div className="flex items-center md:col-span-1 col-span-2">
          <div className={`w-full md:w-24 h-7 md:h-24 flex items-center justify-center rounded-lg text-sm md:text-base font-medium ${
            vote.position === 'FOR' ? 'bg-green-100 text-green-800' :
            vote.position === 'AGAINST' ? 'bg-red-100 text-red-800' :
            vote.position === 'ABSTENTION' ? 'bg-gray-100 text-gray-600' :
            'bg-gray-50 text-gray-500'
          }`}>
            {vote.position === 'DID_NOT_VOTE' ? 'NO VOTE' : 
             vote.position === 'ABSTENTION' ? 'ABSTAIN' : 
             vote.position}
          </div>
        </div>
      </div>

      <MEPVotesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={vote.member}
        votes={allVotes}
      />
    </>
  );
} 