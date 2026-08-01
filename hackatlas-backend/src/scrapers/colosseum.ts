// ═══════════════════════════════════════════════════════════
// HackAtlas — Colosseum Scraper (TODO)
// ═══════════════════════════════════════════════════════════
// TODO: Colosseum (colosseum.org) runs Solana hackathons.
//       URL: https://www.colosseum.org/
//
// Approach:
//   - Check for a public API or JSON endpoints
//   - Try axios + cheerio on the events/hackathons page
//   - Colosseum typically runs 1-2 large hackathons per year
//     (e.g., "Radar", "Renaissance", "Breakpoint")
//   - May need to scrape individual hackathon pages
//
// Domain tags: Should always include "Web3"
// Region: Usually "Global" (online hackathons)
// ═══════════════════════════════════════════════════════════

import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

export class ColosseumScraper extends Scraper {
  readonly name = "Colosseum";
  readonly source = "colosseum" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.warn("[Colosseum] TODO: Scraper not yet implemented — returning empty");
    // TODO: Implement scraper
    return [];
  }
}
