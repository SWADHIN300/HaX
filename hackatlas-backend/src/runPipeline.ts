// ═══════════════════════════════════════════════════════════
// HackAtlas — Pipeline Orchestrator
// Main entrypoint: runs all scrapers → normalize → classify
// → dedupe → insert → notify → summary.
// ═══════════════════════════════════════════════════════════

import "dotenv/config";

import type { RawHackathon, SourceName } from "./types/hackathon.js";

// ── Scrapers ───────────────────────────────────────────────
import { DevpostScraper } from "./scrapers/devpost.js";
import { MLHScraper } from "./scrapers/mlh.js";
import { ETHGlobalScraper } from "./scrapers/ethglobal.js";
import { UnstopScraper } from "./scrapers/unstop.js";
import { DevfolioScraper } from "./scrapers/devfolio.js";
import { HackerEarthScraper } from "./scrapers/hackerearth.js";
import { ReskilllScraper } from "./scrapers/reskilll.js";
import { SIHScraper } from "./scrapers/sih.js";
import { Hack2SkillScraper } from "./scrapers/hack2skill.js";
import { ColosseumScraper } from "./scrapers/colosseum.js";
import { AlignNexusScraper } from "./scrapers/alignNexus.js";

// ── Pipeline stages ────────────────────────────────────────
import { normalize } from "./pipeline/normalize.js";
import { classify } from "./pipeline/classify.js";
import { dedupe } from "./pipeline/dedupe.js";
import { insertHackathons, getActiveAlerts } from "./pipeline/db.js";
import { processNotifications } from "./pipeline/notify.js";

// ── All registered scrapers ────────────────────────────────
const ALL_SCRAPERS = [
  new DevpostScraper(),
  new MLHScraper(),
  new ETHGlobalScraper(),
  new UnstopScraper(),
  new DevfolioScraper(),
  new HackerEarthScraper(),
  new ReskilllScraper(),
  new SIHScraper(),
  new Hack2SkillScraper(),
  new ColosseumScraper(),
  new AlignNexusScraper(),
];

interface ScrapeResult {
  source: SourceName;
  results: RawHackathon[];
  error?: string;
}

async function main(): Promise<void> {
  const startTime = Date.now();
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  HackAtlas Pipeline — Starting run");
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  // ── Step 1: Run all scrapers in parallel ─────────────────
  console.log("── Step 1: Scraping ──────────────────────────────────────\n");

  const scrapePromises = ALL_SCRAPERS.map((s) => s.safeScrape());
  const settledResults = await Promise.allSettled(scrapePromises);

  const scrapeResults: ScrapeResult[] = [];
  const failures: Array<{ source: string; error: string }> = [];

  for (let i = 0; i < settledResults.length; i++) {
    const settled = settledResults[i];
    const scraper = ALL_SCRAPERS[i];

    if (settled.status === "fulfilled") {
      scrapeResults.push(settled.value);
      if (settled.value.error) {
        failures.push({ source: scraper.name, error: settled.value.error });
      }
    } else {
      const errorMsg = settled.reason instanceof Error
        ? settled.reason.message
        : String(settled.reason);
      failures.push({ source: scraper.name, error: errorMsg });
      scrapeResults.push({ source: scraper.source, results: [], error: errorMsg });
    }
  }

  // Collect all raw results
  const allRaw: RawHackathon[] = scrapeResults.flatMap((r) => r.results);
  console.log(`\n✓ Total raw hackathons scraped: ${allRaw.length}\n`);

  // ── Step 2: Normalize ────────────────────────────────────
  console.log("── Step 2: Normalizing ───────────────────────────────────\n");
  const normalized = normalize(allRaw);
  console.log(`✓ Normalized: ${normalized.length} hackathons\n`);

  // ── Step 3: Classify ─────────────────────────────────────
  console.log("── Step 3: Classifying ───────────────────────────────────\n");
  const classified = classify(normalized);

  const indiaCount = classified.filter((h) => h.region === "India").length;
  const globalCount = classified.filter((h) => h.region === "Global").length;
  console.log(`✓ Region: ${indiaCount} India, ${globalCount} Global`);

  const tagCounts: Record<string, number> = {};
  for (const h of classified) {
    for (const tag of h.domainTags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  console.log(`✓ Tags: ${JSON.stringify(tagCounts)}\n`);

  // ── Step 4: Dedupe ───────────────────────────────────────
  console.log("── Step 4: Deduplicating ─────────────────────────────────\n");
  let newHackathons = classified;
  try {
    newHackathons = await dedupe(classified);
  } catch (err) {
    console.error("[Pipeline] Dedup failed — treating all as new:", err);
  }
  console.log(`✓ New hackathons after dedup: ${newHackathons.length}\n`);

  // ── Step 5: Insert into database ─────────────────────────
  console.log("── Step 5: Inserting into database ────────────────────────\n");
  let insertedCount = 0;
  try {
    insertedCount = await insertHackathons(newHackathons);
    console.log(`✓ Inserted ${insertedCount} hackathons into database\n`);
  } catch (err) {
    console.error("[Pipeline] Database insert failed:", err);
  }

  // ── Step 6: Notify ───────────────────────────────────────
  console.log("── Step 6: Processing notifications ───────────────────────\n");
  let notificationCount = 0;
  try {
    const alerts = await getActiveAlerts();
    console.log(`✓ Found ${alerts.length} active alert(s)`);

    notificationCount = await processNotifications(newHackathons, alerts);
    console.log(`✓ Sent ${notificationCount} notification(s)\n`);
  } catch (err) {
    console.error("[Pipeline] Notification processing failed:", err);
  }

  // ── Summary ──────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("═══════════════════════════════════════════════════════════");
  console.log("  HackAtlas Pipeline — Run Summary");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`  ⏱  Duration:       ${elapsed}s`);
  console.log(`  📡 Sources:        ${ALL_SCRAPERS.length} scrapers`);
  console.log(`  📥 Raw scraped:    ${allRaw.length} hackathons`);
  console.log(`  🆕 New found:      ${newHackathons.length} hackathons`);
  console.log(`  💾 DB inserted:    ${insertedCount} rows`);
  console.log(`  🔔 Notifications:  ${notificationCount} sent`);
  console.log(`  ❌ Failures:       ${failures.length} scraper(s)`);

  if (failures.length > 0) {
    console.log("\n  Failed scrapers:");
    for (const f of failures) {
      console.log(`    • ${f.source}: ${f.error}`);
    }
  }

  console.log("═══════════════════════════════════════════════════════════\n");

  // Exit with non-zero if all scrapers failed
  if (failures.length === ALL_SCRAPERS.length) {
    console.error("All scrapers failed — exiting with error code 1");
    process.exit(1);
  }
}

// Run the pipeline
main().catch((err) => {
  console.error("Fatal pipeline error:", err);
  process.exit(1);
});
