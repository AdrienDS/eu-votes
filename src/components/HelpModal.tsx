import { positionColors } from '@/utils/votes';
import { trackEvent } from '@/utils/mixpanelClient';
import { Modal } from './Modal';
import { Email, Facebook, Filter, Search, Share, Sort, Twitter } from './icons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help" width="xl">
      <div className="mt-3 sm:mt-0 sm:text-left">
        <div className="mt-4 text-sm secondary-text">
          <p className="mb-4 text-left">
            This app helps you explore how {' '}
            <span className="underline decoration-dotted underline-offset-4">Members of the European Parliament (MEPs)</span>
            {' '}voted on various issues.
          </p>
          <h4 className="font-medium primary-text mb-2">Search and Filter</h4>
          <ul className="list-disc list-inside space-y-1 mb-4 text-left">
            <li>
              <Search className="h-4.5 w-4.5 inline-block mr-1.5 "/>
              <span>  
                Use the search bar to find votes on a specific topic. 
                You can search for keywords such as &ldquo;Environment&rdquo;, &ldquo;Ukraine&rdquo;, &ldquo;Taxes&rdquo;, etc...
              </span>
            </li>
            <li>
              <Sort className="h-4 w-4 inline-block mr-2" />
              <span>By default, votes are sorted by relevance to your search term, but you can also sort by date to see the latest or oldest votes first.</span>
            </li>
            <li>
              <Filter className="h-4 w-4 inline-block mr-2" />
              <span>Filter by country to see how MEPs from specific countries voted</span>
            </li>
            <li>
              <Filter className="h-4 w-4 inline-block mr-2" />
              <span>
                Filter by {' '}
                <a href="https://en.wikipedia.org/wiki/Political_groups_of_the_European_Parliament" target="_blank" className="link" onClick={() => trackEvent('Help Wiki PoliticalGroup')}>political group</a>
                {' '}to see voting patterns within groups
                </span>
            </li>
            <li>To find out which European Parliament Political Group a MEP belongs to, you can use the{' '}
              <a href="https://www.europarl.europa.eu/meps/en/search/advanced" target="_blank" className="link" onClick={() => trackEvent('Help Parliament AdvancedSearch')}>European Parliament Advanced search</a>
              .</li>
          </ul>
          <h4 className="font-medium primary-text mb-2">View Details</h4>
          <ul className="list-disc list-inside space-y-1 mb-4 text-left">
            <li>Click on a vote to see detailed information</li>
            <li>View vote statistics and breakdowns</li>
            <li>Learn more about the text by opening the documents listed under &ldquo;Sources&rdquo;</li>
            <li>
              See how individual MEPs voted and contact them directly via
              <Email className="h-3 w-3 inline-block ml-1" /> 
              <Facebook className="h-3 w-3 inline-block ml-1" />
              <Twitter className="h-3 w-3 inline-block ml-1" />
            </li>
            <li>Click on a MEP&apos;s name to see their voting history on the selected topic</li>
            <li>
              <Filter className="h-4 w-4 inline-block mr-2 "/>
              <span>Filter MEPs by position (</span>
              <div className="inline-block">
                <div className={`w-3 h-3 bg-${positionColors.FOR} rounded-sm inline-block mx-1`}></div>For,
              </div>
              <div className="inline-block ml-1">
                <div className={`w-3 h-3 bg-${positionColors.AGAINST} rounded-sm inline-block mx-1`}></div>Against,
              </div> ...)
              </li>
          </ul>
          <h4 className="font-medium primary-text mb-2">Share</h4>
          <ul className="list-disc list-inside space-y-1 mb-4 text-left">
            <li><Share className="h-4 w-4 inline-block mr-2" /> {' '}
            Use the share button to generate a link to your current view, 
            including your search term, sort order, and all your active filters.</li>  
          </ul>
        </div>
      </div>

    </Modal>
  );
}