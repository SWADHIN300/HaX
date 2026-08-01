// ═══════════════════════════════════════════════════════════
// HackAtlas — Dedup Pipeline Stage
// Filters out hackathons that already exist in the database
// using hash-based duplicate detection.
// ═══════════════════════════════════════════════════════════

import type { Hackathon } from "../types/hackathon.js";
import { getExistingHashes } from "./db.js";

/**
 * Remove hackathons whose IDs (hashes) already exist in the database.
 * Queries Supabase in bulk for efficiency.
 *
 * @param hackathons The normalized & classified hackathons
 * @returns Only the hackathons that are new (not in DB)
 */
export async function dedupe(hackathons: Hackathon[]): Promise<Hackathon[]> {
  if (hackathons.length === 0) return [];

  const allIds = hackathons.map((h) => h.id);

  console.log(`[Dedupe] Checking ${allIds.length} hackathon hashes against database...`);

  const existingIds = await getExistingHashes(allIds);
  const existingSet = new Set(existingIds);

  const newHackathons = hackathons.filter((h) => !existingSet.has(h.id));

  console.log(
    `[Dedupe] ${existingIds.length} already known, ${newHackathons.length} new`
  );

  return newHackathons;
}
