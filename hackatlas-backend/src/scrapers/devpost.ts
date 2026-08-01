// ═══════════════════════════════════════════════════════════
// HackAtlas — Devpost Scraper
// Uses Devpost's public JSON API endpoint.
// ═══════════════════════════════════════════════════════════

import axios from "axios";
import { Scraper, sleep } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

const DEVPOST_API = "https://devpost.com/api/hackathons";
const MAX_PAGES = 5; // 9 per page = up to 45 hackathons

interface DevpostHackathon {
  id: number;
  title: string;
  url: string;
  displayed_location: {
    icon: string;
    location: string;
  };
  open_state: string;
  thumbnail_url: string | null;
  submission_period_dates: string; // e.g. "May 19 - Aug 17, 2026"
  themes: Array<{ id: number; name: string }>;
  prize_amount: string | null;    // HTML-encoded, e.g. "$<span data-currency-value>2,000,000</span>"
  registrations_count: number;
  organization_name: string;
}

interface DevpostResponse {
  hackathons: DevpostHackathon[];
  meta: {
    total_count: number;
    per_page: number;
  };
}

/**
 * Parse Devpost's submission_period_dates string into ISO dates.
 * Format: "May 19 - Aug 17, 2026" or "Jun 30 - Aug 18, 2026"
 */
function parseDateRange(dateStr: string): { startDate: string | null; endDate: string | null } {
  try {
    // Pattern: "Month Day - Month Day, Year"
    const match = dateStr.match(
      /^(\w+)\s+(\d{1,2})\s*-\s*(\w+)\s+(\d{1,2}),\s*(\d{4})$/
    );
    if (!match) return { startDate: null, endDate: null };

    const [, startMonth, startDay, endMonth, endDay, year] = match;

    const startDate = new Date(`${startMonth} ${startDay}, ${year}`);
    const endDate = new Date(`${endMonth} ${endDay}, ${year}`);

    // If the start month comes after the end month, the start is in the previous year
    if (startDate > endDate) {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    return {
      startDate: isNaN(startDate.getTime()) ? null : startDate.toISOString().split("T")[0],
      endDate: isNaN(endDate.getTime()) ? null : endDate.toISOString().split("T")[0],
    };
  } catch {
    return { startDate: null, endDate: null };
  }
}

/**
 * Parse the prize_amount HTML string into a numeric USD value.
 * Input: "$<span data-currency-value>2,000,000</span>"
 * Output: { raw: "$2,000,000", amount: 2000000 }
 */
function parsePrize(prizeHtml: string | null): { raw: string | null; amount: number | null } {
  if (!prizeHtml) return { raw: null, amount: null };

  // Strip HTML tags
  const raw = prizeHtml.replace(/<[^>]*>/g, "").trim();
  if (!raw) return { raw: null, amount: null };

  // Extract numeric value
  const numStr = raw.replace(/[^0-9.]/g, "");
  const amount = numStr ? parseFloat(numStr) : null;

  // Convert USD to INR (approximate rate)
  const amountInr = amount ? Math.round(amount * 83) : null;

  return { raw, amount: amountInr };
}

export class DevpostScraper extends Scraper {
  readonly name = "Devpost";
  readonly source = "devpost" as const;

  async scrape(): Promise<RawHackathon[]> {
    const allHackathons: RawHackathon[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      console.log(`[Devpost] Fetching page ${page}...`);

      const response = await axios.get<DevpostResponse>(DEVPOST_API, {
        params: { page },
        headers: {
          "Accept": "application/json",
          "User-Agent": "HackAtlas/1.0",
        },
        timeout: 15000,
      });

      const { hackathons } = response.data;
      if (!hackathons || hackathons.length === 0) break;

      for (const h of hackathons) {
        // Only include open/upcoming hackathons
        if (h.open_state !== "open" && h.open_state !== "upcoming") continue;

        const { startDate, endDate } = parseDateRange(h.submission_period_dates);
        const { raw: prizeRaw, amount: prizePool } = parsePrize(h.prize_amount);
        const locationStr = h.displayed_location?.location || "Online";
        const isOnline = locationStr.toLowerCase() === "online" ||
                         h.displayed_location?.icon === "globe";

        const themes = h.themes?.map((t) => t.name).join(", ") || "";
        const description = `${h.title} by ${h.organization_name}. ${themes}`.slice(0, 300);

        allHackathons.push({
          title: h.title,
          source: "devpost",
          url: h.url,
          startDate,
          endDate,
          location: locationStr,
          isOnline,
          prizePool,
          prizePoolRaw: prizeRaw,
          description,
          bannerImageUrl: h.thumbnail_url
            ? (h.thumbnail_url.startsWith("//")
              ? `https:${h.thumbnail_url}`
              : h.thumbnail_url)
            : null,
        });
      }

      // Respect rate limits
      if (page < MAX_PAGES) await sleep(1500);
    }

    return allHackathons;
  }
}
