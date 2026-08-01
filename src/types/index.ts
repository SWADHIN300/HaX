export interface Hackathon {
  id: string;
  title: string;
  description: string;
  source: HackathonSource;
  domains: Domain[];
  dateStart: string;
  dateEnd: string;
  location: string;
  isOnline: boolean;
  prizePool: number;
  bannerColor: string;
  imageUrl?: string;
  externalUrl: string;
  isNew: boolean;
  format: 'In-Person' | 'Online' | 'Hybrid';
  participants?: number;
  teamSize?: string;
  country?: string;
  isIndiaAccessible?: boolean;
  isTrendingIndia?: boolean;
}

export type HackathonSource =
  | 'Devpost'
  | 'MLH'
  | 'ETHGlobal'
  | 'Colosseum'
  | 'DoraHacks'
  | 'Devfolio'
  | 'Unstop'
  | 'HackerEarth'
  | 'Reskilll'
  | 'Hack2Skill'
  | 'SIH';

export type Domain = 'Web3' | 'AI'  | 'Fintech' | 'Student' | 'General';

export interface Alert {
  id: string;
  name: string;
  domains: Domain[];
  locationPreference: 'anywhere' | 'online' | 'specific';
  specificCountry?: string;
  minPrize: number;
  dateRange?: {
    start: string;
    end: string;
  };
  enabled: boolean;
  createdAt: string;
  matchCount: number;
}

export interface AlertFormData {
  name: string;
  domains: Domain[];
  locationPreference: 'anywhere' | 'online' | 'specific';
  specificCountry?: string;
  minPrize: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export type DomainFilter = 'India' | 'All' | Domain;

export type SourceFilter = HackathonSource | 'All';

export type SortOption = 'soonest' | 'recently-added' | 'highest-prize';

export interface FilterState {
  domain: DomainFilter;
  indianSource: SourceFilter;
  globalSource: SourceFilter;
  search: string;
}
