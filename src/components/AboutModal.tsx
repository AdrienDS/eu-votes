import { Modal } from './Modal';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About" width="md">
          <div className="prose max-w-none secondary-text space-y-4">
            <p className="text-md">
              This app uses the data from the great{' '}
              <a className="link" href="https://howtheyvote.eu" target="_blank">howtheyvote.eu</a>{' '}
              API to search for votes, and get details on every vote, including your MEPs information.
            </p>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm secondary-text">
                Built by{' '}
                <a className="link" href="https://adrien.davidsivelle.com" target="_blank">Adrien David</a>{' '}
                 with{' '}
                <a className="link" href="https://nextjs.org" target="_blank">Next.js</a>{' '}
                and hosted by{' '}
                <a className="link" href="https://vercel.com" target="_blank">Vercel</a>.
                View source on {' '}
                <a className="link" href="https://github.com/AdrienDS/eu-votes" target="_blank">Github</a>.
              </p>
            </div>
          </div>
    </Modal>
  );
} 