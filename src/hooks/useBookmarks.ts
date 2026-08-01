import { useState, useCallback, useEffect } from 'react';
import type { SortOption, Hackathon } from '../types';
import { mockHackathons } from '../data/mockHackathons';

const STORAGE_KEY = 'hax-bookmarks';

function loadBookmarks(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(loadBookmarks);
  const [sort, setSort] = useState<SortOption>('soonest');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const toggle = useCallback((id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarkedIds.includes(id),
    [bookmarkedIds]
  );

  const bookmarkedHackathons = useCallback((): Hackathon[] => {
    const items = mockHackathons.filter((h) => bookmarkedIds.includes(h.id));
    switch (sort) {
      case 'soonest':
        return [...items].sort(
          (a, b) =>
            new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
        );
      case 'recently-added':
        return [...items].sort(
          (a, b) =>
            bookmarkedIds.indexOf(b.id) - bookmarkedIds.indexOf(a.id)
        );
      case 'highest-prize':
        return [...items].sort((a, b) => b.prizePool - a.prizePool);
      default:
        return items;
    }
  }, [bookmarkedIds, sort]);

  return {
    bookmarkedIds,
    toggle,
    isBookmarked,
    bookmarkedHackathons,
    sort,
    setSort,
    count: bookmarkedIds.length,
  };
}
