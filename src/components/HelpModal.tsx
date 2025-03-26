import { Modal } from './Modal';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help" width="lg">
      <div className="mt-3 sm:mt-0 sm:text-left">
        <div className="mt-4 text-sm secondary-text">
          <p className="mb-4 text-left">
            This tool helps you explore how Members of the European Parliament (MEPs) voted on various issues.
          </p>
          <h4 className="font-medium primary-text mb-2">Search and Filter</h4>
          <ul className="list-disc list-inside space-y-1 mb-4 text-left">
            <li>
              Use the search bar to find specific votes. 
              You can search for keywords such as &ldquo;Environment&rdquo;, &ldquo;Ukraine&rdquo;, &ldquo;Taxes&rdquo;, etc...
            </li>
            <li>Filter by country to see how MEPs from specific countries voted</li>
            <li>Filter by <a href="https://en.wikipedia.org/wiki/Political_groups_of_the_European_Parliament" target="_blank" className="link">political group</a> to see voting patterns within groups</li>
            <li>To find out which European Parliament Political Group a MEP belongs to, you can use the{' '}
              <a href="https://www.europarl.europa.eu/meps/en/search/advanced" target="_blank" className="link">European Parliament Advanced search</a>
              .</li>
          </ul>
          <h4 className="font-medium primary-text mb-2">View Details</h4>
          <ul className="list-disc list-inside space-y-1 mb-4 text-left">
            <li>Click on a vote to see detailed information</li>
            <li>View vote statistics and breakdowns</li>
            <li>See how individual MEPs voted</li>
            <li>Filter MEPs by position (For, Against, Abstained, ...)</li>
          </ul>
          <h4 className="font-medium primary-text mb-2">Share</h4>
          <p className="text-left">
            Use the share button to generate a link to your current view, including all active filters.
          </p>
        </div>
      </div>

    </Modal>
  );
}