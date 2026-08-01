// ═══════════════════════════════════════════════════════════
// HackAtlas — Shared TypeScript Types
// ═══════════════════════════════════════════════════════════

/** All supported scraper source names */
export type SourceName =
  | "unstop"
  | "devfolio"
  | "hackerearth"
  | "reskilll"
  | "sih"
  | "hack2skill"
  | "devpost"
  | "mlh"
  | "ethglobal"
  | "colosseum"
  | "align_nexus";

/** Domain tag categories for classification */
export type DomainTag =
  | "AI"
  | "Web3"
  | "Fintech"
  | "Student"
  | "Government"
  | "Design"
  | "Open Source"
  | "General";

/** Region classification */
export type Region = "India" | "Global";

/**
 * The canonical hackathon record — every scraper's output
 * is normalized into this shape before storage.
 */
export interface Hackathon {
  /** SHA-256 hash of source+title+url, used for dedup */
  id: string;
  title: string;
  source: SourceName;
  url: string;
  startDate: string | null;      // ISO date string
  endDate: string | null;        // ISO date string
  location: string;              // city/venue or "Online"
  isOnline: boolean;
  region: Region;
  country: string | null;
  prizePool: number | null;      // normalized to INR if possible
  prizePoolRaw: string | null;   // original string, e.g. "$50,000"
  domainTags: DomainTag[];
  description: string;           // truncated to 300 chars
  bannerImageUrl: string | null;
  firstSeenAt: string;           // ISO timestamp, set at insert time
  isNew: boolean;                // true if inserted in this run
}

/**
 * Raw hackathon data from scrapers — partial, pre-normalization.
 * Scrapers fill in what they can; the pipeline normalizes the rest.
 */
export interface RawHackathon {
  title: string;
  source: SourceName;
  url: string;
  startDate?: string | null;
  endDate?: string | null;
  location?: string;
  isOnline?: boolean;
  country?: string | null;
  prizePool?: number | null;
  prizePoolRaw?: string | null;
  domainTags?: DomainTag[];
  description?: string;
  bannerImageUrl?: string | null;
}

/**
 * Alert filter saved in the database.
 * Matches hackathons based on domain tags, region, prize, and mode.
 */
export interface Alert {
  id: string;
  name: string;
  domain_tags: string[];         // empty array = match all
  region: "India" | "Global" | "Both";
  min_prize: number | null;
  is_online_only: boolean;
  is_active: boolean;
  created_at: string;
}

/**
 * Notification log entry — tracks which hackathon/alert combos
 * have already been notified to prevent duplicates.
 */
export interface NotificationLogEntry {
  id: string;
  hackathon_id: string;
  alert_id: string;
  notified_at: string;
}
