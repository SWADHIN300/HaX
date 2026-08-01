// ═══════════════════════════════════════════════════════════
// HackAtlas — HackerEarth Scraper (TODO)
// ═══════════════════════════════════════════════════════════
// TODO: HackerEarth requires Playwright for their SPA.
//       Target URL: https://www.hackerearth.com/challenges/hackathon/
//
// Playwright approach:
//   1. Navigate to the challenges page
//   2. Wait for challenge cards to render
//   3. Selectors to try:
//      - .challenge-card, .challenge-list-item
//      - .challenge-name for title
//      - .challenge-date for dates
//      - .challenge-type for online/offline
//      - a[href*="/challenges/hackathon/"] for links
//   4. May need to click "Show more" or scroll for pagination
//
// Alternative: HackerEarth has an API at
//   https://www.hackerearth.com/challenges/hackathon/api/
//   but it may require authentication.
// ═══════════════════════════════════════════════════════════

import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

export class HackerEarthScraper extends Scraper {
  readonly name = "HackerEarth";
  readonly source = "hackerearth" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.warn("[HackerEarth] TODO: Scraper not yet implemented — returning empty");
    // TODO: Implement Playwright-based scraper
    return [];
  }
}
