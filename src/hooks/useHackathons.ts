import { useState, useMemo, useCallback, useEffect } from 'react';
import { mockHackathons } from '../data/mockHackathons';
import type { Hackathon, DomainFilter, SourceFilter } from '../types';

function isIndiaRelevant(hackathon: Hackathon) {
  return (
    hackathon.country === 'India' ||
    hackathon.isIndiaAccessible === true ||
    hackathon.location.toLowerCase().includes('india')
  );
}

function getStartTime(hackathon: Hackathon) {
  return new Date(hackathon.dateStart).getTime();
}

export function useHackathons() {
  const [hackathons] = useState<Hackathon[]>(mockHackathons);
  const [domain, setDomain] = useState<DomainFilter>('India');
  const [indianSource, setIndianSource] = useState<SourceFilter>('All');
  const [globalSource, setGlobalSource] = useState<SourceFilter>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, []);

  const trendingIndia = useMemo(() => {
    return [...hackathons]
      .filter((h) => h.isTrendingIndia || isIndiaRelevant(h))
      .sort((a, b) => {
        const scoreA = (a.isTrendingIndia ? 20 : 0) + (a.isNew ? 4 : 0) + a.prizePool / 10000;
        const scoreB = (b.isTrendingIndia ? 20 : 0) + (b.isNew ? 4 : 0) + b.prizePool / 10000;
        return scoreB - scoreA;
      })
      .slice(0, 6);
  }, [hackathons]);

  const filtered = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return hackathons
      .filter((h) => {
        const indiaRelevant = isIndiaRelevant(h);
        const matchesDomain =
          domain === 'All' ||
          (domain === 'India' ? indiaRelevant : h.domains.includes(domain));
        const matchesIndianSource = indianSource === 'All' || h.source === indianSource;
        const matchesGlobalSource = globalSource === 'All' || h.source === globalSource;
        const matchesSearch =
          searchTerm === '' ||
          h.title.toLowerCase().includes(searchTerm) ||
          h.description.toLowerCase().includes(searchTerm) ||
          h.source.toLowerCase().includes(searchTerm) ||
          h.location.toLowerCase().includes(searchTerm);

        return matchesDomain && matchesIndianSource && matchesGlobalSource && matchesSearch;
      })
      .sort((a, b) => {
        const score = (h: Hackathon) => {
          const indiaBoost = isIndiaRelevant(h) ? (domain === 'All' ? 18 : 6) : 0;
          const trendBoost = h.isTrendingIndia ? 8 : 0;
          const newBoost = h.isNew ? 2 : 0;
          return indiaBoost + trendBoost + newBoost;
        };

        const scoreDiff = score(b) - score(a);
        if (scoreDiff !== 0) return scoreDiff;
        return getStartTime(a) - getStartTime(b);
      });
  }, [hackathons, domain, indianSource, globalSource, search]);

  return {
    hackathons: filtered,
    allHackathons: hackathons,
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
  };
}
