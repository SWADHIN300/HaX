// ═══════════════════════════════════════════════════════════
// HackAtlas — Database Client (Supabase Wrapper)
// ═══════════════════════════════════════════════════════════
//
// SECURITY: This client uses the SERVICE ROLE key (SUPABASE_SERVICE_KEY),
// which has FULL read/write access and BYPASSES Row Level Security (RLS).
// It is intended ONLY for server-side use in the scraper pipeline
// (running via GitHub Actions or locally during development).
//
// The FRONTEND uses a separate ANON (public) key, which is restricted
// by RLS policies to read-only access on the `hackathons` table.
// See: src/lib/supabaseClient.ts in the frontend project.
//
// ⚠️  NEVER expose SUPABASE_SERVICE_KEY in the frontend bundle,
//     client-side code, or any publicly accessible location.
// ═══════════════════════════════════════════════════════════

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Alert, Hackathon } from "../types/hackathon.js";

let supabase: SupabaseClient | null = null;

/**
 * Get or create the Supabase client singleton.
 * Uses SUPABASE_URL and SUPABASE_SERVICE_KEY from environment.
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables. " +
      "Copy .env.example to .env and fill in the values."
    );
  }

  supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabase;
}

/**
 * Query existing hackathon IDs (hashes) from the database.
 * Used by the dedup stage to filter out already-known entries.
 */
export async function getExistingHashes(ids: string[]): Promise<string[]> {
  const client = getSupabaseClient();

  // Supabase has a limit on IN queries, so batch in chunks of 500
  const BATCH_SIZE = 500;
  const existingIds: string[] = [];

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);

    const { data, error } = await client
      .from("hackathons")
      .select("id")
      .in("id", batch);

    if (error) {
      console.error("[DB] Error querying existing hashes:", error.message);
      throw error;
    }

    if (data) {
      existingIds.push(...data.map((row: { id: string }) => row.id));
    }
  }

  return existingIds;
}

/**
 * Batch insert new hackathons into the database.
 * Uses upsert with the dedup hash as the conflict key.
 */
export async function insertHackathons(hackathons: Hackathon[]): Promise<number> {
  if (hackathons.length === 0) return 0;

  const client = getSupabaseClient();

  // Map from camelCase to snake_case for Supabase
  const rows = hackathons.map((h) => ({
    id: h.id,
    title: h.title,
    source: h.source,
    url: h.url,
    start_date: h.startDate,
    end_date: h.endDate,
    location: h.location,
    is_online: h.isOnline,
    region: h.region,
    country: h.country,
    prize_pool: h.prizePool,
    prize_pool_raw: h.prizePoolRaw,
    domain_tags: h.domainTags,
    description: h.description,
    banner_image_url: h.bannerImageUrl,
    first_seen_at: h.firstSeenAt,
    is_new: h.isNew,
  }));

  // Insert in batches of 100
  const BATCH_SIZE = 100;
  let insertedCount = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const { data, error } = await client
      .from("hackathons")
      .upsert(batch, { onConflict: "id", ignoreDuplicates: true })
      .select("id");

    if (error) {
      console.error("[DB] Error inserting hackathons:", error.message);
      throw error;
    }

    insertedCount += data?.length ?? batch.length;
  }

  return insertedCount;
}

/**
 * Query all active alerts from the database.
 */
export async function getActiveAlerts(): Promise<Alert[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("alerts")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("[DB] Error querying alerts:", error.message);
    throw error;
  }

  return (data as Alert[]) || [];
}

/**
 * Check if a notification has already been sent for a hackathon+alert combo.
 */
export async function hasBeenNotified(
  hackathonId: string,
  alertId: string
): Promise<boolean> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("notification_log")
    .select("id")
    .eq("hackathon_id", hackathonId)
    .eq("alert_id", alertId)
    .limit(1);

  if (error) {
    console.error("[DB] Error checking notification log:", error.message);
    return false; // err on the side of sending
  }

  return (data?.length ?? 0) > 0;
}

/**
 * Log a notification that was sent to prevent re-notifying.
 */
export async function logNotification(
  hackathonId: string,
  alertId: string
): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from("notification_log")
    .insert({
      hackathon_id: hackathonId,
      alert_id: alertId,
    });

  if (error) {
    // Ignore duplicate constraint violations — they're expected on reruns
    if (!error.message.includes("duplicate")) {
      console.error("[DB] Error logging notification:", error.message);
    }
  }
}
