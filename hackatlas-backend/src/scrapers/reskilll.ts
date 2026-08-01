// ═══════════════════════════════════════════════════════════
// HackAtlas — Reskilll Scraper (TODO)
// ═══════════════════════════════════════════════════════════
// TODO: Reskilll (reskilll.com) lists Indian hackathons.
//       Uses a dynamic frontend — needs Playwright.
//
// Target URL: https://www.reskilll.com/hackathons
//
// Playwright approach:
//   1. Navigate and wait for cards to load
//   2. Selectors to try:
//      - .hackathon-card, .event-card
//      - Card title in h3/h4
//      - Date elements in .date or time tags
//      - Mode (online/offline) badges
//      - Registration deadline info
//   3. Scroll for lazy-loaded content
//
// Note: Reskilll frequently changes their UI, so selectors
//       will likely need updates after initial deployment.
// ═══════════════════════════════════════════════════════════

import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

export class ReskilllScraper extends Scraper {
  readonly name = "Reskilll";
  readonly source = "reskilll" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.warn("[Reskilll] TODO: Scraper not yet implemented — returning empty");
    // TODO: Implement Playwright-based scraper
    return [];
  }
}
