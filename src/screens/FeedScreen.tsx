import { useState, useCallback } from 'react';
import type { Hackathon, DomainFilter, SourceFilter } from '../types';
import FilterBar from '../components/ui/FilterBar';
import HackathonCard from '../components/ui/HackathonCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import HackathonDetail from './HackathonDetail';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

interface FeedScreenProps {
  hackathons: Hackathon[];
  trendingIndia: Hackathon[];
  loading: boolean;
  domain: DomainFilter;
  setDomain: (d: DomainFilter) => void;
  indianSource: SourceFilter;
  setIndianSource: (source: SourceFilter) => void;
  globalSource: SourceFilter;
  setGlobalSource: (source: SourceFilter) => void;
  search: string;
  setSearch: (s: string) => void;
  refresh: () => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (id: string) => void;
}

export default function FeedScreen({
  hackathons,
  trendingIndia,
  loading,
  domain,
  setDomain,
  indianSource,
  setIndianSource,
  globalSource,
  setGlobalSource,
  search,
  setSearch,
  refresh,
  isBookmarked,
  toggleBookmark,
}: FeedScreenProps) {
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);

  const { containerRef, pullDistance, isPulling, touchHandlers } =
    usePullToRefresh(refresh);

  const handleCardClick = useCallback((h: Hackathon) => {
    setSelectedHackathon(h);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        {...touchHandlers}
        className="min-h-screen"
      >
        {isPulling && (
          <div
            className="flex items-center justify-center transition-all desktop:hidden"
            style={{ height: `${pullDistance}px` }}
          >
            <div
              className="w-6 h-6 border-2 border-accent-amber border-t-transparent rounded-full"
              style={{
                transform: `rotate(${pullDistance * 3}deg)`,
                opacity: Math.min(pullDistance / 80, 1),
              }}
            />
          </div>
        )}

        <div className="hidden desktop:block px-6 pt-6 pb-2">
          <h1 className="text-2xl font-bold tracking-tighter text-text-primary">
            Discover Hackathons
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {loading ? 'Loading...' : `${hackathons.length} hackathons found`}
          </p>
        </div>

        <FilterBar
          domain={domain}
          onDomainChange={setDomain}
          indianSource={indianSource}
          onIndianSourceChange={setIndianSource}
          globalSource={globalSource}
          onGlobalSourceChange={setGlobalSource}
          search={search}
          onSearchChange={setSearch}
        />

        {!loading && trendingIndia.length > 0 && (
          <section className="pb-4">
            <div className="px-4 desktop:px-6 mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg desktop:text-xl font-bold tracking-tight text-text-primary">
                  🇮🇳 Trending in India
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Featured Indian and India-accessible hackathons
                </p>
              </div>
            </div>
            <div className="overflow-x-auto hide-scrollbar px-4 desktop:px-6 pb-2">
              <div className="flex gap-4 min-w-max">
                {trendingIndia.map((h) => (
                  <div key={h.id} className="w-[290px] desktop:w-[340px] flex-shrink-0">
                    <HackathonCard
                      hackathon={h}
                      isBookmarked={isBookmarked(h.id)}
                      onBookmark={toggleBookmark}
                      onClick={handleCardClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="px-4 desktop:px-6 pb-6">
          {loading ? (
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : hackathons.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-card border border-base-border flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555D68" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p className="text-text-secondary font-medium">No hackathons found</p>
              <p className="text-sm text-text-muted mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
              {hackathons.map((h) => (
                <HackathonCard
                  key={h.id}
                  hackathon={h}
                  isBookmarked={isBookmarked(h.id)}
                  onBookmark={toggleBookmark}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
