// ═══════════════════════════════════════════════════════════
// HackAtlas — Smart India Hackathon (SIH) Scraper (TODO)
// ═══════════════════════════════════════════════════════════
// TODO: Smart India Hackathon official site.
//       URL: https://www.sih.gov.in/ or https://sih.gov.in/
//
// Notes:
//   - SIH is typically annual (Aug-Dec cycle for internal rounds,
//     Grand Finale in Dec)
//   - The site may be static HTML or a simple server-rendered page
//   - Try axios + cheerio first before Playwright
//   - Look for:
//     - Problem statements / hackathon themes
//     - Registration dates
//     - Venue information for the Grand Finale
//   - This is a government site so it may be slow or have
//     unusual HTML structures
//
// Domain tags: Should always include "Government" and "Student"
// Region: Always "India"
// ═══════════════════════════════════════════════════════════

import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

export class SIHScraper extends Scraper {
  readonly name = "Smart India Hackathon";
  readonly source = "sih" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.warn("[SIH] TODO: Scraper not yet implemented — returning empty");
    // TODO: Implement — try cheerio first, fall back to Playwright
    return [];
  }
}
