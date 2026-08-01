import type { Hackathon } from '../../types';

interface HackathonCardProps {
  hackathon: Hackathon;
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
  onClick: (h: Hackathon) => void;
}

const sourceColors: Record<string, string> = {
  Devpost: '#003E54',
  MLH: '#E73427',
  ETHGlobal: '#6B5CE7',
  Colosseum: '#14F195',
  DoraHacks: '#5B4FFF',
  Devfolio: '#3770FF',
  Unstop: '#0073E6',
  HackerEarth: '#2C3454',
  Reskilll: '#7C3AED',
  Hack2Skill: '#16A34A',
  SIH: '#F97316',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatPrize(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
  return `$${amount}`;
}

export default function HackathonCard({
  hackathon,
  isBookmarked,
  onBookmark,
  onClick,
}: HackathonCardProps) {
  const isFeatured = hackathon.prizePool > 5000;
  const isIndiaRelevant =
    hackathon.country === 'India' ||
    hackathon.isIndiaAccessible === true ||
    hackathon.location.toLowerCase().includes('india');

  return (
    <article
      className={`card p-0 cursor-pointer group overflow-hidden ${
        isFeatured ? 'gradient-border-top' : ''
      }`}
      onClick={() => onClick(hackathon)}
    >
      <div className="relative aspect-[16/9] bg-base overflow-hidden">
        {hackathon.imageUrl ? (
          <img
            src={hackathon.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: hackathon.bannerColor }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base-card via-transparent to-black/10" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: sourceColors[hackathon.source] || '#555' }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-white">
            By {hackathon.source}
          </span>
        </div>
        <div className="absolute left-3 bottom-3 rounded-md bg-base-card/90 border border-white/10 px-2.5 py-1">
          <span className="text-[11px] font-semibold text-text-primary">
            {formatDate(hackathon.dateStart)} - {formatDate(hackathon.dateEnd)}
          </span>
        </div>
        {isIndiaRelevant && (
          <div className="absolute right-3 bottom-3 rounded-full bg-base-card/90 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-text-primary">
            🇮🇳
          </div>
        )}
        {hackathon.isNew && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-base-card/90 border border-white/10 px-2.5 py-1">
            <div className="new-dot" />
            <span className="text-[10px] font-semibold text-accent-sage uppercase">
              New
            </span>
          </div>
        )}
      </div>

      <div className="p-4 desktop:p-5">
        <div className="flex items-start gap-3 mb-2">
          <h3 className="text-[15px] font-semibold text-text-primary line-clamp-2 leading-snug tracking-tight group-hover:text-white transition-colors flex-1">
            {hackathon.title}
          </h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(hackathon.id);
            }}
            className="tap-target flex items-center justify-center -mr-2 -mt-2 flex-shrink-0"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark hackathon'}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isBookmarked ? 'var(--color-accent-amber)' : 'none'}
              stroke={isBookmarked ? 'var(--color-accent-amber)' : '#555D68'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-3 text-xs text-text-secondary">
          <div className="flex items-center gap-1 min-w-0">
            {hackathon.isOnline ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-accent-sage flex-shrink-0" />
                <span className="text-accent-sage">Online</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="truncate max-w-[150px]">{hackathon.location}</span>
              </>
            )}
          </div>
        </div>

        {hackathon.prizePool > 0 && (
          <div className="mb-3">
            {isFeatured ? (
              <span className="text-xl font-bold gradient-text">
                {formatPrize(hackathon.prizePool)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-text-secondary">
                {formatPrize(hackathon.prizePool)}
              </span>
            )}
            <span className="text-xs text-text-muted ml-1.5">in prizes</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {hackathon.domains.map((d) => (
            <span key={d} className="domain-pill">
              {d}
            </span>
          ))}
          <span className="domain-pill">{hackathon.format}</span>
        </div>
      </div>
    </article>
  );
}
