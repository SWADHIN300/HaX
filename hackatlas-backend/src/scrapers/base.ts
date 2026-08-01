// ═══════════════════════════════════════════════════════════
// HackAtlas — Base Scraper Interface
// ═══════════════════════════════════════════════════════════

import type { RawHackathon, SourceName } from "../types/hackathon.js";

/**
 * Sleep utility — adds delay between requests to avoid rate limiting.
 * @param ms Milliseconds to sleep (default: 1500ms)
 */
export function sleep(ms: number = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Abstract base class for all hackathon scrapers.
 * Each scraper must implement the `scrape()` method.
 */
export abstract class Scraper {
  /** Human-readable name for logging */
  abstract readonly name: string;

  /** Source identifier matching the SourceName type */
  abstract readonly source: SourceName;

  /**
   * Scrape hackathons from the source.
   * Implementations should handle their own error logging
   * and return an empty array on failure.
   */
  abstract scrape(): Promise<RawHackathon[]>;

  /**
   * Wrapper that catches errors and returns empty array.
   * Use this in the pipeline orchestrator.
   */
  async safeScrape(): Promise<{ source: SourceName; results: RawHackathon[]; error?: string }> {
    try {
      console.log(`[${this.name}] Starting scrape...`);
      const results = await this.scrape();
      console.log(`[${this.name}] Found ${results.length} hackathons`);
      return { source: this.source, results };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[${this.name}] Scrape failed: ${message}`);
      return { source: this.source, results: [], error: message };
    }
  }
}
