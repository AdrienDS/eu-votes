import { Modal } from './Modal';
import Image from 'next/image';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About" width="lg">
          <div className="prose max-w-none secondary-text space-y-4">
            <p className="text-md text-justify">
              This app uses the data from the great{' '}
              <a className="link" href="https://howtheyvote.eu" target="_blank">HowTheyVote.eu</a>{' '}
              API to search for votes, and get details on every vote, including information about the members of the European Parliament.
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm secondary-text">
                Built by{' '}
                <a className="link" href="https://www.linkedin.com/in/dsadrien" target="_blank">Adrien David</a>{' '}
                {/* with{' '}
                <a className="link" href="https://nextjs.org" target="_blank">Next.js</a>{' '} */}
                and hosted by{' '}
                <a className="link" href="https://vercel.com" target="_blank">Vercel</a>.
                View source on {' '}
                <a className="link" href="https://github.com/AdrienDS/eu-votes" target="_blank">Github</a>.
              </p>
              <p className="text-sm secondary-text flex gap-6 mt-2 justify-center">
                <a className="link flex" href="https://buymeacoffee.com/adriend" target="_blank">
                  <Image src="/bmc-blue.png" alt="Buy me a coffee" height={32} width={114} />
                </a> 
                <a className="link flex" href="https://paypal.me/adri2124" target="_blank">
                  <Image src="/pp.jpg" alt="PayPal" height={32} width={51} />
                </a>
              </p>
            </div>
          </div>
    </Modal>
  );
} 