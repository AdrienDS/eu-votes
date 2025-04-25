import { trackEvent } from '@/utils/mixpanelClient';
import { Modal } from './Modal';
import Image from 'next/image';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About" width="xl">
          <div className="prose max-w-none secondary-text space-y-4">
          <p className="text-md text-justify">
            This app helps you quickly understand how Members of the European Parliament (MEPs) vote on topics that matter to you. 
            Filter by country and political group, type in a subject - like <em>energy</em>, <em>migration</em>, or <em>cybersecurity</em> - 
            and instantly see a visual summary of how selected groups voted on the most relevant motions.
          </p>

          <p className="text-md text-justify">
            It uses data from the excellent{' '}
            <a className="link" href="https://howtheyvote.eu" target="_blank" onClick={() => trackEvent('HowTheyVote')}>
              HowTheyVote.eu
            </a>{' '}
            API, which provides detailed information about every vote and every MEP.
          </p>

          <p className="text-md text-justify">
            The idea came from noticing that a political group&apos;s voting record didn&apos;t always align with positions I cared about.
            I found there was already a lot of useful data available on EU voting patterns, 
            but I felt it would be helpful to see a group&apos;s stance on a topic summarized clearly on a single page. This app was created with that goal in mind.
          </p>

          <p className="text-md text-justify">
            National politics tend to dominate the headlines, while the decisions made in the 
            European Parliament are often underreported, 
            even though they shape policies that affect us all. 
            My hope is that this app contributes to making the EU&apos;s legislative work more transparent and accessible, 
            and helps citizens stay informed and engaged.
          </p>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm secondary-text">
                Built by{' '}
                <a className="link" href="https://www.linkedin.com/in/dsadrien" onClick={() => trackEvent('Linkedin')} target="_blank">Adrien David</a>{' '}
                {/* with{' '}
                <a className="link" href="https://nextjs.org" target="_blank">Next.js</a>{' '} */}
                and hosted by{' '}
                <a className="link" href="https://vercel.com" target="_blank" onClick={() => trackEvent('Vercel')}>Vercel</a>.
                View source on {' '}
                <a className="link" href="https://github.com/AdrienDS/eu-votes" target="_blank" onClick={() => trackEvent('Github')}>Github</a>.
              </p>
              <p className="text-sm secondary-text flex gap-6 mt-2 justify-center">
                <a className="link flex" href="https://buymeacoffee.com/adriend" onClick={() => trackEvent('Coffee')} target="_blank" id='bmc-btn'>
                  <Image src="/bmc-blue.png" alt="Buy me a coffee" height={32} width={114} />
                </a> 
                <a className="link flex" href="https://paypal.me/adri2124" onClick={() => trackEvent('Paypal')} target="_blank" id="pp-btn">
                  <Image src="/pp.jpg" alt="PayPal" height={32} width={51} />
                </a>
              </p>
            </div>
          </div>
    </Modal>
  );
} 