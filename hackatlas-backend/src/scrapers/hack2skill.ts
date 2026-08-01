// ═══════════════════════════════════════════════════════════
// HackAtlas — Hack2Skill Scraper (TODO)
// ═══════════════════════════════════════════════════════════
// TODO: hack2skill.com is an Indian hackathon platform.
//       URL: https://hack2skill.com/hackathons
//
// Approach:
//   - Check if they have a public API (common for platforms
//     that list hackathons)
//   - Try axios + cheerio for the listing page
//   - Fall back to Playwright if the page is JS-rendered
//
// Selectors to try:
//   - Hackathon cards with title, dates, prize info
//   - Registration status (open/closed)
//   - Mode: online/offline/hybrid
//
// Region: Always "India"
// ═══════════════════════════════════════════════════════════

import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

export class Hack2SkillScraper extends Scraper {
  readonly name = "Hack2Skill";
  readonly source = "hack2skill" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.warn("[Hack2Skill] TODO: Scraper not yet implemented — returning empty");
    // TODO: Implement scraper
    return [];
  }
}
