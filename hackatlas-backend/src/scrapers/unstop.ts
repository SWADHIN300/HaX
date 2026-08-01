// ═══════════════════════════════════════════════════════════
// HackAtlas — Unstop Scraper
// Uses Playwright for the JS-heavy SPA at unstop.com/hackathons.
// Selectors may need adjustment after the first live test run.
// ═══════════════════════════════════════════════════════════

import { Scraper, sleep } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

const UNSTOP_URL = "https://unstop.com/hackathons";

export class UnstopScraper extends Scraper {
  readonly name = "Unstop";
  readonly source = "unstop" as const;

  async scrape(): Promise<RawHackathon[]> {
    // Dynamic import — only loads Playwright when this scraper runs
    const { chromium } = await import("playwright");

    console.log(`[Unstop] Launching browser...`);
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const context = await browser.newContext({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        viewport: { width: 1280, height: 720 },
      });

      const page = await context.newPage();

      console.log(`[Unstop] Navigating to ${UNSTOP_URL}...`);
      await page.goto(UNSTOP_URL, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Wait for hackathon cards to render
      // TODO: Adjust selector after first live test run — Unstop's DOM changes frequently
      await page.waitForSelector(
        ".single_card, .listing-card, [class*='hackathon-card'], [class*='opportunity-card']",
        { timeout: 15000 }
      ).catch(() => {
        console.warn("[Unstop] Card selector did not match — trying scroll approach");
      });

      // Scroll down to load more content (lazy loading)
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await sleep(2000);
      }

      // Extract hackathon data from the rendered page
      // TODO: These selectors are best-effort guesses based on Unstop's typical DOM structure.
      //       Run `npm run pipeline` once and inspect the page to refine.
      //
      // Note: The evaluate callback runs in the BROWSER context (DOM APIs).
      // We cast the function to avoid needing 'dom' in tsconfig lib.
      type CardData = {
        title: string;
        url: string;
        dates: string;
        prize: string;
        mode: string;
        organization: string;
        imageUrl: string;
      };

      const hackathons = await page.evaluate((): CardData[] => {
        const results: CardData[] = [];

        // Try multiple possible card selectors
        const cardSelectors = [
          ".single_card",
          ".listing-card",
          "[class*='hackathon-card']",
          "[class*='opportunity-card']",
          ".card-container",
          "app-competition-card",
        ];

        let cards: HTMLElement[] = [];
        for (const sel of cardSelectors) {
          const found = document.querySelectorAll<HTMLElement>(sel);
          if (found.length > 0) {
            cards = Array.from(found);
            break;
          }
        }

        // Fallback: look for anchor tags with hackathon-like URLs
        if (cards.length === 0) {
          const links = document.querySelectorAll<HTMLElement>('a[href*="/hackathon"], a[href*="/hackathons/"]');
          cards = Array.from(links);
        }

        for (const card of cards) {
          // Try to extract title
          const titleEl =
            card.querySelector("h3, h4, .card-title, [class*='title'], .name") ||
            card.querySelector("p.font-semibold, p.font-bold");
          const title = titleEl?.textContent?.trim() || "";

          // Try to extract URL
          const linkEl = card.tagName === "A" ? card : card.querySelector("a");
          const href = (linkEl as HTMLAnchorElement | null)?.getAttribute("href") || "";
          const url = href.startsWith("http") ? href : `https://unstop.com${href}`;

          // Try to extract dates
          const dateEl = card.querySelector(
            "[class*='date'], .date-time, time, [class*='deadline']"
          );
          const dates = dateEl?.textContent?.trim() || "";

          // Try to extract prize
          const prizeEl = card.querySelector(
            "[class*='prize'], [class*='worth'], [class*='reward']"
          );
          const prize = prizeEl?.textContent?.trim() || "";

          // Try to extract mode (online/offline)
          const modeEl = card.querySelector(
            "[class*='mode'], [class*='online'], [class*='offline']"
          );
          const mode = modeEl?.textContent?.trim() || "";

          // Try to extract organization
          const orgEl = card.querySelector(
            "[class*='org'], [class*='company'], [class*='host']"
          );
          const organization = orgEl?.textContent?.trim() || "";

          // Image
          const imgEl = card.querySelector("img");
          const imageUrl = imgEl?.getAttribute("src") || "";

          if (title && url) {
            results.push({ title, url, dates, prize, mode, organization, imageUrl });
          }
        }

        return results;
      });

      console.log(`[Unstop] Extracted ${hackathons.length} hackathon cards`);

      return hackathons.map((h) => {
        const isOnline =
          h.mode.toLowerCase().includes("online") ||
          h.mode.toLowerCase().includes("virtual");

        const { prizePool, prizeRaw } = this.parsePrize(h.prize);
        const { startDate, endDate } = this.parseDates(h.dates);

        const description = [
          h.title,
          h.organization ? `by ${h.organization}` : "",
          h.mode || "",
        ]
          .filter(Boolean)
          .join(" — ")
          .slice(0, 300);

        return {
          title: h.title,
          source: "unstop" as const,
          url: h.url,
          startDate,
          endDate,
          location: isOnline ? "Online" : "India",
          isOnline,
          country: "India",
          prizePool,
          prizePoolRaw: prizeRaw || null,
          description,
          bannerImageUrl: h.imageUrl || null,
        };
      });
    } finally {
      await browser.close();
    }
  }

  private parsePrize(prizeStr: string): { prizePool: number | null; prizeRaw: string | null } {
    if (!prizeStr) return { prizePool: null, prizeRaw: null };

    const cleaned = prizeStr.replace(/[^0-9.,₹$KkLlCcMm ]/g, "").trim();
    if (!cleaned) return { prizePool: null, prizeRaw: prizeStr };

    let amount: number | null = null;

    // Try to parse INR amounts (₹ or plain numbers with K/L/Cr suffixes)
    const numMatch = cleaned.match(/([\d,.]+)\s*(K|L|Lakh|Lakhs|Cr|Crore|M)?/i);
    if (numMatch) {
      amount = parseFloat(numMatch[1].replace(/,/g, ""));
      const suffix = (numMatch[2] || "").toLowerCase();

      if (suffix === "k") amount *= 1000;
      else if (suffix === "l" || suffix === "lakh" || suffix === "lakhs") amount *= 100000;
      else if (suffix === "cr" || suffix === "crore") amount *= 10000000;
      else if (suffix === "m") amount *= 1000000;
    }

    return { prizePool: amount ? Math.round(amount) : null, prizeRaw: prizeStr };
  }

  private parseDates(dateStr: string): { startDate: string | null; endDate: string | null } {
    if (!dateStr) return { startDate: null, endDate: null };

    // Try various date formats Unstop might use
    // Common: "15 Aug 2026 - 17 Aug 2026" or "Aug 15 - 17, 2026"
    try {
      // Split on common separators
      const parts = dateStr.split(/\s*[-–to]\s*/i);

      if (parts.length >= 2) {
        const start = new Date(parts[0].trim());
        const end = new Date(parts[parts.length - 1].trim());

        return {
          startDate: isNaN(start.getTime()) ? null : start.toISOString().split("T")[0],
          endDate: isNaN(end.getTime()) ? null : end.toISOString().split("T")[0],
        };
      }

      // Single date
      const single = new Date(dateStr.trim());
      return {
        startDate: isNaN(single.getTime()) ? null : single.toISOString().split("T")[0],
        endDate: null,
      };
    } catch {
      return { startDate: null, endDate: null };
    }
  }
}
