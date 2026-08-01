-- ═══════════════════════════════════════════════════════════
-- HackAtlas — Database Schema
-- ═══════════════════════════════════════════════════════════

-- 1. Hackathons table (main data store)
CREATE TABLE IF NOT EXISTS hackathons (
  id            TEXT PRIMARY KEY,              -- SHA-256 hash of source+title+url
  title         TEXT NOT NULL,
  source        TEXT NOT NULL CHECK (source IN (
                  'unstop', 'devfolio', 'hackerearth', 'reskilll', 'sih',
                  'hack2skill', 'devpost', 'mlh', 'ethglobal', 'colosseum',
                  'align_nexus'
                )),
  url           TEXT NOT NULL,
  start_date    DATE,                          -- ISO date
  end_date      DATE,                          -- ISO date
  location      TEXT NOT NULL DEFAULT 'Online',
  is_online     BOOLEAN NOT NULL DEFAULT false,
  region        TEXT NOT NULL DEFAULT 'Global' CHECK (region IN ('India', 'Global')),
  country       TEXT,
  prize_pool    NUMERIC,                       -- normalized to INR
  prize_pool_raw TEXT,                         -- original string, e.g. "$50,000"
  domain_tags   TEXT[] NOT NULL DEFAULT '{}',  -- AI, Web3, Fintech, General, etc.
  description   TEXT NOT NULL DEFAULT '',      -- truncated to 300 chars
  banner_image_url TEXT,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_new        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast frontend filtering
CREATE INDEX IF NOT EXISTS idx_hackathons_region ON hackathons (region);
CREATE INDEX IF NOT EXISTS idx_hackathons_start_date ON hackathons (start_date);
CREATE INDEX IF NOT EXISTS idx_hackathons_domain_tags ON hackathons USING GIN (domain_tags);
CREATE INDEX IF NOT EXISTS idx_hackathons_source ON hackathons (source);

-- 2. Alerts table (saved notification filters)
CREATE TABLE IF NOT EXISTS alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  domain_tags     TEXT[] NOT NULL DEFAULT '{}',  -- empty = match all domains
  region          TEXT NOT NULL DEFAULT 'Both' CHECK (region IN ('India', 'Global', 'Both')),
  min_prize       NUMERIC,                       -- nullable, minimum prize threshold
  is_online_only  BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Notification log (prevents re-notifying on the same hackathon)
CREATE TABLE IF NOT EXISTS notification_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id  TEXT NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE,
  alert_id      UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  notified_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (hackathon_id, alert_id)  -- prevent duplicate notifications
);

CREATE INDEX IF NOT EXISTS idx_notification_log_hackathon ON notification_log (hackathon_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_alert ON notification_log (alert_id);

-- ═══════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════

ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

-- Public read-only policy so the frontend can query via Supabase REST API
CREATE POLICY "Public read access for hackathons"
  ON hackathons
  FOR SELECT
  TO anon
  USING (true);

-- Service role can do everything (used by the pipeline)
CREATE POLICY "Service role full access for hackathons"
  ON hackathons
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access for alerts"
  ON alerts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access for notification_log"
  ON notification_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- Seed data
-- ═══════════════════════════════════════════════════════════

INSERT INTO alerts (name, domain_tags, region, is_active)
VALUES ('India — All Domains', '{}', 'India', true)
ON CONFLICT DO NOTHING;
