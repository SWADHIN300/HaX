import { useState } from 'react';
import type { SortOption, Hackathon } from '../types';
import HackathonCard from '../components/ui/HackathonCard';
import HackathonDetail from './HackathonDetail';

interface SavedScreenProps {
  bookmarkedHackathons: () => Hackathon[];
  sort: SortOption;
  setSort: (s: SortOption) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'soonest', label: 'Soonest' },
  { value: 'recently-added', label: 'Recently Added' },
  { value: 'highest-prize', label: 'Highest Prize' },
];

export default function SavedScreen({
  bookmarkedHackathons,
  sort,
  setSort,
  isBookmarked,
  toggleBookmark,
}: SavedScreenProps) {
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const items = bookmarkedHackathons();

  return (
    <>
      <div className="min-h-screen">
        {/* Header */}
        <div className="px-4 desktop:px-6 pt-5 desktop:pt-6 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl desktop:text-2xl font-bold tracking-tighter text-text-primary">
              Saved
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              {items.length} hackathon{items.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {/* Sort Dropdown */}
          {items.length > 0 && (
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none bg-base-card border border-base-border rounded-lg px-4 py-2 pr-8 text-sm text-text-primary cursor-pointer focus:border-accent-amber/50 transition-colors"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-4 desktop:px-6 pb-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-card border border-base-border flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555D68" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-text-secondary font-medium">No saved hackathons</p>
              <p className="text-sm text-text-muted mt-1">
                Bookmark hackathons from the feed to save them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
              {items.map((h) => (
                <HackathonCard
                  key={h.id}
                  hackathon={h}
                  isBookmarked={isBookmarked(h.id)}
                  onBookmark={toggleBookmark}
                  onClick={setSelectedHackathon}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <HackathonDetail
        hackathon={selectedHackathon}
        isOpen={!!selectedHackathon}
        onClose={() => setSelectedHackathon(null)}
        isBookmarked={selectedHackathon ? isBookmarked(selectedHackathon.id) : false}
        onBookmark={toggleBookmark}
      />
    </>
  );
}
