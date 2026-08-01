import type { DomainFilter, SourceFilter } from '../../types';

interface FilterBarProps {
  domain: DomainFilter;
  onDomainChange: (d: DomainFilter) => void;
  indianSource: SourceFilter;
  onIndianSourceChange: (source: SourceFilter) => void;
  globalSource: SourceFilter;
  onGlobalSourceChange: (source: SourceFilter) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

const domains: DomainFilter[] = ['India', 'All', 'AI', 'Web3', 'Fintech', 'Student', 'General'];
const indianSources: SourceFilter[] = ['All', 'Unstop', 'Devfolio', 'HackerEarth', 'Reskilll', 'Hack2Skill', 'SIH'];
const globalSources: SourceFilter[] = ['All', 'Devpost', 'MLH', 'ETHGlobal', 'Colosseum', 'DoraHacks'];

function sourceLabel(source: SourceFilter) {
  return source === 'All' ? 'All Indian sources' : source;
}

export default function FilterBar({
  domain,
  onDomainChange,
  indianSource,
  onIndianSourceChange,
  globalSource,
  onGlobalSourceChange,
  search,
  onSearchChange,
}: FilterBarProps) {
  const handleIndianSourceChange = (source: SourceFilter) => {
    onIndianSourceChange(source);
    if (source !== 'All') onGlobalSourceChange('All');
  };

  const handleGlobalSourceChange = (source: SourceFilter) => {
    onGlobalSourceChange(source);
    if (source !== 'All') onIndianSourceChange('All');
  };

  return (
    <div className="px-4 desktop:px-6 py-3 desktop:py-4 space-y-3">
      <div className="flex flex-col desktop:flex-row desktop:items-center gap-3 desktop:gap-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 desktop:pb-0">
          {domains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDomainChange(d)}
              className={`chip flex-shrink-0 ${
                domain === d ? 'chip-active' : ''
              } ${d === 'India' ? 'border-accent-amber/50 bg-accent-amber/5 text-text-primary' : ''}`}
            >
              {d === 'India' ? (
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true">🇮🇳</span>
                  <span>India</span>
                </span>
              ) : (
                d
              )}
            </button>
          ))}
        </div>

        <div className="desktop:ml-auto relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search hackathons..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full desktop:w-[280px] pl-10 pr-4 py-2.5 rounded-lg bg-base border border-base-border text-sm text-text-primary placeholder:text-text-muted focus:border-accent-amber/50 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex-shrink-0">
            India sources
          </span>
          {indianSources.map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => handleIndianSourceChange(source)}
              className={`chip flex-shrink-0 ${indianSource === source ? 'chip-active' : ''}`}
            >
              {sourceLabel(source)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex-shrink-0">
            Global sources
          </span>
          {globalSources.map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => handleGlobalSourceChange(source)}
              className={`chip flex-shrink-0 ${globalSource === source ? 'chip-active' : ''}`}
            >
              {source === 'All' ? 'All global sources' : source}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


