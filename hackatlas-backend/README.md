# HackAtlas Backend

Hackathon discovery and alert pipeline — scrapes 11 sources, normalizes data into a common schema, stores in Supabase, and sends push notifications for new finds.

**Primary focus:** India (Unstop, Devfolio, HackerEarth, Reskilll, SIH, Hack2Skill)
**Global coverage:** Devpost, MLH, ETHGlobal, Colosseum, Align Nexus

## Architecture

```
Scrapers (11 sources)
    ↓ RawHackathon[]
Normalize (common schema + dedup hash)
    ↓ Hackathon[]
Classify (region + domain tags)
    ↓ Hackathon[]
Dedupe (check against Supabase)
    ↓ new Hackathon[]
Insert (batch upsert to DB)
    ↓
Notify (match alerts → ntfy.sh push)
```

## Prerequisites

- **Node.js 20+**
- **Supabase project** (free tier works)
- **ntfy.sh topic** (free, no account needed)

## Setup

### 1. Supabase Project

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)
3. Copy your project URL and **service_role** key from **Settings → API**

### 2. ntfy.sh Topic

1. Pick a unique topic name (e.g. `hackatlas-alerts-yourname`)
2. Install the [ntfy app](https://ntfy.sh/) on your phone
3. Subscribe to your topic in the app
4. That's it — no account needed

### 3. Environment Variables

```bash
cp .env.example .env
```

Fill in:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...  # service_role key, NOT anon key
NTFY_TOPIC=hackatlas-alerts-yourname
```

### 4. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 5. Run Locally

```bash
npm run pipeline
```

## GitHub Actions (Automated Daily Runs)

The pipeline runs automatically at **8:00 AM IST daily** via GitHub Actions.

> **Note:** The workflow file lives at the **repo root** (`.github/workflows/daily-scrape.yml`),
> not inside `hackatlas-backend/`. GitHub only recognizes workflows at the repository root.
> All steps use `working-directory: hackatlas-backend/` to run in the correct folder.

### Add Secrets

Go to your repo → **Settings → Secrets and variables → Actions** → **New repository secret**:

| Secret | Value |
|--------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Your service_role key |
| `NTFY_TOPIC` | Your ntfy.sh topic name |

### Manual Trigger

Go to **Actions → Daily Hackathon Scrape → Run workflow** to trigger manually.

## Adding a New Scraper

1. Create a new file in `src/scrapers/` (e.g. `myplatform.ts`)
2. Extend the `Scraper` base class:

```typescript
import { Scraper, sleep } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

export class MyPlatformScraper extends Scraper {
  readonly name = "MyPlatform";
  readonly source = "myplatform" as const;

  async scrape(): Promise<RawHackathon[]> {
    // Your scraping logic here
    // Use axios + cheerio for static sites
    // Use playwright for JS-heavy SPAs
    // Call sleep(1500) between requests
    return [];
  }
}
```

3. Add the source name to the `SourceName` type in `src/types/hackathon.ts`
4. Add the source to the `CHECK` constraint in `supabase/migrations/001_init.sql`
5. Import and register in `src/runPipeline.ts`:

```typescript
import { MyPlatformScraper } from "./scrapers/myplatform.js";
// ...
const ALL_SCRAPERS = [
  // ... existing scrapers
  new MyPlatformScraper(),
];
```

6. If it's an India source, add it to `INDIA_SOURCES` in `src/pipeline/classify.ts`

## Project Structure

```
hackatlas-backend/
├── src/
│   ├── scrapers/
│   │   ├── base.ts             # Abstract Scraper class + sleep utility
│   │   ├── devpost.ts          # ✅ Working — JSON API
│   │   ├── mlh.ts              # ✅ Working — Inertia.js data extraction
│   │   ├── ethglobal.ts        # ✅ Working — cheerio HTML parsing
│   │   ├── unstop.ts           # ✅ Working — Playwright (selectors may need tuning)
│   │   ├── devfolio.ts         # 🔜 TODO stub
│   │   ├── hackerearth.ts      # 🔜 TODO stub
│   │   ├── reskilll.ts         # 🔜 TODO stub
│   │   ├── sih.ts              # 🔜 TODO stub
│   │   ├── hack2skill.ts       # 🔜 TODO stub
│   │   ├── colosseum.ts        # 🔜 TODO stub
│   │   └── alignNexus.ts       # 🔜 TODO stub
│   ├── pipeline/
│   │   ├── normalize.ts        # SHA-256 hashing + schema normalization
│   │   ├── classify.ts         # Region detection + domain tagging
│   │   ├── dedupe.ts           # DB-backed duplicate filtering
│   │   ├── db.ts               # Supabase client wrapper
│   │   └── notify.ts           # ntfy.sh push notifications
│   ├── types/
│   │   └── hackathon.ts        # Shared TypeScript interfaces
│   └── runPipeline.ts          # Main entrypoint — orchestrates full run
├── supabase/migrations/
│   └── 001_init.sql            # Table creation + RLS + seed data
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Data Schema

Every hackathon is normalized to:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | SHA-256 hash (dedup key) |
| `title` | string | Hackathon name |
| `source` | enum | Which platform it came from |
| `url` | string | Direct link |
| `startDate` | date \| null | ISO date |
| `endDate` | date \| null | ISO date |
| `location` | string | City or "Online" |
| `isOnline` | boolean | Virtual event flag |
| `region` | "India" \| "Global" | Auto-detected |
| `country` | string \| null | Country name or code |
| `prizePool` | number \| null | Normalized to INR |
| `prizePoolRaw` | string \| null | Original prize string |
| `domainTags` | string[] | AI, Web3, Fintech, etc. |
| `description` | string | Truncated to 300 chars |
| `bannerImageUrl` | string \| null | Event banner/thumbnail |

## Notification Format

Push notifications via [ntfy.sh](https://ntfy.sh):

- **Title:** `🇮🇳 New Hackathon: {title}` (or 🌍 for Global)
- **Body:** `{SOURCE} | {prize} | {dates} | {location}`
- **Click action:** Opens the hackathon URL
- **Priority:** `high` if prize > ₹1 lakh, `default` otherwise

## npm Scripts

| Script | Command |
|--------|---------|
| `npm run pipeline` | Run the full pipeline once |
| `npm run dev` | Same as pipeline (for development) |

## License

Private — not for redistribution.
