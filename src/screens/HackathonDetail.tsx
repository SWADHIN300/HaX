import Modal from '../components/ui/Modal';
import type { Hackathon } from '../types';

interface HackathonDetailProps {
  hackathon: Hackathon | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatPrize(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
  return `$${amount}`;
}

export default function HackathonDetail({
  hackathon,
  isOpen,
  onClose,
  isBookmarked,
  onBookmark,
}: HackathonDetailProps) {
  if (!hackathon) return null;

  const isFeatured = hackathon.prizePool > 5000;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={undefined} fullScreenMobile>
      <div>
        {/* Banner Area */}
        <div
          className="relative h-44 desktop:h-56 flex items-end overflow-hidden bg-base"
          style={{ backgroundColor: hackathon.bannerColor }}
        >
          {hackathon.imageUrl && (
            <img
              src={hackathon.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-base-card via-base-card/30 to-black/20" />

          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 tap-target flex items-center justify-center rounded-full bg-black/40"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Source badge */}
          <div className="relative z-10 px-5 pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              {hackathon.source}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 desktop:px-6 py-5">
          {/* Title */}
          <h1 className="text-xl desktop:text-2xl font-bold text-text-primary tracking-tight leading-tight mb-4">
            {hackathon.title}
          </h1>

          {/* Stat Row */}
          <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3 mb-6">
            {/* Dates */}
            <div className="bg-base rounded-lg p-3 border border-base-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                Dates
              </p>
              <p className="text-xs text-text-primary font-medium">
                {formatDate(hackathon.dateStart)}
              </p>
              <p className="text-xs text-text-secondary">
                to {formatDate(hackathon.dateEnd)}
              </p>
            </div>

            {/* Location */}
            <div className="bg-base rounded-lg p-3 border border-base-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                Location
              </p>
              <div className="flex items-center gap-1.5">
                {hackathon.isOnline && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-sage flex-shrink-0" />
                )}
                <p className="text-xs text-text-primary font-medium">
                  {hackathon.location}
                </p>
              </div>
            </div>

            {/* Prize */}
            <div className="bg-base rounded-lg p-3 border border-base-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                Prize Pool
              </p>
              {isFeatured ? (
                <p className="text-lg font-bold gradient-text">
                  {formatPrize(hackathon.prizePool)}
                </p>
              ) : (
                <p className="text-sm font-semibold text-text-primary">
                  {formatPrize(hackathon.prizePool)}
                </p>
              )}
            </div>

            {/* Format */}
            <div className="bg-base rounded-lg p-3 border border-base-border">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                Format
              </p>
              <p className="text-xs text-text-primary font-medium">
                {hackathon.format}
              </p>
              {hackathon.teamSize && (
                <p className="text-xs text-text-secondary">
                  Teams of {hackathon.teamSize}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-text-primary mb-2">
              About
            </h2>
            <p className="text-sm text-text-secondary leading-body">
              {hackathon.description}
            </p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-text-primary mb-2">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {hackathon.domains.map((d) => (
                <span key={d} className="domain-pill text-xs py-1 px-3">
                  {d}
                </span>
              ))}
              <span className="domain-pill text-xs py-1 px-3">
                {hackathon.format}
              </span>
              {hackathon.participants && (
                <span className="domain-pill text-xs py-1 px-3">
                  {hackathon.participants.toLocaleString()} participants
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col desktop:flex-row gap-3 pb-4">
            <a
              href={hackathon.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient flex-1 text-center text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View Original
            </a>
            <button
              onClick={() => onBookmark(hackathon.id)}
              className={`btn-ghost flex-1 text-sm ${
                isBookmarked
                  ? 'border-accent-amber/50 text-accent-amber'
                  : ''
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isBookmarked ? 'var(--color-accent-amber)' : 'none'}
                stroke={isBookmarked ? 'var(--color-accent-amber)' : 'currentColor'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {isBookmarked ? 'Saved' : 'Save for Later'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
