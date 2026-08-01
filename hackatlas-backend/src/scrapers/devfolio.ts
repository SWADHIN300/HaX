// ═══════════════════════════════════════════════════════════
// HackAtlas — Devfolio Scraper (TODO)
// ═══════════════════════════════════════════════════════════
// TODO: Devfolio has a GraphQL endpoint that may be usable.
//       Try: POST https://api.devfolio.co/api/search/hackathons
//       with body: { "type": "hackathon", "q": "", "filter": "open" }
//       If that doesn't work, fall back to Playwright scraping of
//       https://devfolio.co/hackathons
//
// GraphQL query structure (needs testing):
//   query SearchHackathons($filter: HackathonFilter) {
//     searchHackathons(filter: $filter) {
//       hackathons { name, slug, starts_at, ends_at, ... }
//     }
//   }
//
// Playwright fallback selectors to try:
//   - .hackathon-card, [data-testid="hackathon-card"]
//   - h3 inside card for title
//   - time element for dates
//   - Look for "Apply" button links for hackathon URLs
// ═══════════════════════════════════════════════════════════

import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

export class DevfolioScraper extends Scraper {
  readonly name = "Devfolio";
  readonly source = "devfolio" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.warn("[Devfolio] TODO: Scraper not yet implemented — returning empty");
    // TODO: Implement GraphQL query or Playwright fallback
    return [];
  }
}
