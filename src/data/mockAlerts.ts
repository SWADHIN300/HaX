import type { Alert } from '../types';

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    name: 'High-Value AI Hackathons',
    domains: ['AI'],
    locationPreference: 'anywhere',
    minPrize: 10000,
    enabled: true,
    createdAt: '2026-07-15T10:00:00Z',
    matchCount: 3,
  },
  {
    id: 'a2',
    name: 'Web3 Online Events',
    domains: ['Web3'],
    locationPreference: 'online',
    minPrize: 5000,
    enabled: true,
    createdAt: '2026-07-20T14:30:00Z',
    matchCount: 2,
  },
  {
    id: 'a3',
    name: 'Student Hackathons in US',
    domains: ['Student'],
    locationPreference: 'specific',
    specificCountry: 'United States',
    minPrize: 0,
    enabled: false,
    createdAt: '2026-07-25T09:00:00Z',
    matchCount: 4,
  },
  {
    id: 'a4',
    name: 'Fintech Opportunities $50k+',
    domains: ['Fintech', 'Web3'],
    locationPreference: 'anywhere',
    minPrize: 50000,
    dateRange: {
      start: '2026-08-01',
      end: '2026-12-31',
    },
    enabled: true,
    createdAt: '2026-07-28T16:00:00Z',
    matchCount: 1,
  },
];
