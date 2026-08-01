# HackAtlas

Hackathon discovery dashboard — find, track, and get notified about hackathons worldwide, with a focus on India.

**Frontend** → Vite + React + TypeScript, deployed on [Vercel](https://vercel.com)
**Backend** → Node.js scraper pipeline, runs daily via [GitHub Actions](https://github.com/features/actions)
**Database** → [Supabase](https://supabase.com) (PostgreSQL + Row Level Security)
**Notifications** → [ntfy.sh](https://ntfy.sh) push notifications

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions (daily cron @ 8:00 AM IST)                      │
│  ┌──────────┐   ┌───────────┐   ┌────────┐   ┌──────────────┐  │
│  │ 11       │──▶│ Normalize │──▶│ Dedupe │──▶│ Insert to DB │  │
│  │ Scrapers │   │ + Classify│   │        │   │  (Supabase)  │  │
│  └──────────┘   └───────────┘   └────────┘   └──────────────┘  │
│                                                      │          │
│                                              ┌───────▼────────┐ │
│                                              │ Notify (ntfy)  │ │
│                                              └────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                                       │
                         ┌─────────────────────────────┘
                         ▼
              ┌─────────────────────┐
              │   Supabase (DB)     │
              │  hackathons table   │◀──── RLS: read-only via ANON key
              │  alerts table       │
              │  notification_log   │
              └─────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Frontend (Vercel)   │
              │ Vite + React SPA    │──── reads via ANON key only
              │ *.vercel.app        │
              └─────────────────────┘
```

## Project Structure

```
Hax/                              ← repo root (frontend)
├── .github/workflows/
│   └── daily-scrape.yml          ← GitHub Actions cron + manual trigger
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts     ← Frontend Supabase client (ANON key)
│   ├── components/
│   ├── hooks/
│   ├── screens/
│   └── ...
├── hackatlas-backend/            ← Backend scraper pipeline
│   ├── src/
│   │   ├── scrapers/             ← 11 source scrapers
│   │   ├── pipeline/             ← normalize, classify, dedupe, db, notify
│   │   └── runPipeline.ts        ← Main entrypoint
│   ├── supabase/migrations/
│   ├── .env.example              ← Backend env vars (SERVICE key)
│   └── package.json
├── vercel.json                   ← Vercel deployment config
├── .env.example                  ← Frontend env vars (ANON key)
├── package.json
└── README.md
```

## Quick Start (Local Development)

### Frontend

```bash
# Install dependencies
npm install

# Copy env vars and fill in Supabase ANON key
cp .env.example .env.local

# Start dev server
npm run dev
```

### Backend Pipeline

```bash
cd hackatlas-backend

# Install dependencies
npm install
npx playwright install chromium

# Copy env vars and fill in Supabase SERVICE ROLE key + ntfy topic
cp .env.example .env

# Run the pipeline once
npm run pipeline
```

---

## Deploying to Vercel

### Steps

1. **Push your repo to GitHub** (if not already done)

2. **Go to [vercel.com](https://vercel.com)** → **New Project** → **Import from GitHub** → select this repo

3. **Configure the project:**
   - Framework Preset: `Vite` (auto-detected from `vercel.json`)
   - Root Directory: `.` (leave as default — the frontend is at the repo root)
   - Build Command: `vite build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

4. **Add environment variables** in Vercel's project settings (**Settings → Environment Variables**):

   | Variable | Value | Notes |
   |----------|-------|-------|
   | `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | `eyJ...` | The **anon (public)** key, NOT the service role key |

   > ⚠️ **Never add `SUPABASE_SERVICE_KEY` to Vercel.** The service key is only for the backend pipeline (GitHub Actions). Adding it to Vercel would expose it in the client bundle.

5. **Deploy** — Vercel auto-builds and gives you a `*.vercel.app` URL

6. **Every push to `main` auto-redeploys** — no manual action needed

### Custom Domain (Optional)

Go to **Settings → Domains** in your Vercel project to add a custom domain.

---

## GitHub Actions (Backend Pipeline)

The scraper pipeline runs automatically at **8:00 AM IST (2:30 UTC) daily** via the workflow at [`.github/workflows/daily-scrape.yml`](.github/workflows/daily-scrape.yml).

### Adding Secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions** → **New repository secret**:

| Secret | Value | Where to find it |
|--------|-------|-------------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_KEY` | `eyJ...` | Supabase Dashboard → Settings → API → `service_role` key |
| `NTFY_TOPIC` | `hackatlas-alerts-xxxxx` | Your chosen ntfy.sh topic name |

### Manual Trigger

Go to **Actions → Daily Hackathon Scrape → Run workflow** to trigger the pipeline manually (useful for testing).

### Debugging Failed Runs

If a run fails, the pipeline log is automatically uploaded as a **workflow artifact**. You can download and view it from the GitHub Actions run page — works from a phone browser too.

---

## Supabase Setup

### Key Security Model

| Key | Used by | Access level | Exposed client-side? |
|-----|---------|--------------|---------------------|
| **ANON key** | Frontend (Vercel) | Read-only (RLS enforced) | ✅ Yes — safe |
| **SERVICE ROLE key** | Backend (GitHub Actions) | Full read/write (bypasses RLS) | ❌ Never |

The anon key is safe to expose because Row Level Security policies on the `hackathons` table restrict it to `SELECT` only. The service role key bypasses RLS entirely and is used by the backend pipeline to `INSERT` new hackathons.

### Initial Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run [`hackatlas-backend/supabase/migrations/001_init.sql`](hackatlas-backend/supabase/migrations/001_init.sql)
3. Verify RLS is enabled on the `hackathons` table

---

## Deployment Checklist

Complete these steps in order for a full deployment:

- [ ] **Supabase project** created, migration SQL run, RLS policy enabled
- [ ] **ntfy.sh topic** chosen (use an unguessable name like `hackatlas-alerts-a7x9k2`)
- [ ] **GitHub repo** pushed with both frontend + backend code
- [ ] **GitHub Secrets** added: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `NTFY_TOPIC`
- [ ] **Vercel project** connected, env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) added, first deploy successful
- [ ] **Manual trigger** the GitHub Actions workflow once (`workflow_dispatch`) to confirm the pipeline runs end-to-end and a test notification arrives on your phone via the ntfy app
- [ ] **Confirm frontend** loads live data from Supabase (not mock data)
- [ ] **Daily cron** confirmed active (check the Actions tab — next scheduled run should appear)

---

## Environment Variables Reference

### Frontend (Vercel / `.env.local`)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key — read-only via RLS |

### Backend (GitHub Secrets / `.env`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key — full write access |
| `NTFY_TOPIC` | ntfy.sh topic for push notifications |

---

## npm Scripts

### Frontend (repo root)

| Script | Command |
|--------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

### Backend (`hackatlas-backend/`)

| Script | Command |
|--------|---------|
| `npm run pipeline` | Run the full scraper pipeline once |
| `npm run dev` | Same as pipeline (for development) |

## License

Private — not for redistribution.
