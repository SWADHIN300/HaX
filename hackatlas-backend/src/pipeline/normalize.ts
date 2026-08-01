// ═══════════════════════════════════════════════════════════
// HackAtlas — Normalize Pipeline Stage
// Converts RawHackathon[] into fully-formed Hackathon[].
// ═══════════════════════════════════════════════════════════

import { createHash } from "node:crypto";
import type { Hackathon, RawHackathon } from "../types/hackathon.js";

/**
 * Generate a deterministic dedup hash from source + title + url.
 * Uses SHA-256 and returns the first 16 hex chars (64 bits — collision-safe
 * for the expected data volume of ~1000 hackathons).
 */
export function generateId(source: string, title: string, url: string): string {
  const input = `${source}::${title.trim().toLowerCase()}::${url.trim().toLowerCase()}`;
  return createHash("sha256").update(input).digest("hex").slice(0, 16);
}

/**
 * Truncate a string to maxLen chars, adding "…" if truncated.
 */
function truncate(text: string, maxLen: number = 300): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "…";
}

/**
 * Normalize an array of raw scraper results into the canonical Hackathon schema.
 * Sets computed fields: id (dedup hash), firstSeenAt, isNew.
 */
export function normalize(rawResults: RawHackathon[]): Hackathon[] {
  const now = new Date().toISOString();

  return rawResults
    .filter((r) => r.title && r.url) // discard entries without title or url
    .map((raw) => ({
      id: generateId(raw.source, raw.title, raw.url),
      title: raw.title.trim(),
      source: raw.source,
      url: raw.url.trim(),
      startDate: raw.startDate || null,
      endDate: raw.endDate || null,
      location: raw.location?.trim() || "Online",
      isOnline: raw.isOnline ?? false,
      region: "Global" as const,        // will be overridden by classify stage
      country: raw.country || null,
      prizePool: raw.prizePool ?? null,
      prizePoolRaw: raw.prizePoolRaw || null,
      domainTags: raw.domainTags || [],  // will be enriched by classify stage
      description: truncate(raw.description || "", 300),
      bannerImageUrl: raw.bannerImageUrl || null,
      firstSeenAt: now,
      isNew: true,
    }));
}
