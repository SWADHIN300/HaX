// ═══════════════════════════════════════════════════════════
// HackAtlas — Align Nexus Scraper (TODO)
// ═══════════════════════════════════════════════════════════
// TODO: Align Nexus (align.nexus) is a Web3/Solana hackathon
//       aggregator / project platform.
//       URL: https://align.nexus/
//
// Approach:
//   - Investigate the site structure (likely a Next.js or
//     React SPA)
//   - Check for API endpoints in the network tab
//   - May list hackathons, bounties, and grants
//   - Filter for hackathon-type events only
//
// Domain tags: Should always include "Web3"
// Region: Usually "Global"
// ═══════════════════════════════════════════════════════════

import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

export class AlignNexusScraper extends Scraper {
  readonly name = "Align Nexus";
  readonly source = "align_nexus" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.warn("[Align Nexus] TODO: Scraper not yet implemented — returning empty");
    // TODO: Implement scraper
    return [];
  }
}
