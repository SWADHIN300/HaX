// ═══════════════════════════════════════════════════════════
// HackAtlas — Frontend Supabase Client
// ═══════════════════════════════════════════════════════════
//
// SECURITY NOTE:
// This client uses the ANON (public) key, which is safe to
// expose in the frontend bundle. Row Level Security (RLS)
// policies on the `hackathons` table restrict this key to
// read-only access.
//
// The SERVICE ROLE key (which has full write access and
// bypasses RLS) is used ONLY in the backend pipeline
// (hackatlas-backend/) and is stored as a GitHub Secret —
// it must NEVER appear in frontend code or env vars.
// ═══════════════════════════════════════════════════════════

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Typed environment config ──────────────────────────────

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

function getConfig(): SupabaseConfig {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file " +
        "or in Vercel's Environment Variables settings.\n" +
        "See .env.example for details."
    );
  }

  return { url, anonKey };
}

// ── Singleton client ──────────────────────────────────────

let client: SupabaseClient | null = null;

/**
 * Returns a Supabase client configured with the ANON key.
 * Safe for client-side use — RLS enforces read-only access.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const config = getConfig();
  client = createClient(config.url, config.anonKey);

  return client;
}

/**
 * Pre-configured Supabase client instance.
 * Import this directly for convenience:
 *
 * ```ts
 * import { supabase } from '@/lib/supabaseClient';
 * const { data } = await supabase.from('hackathons').select('*');
 * ```
 */
export const supabase = getSupabaseClient();
