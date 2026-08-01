// ═══════════════════════════════════════════════════════════
// HackAtlas — ETHGlobal Scraper
// Parses the server-rendered Next.js page at ethglobal.com/events.
// ═══════════════════════════════════════════════════════════

import axios from "axios";
import * as cheerio from "cheerio";
import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

const ETHGLOBAL_URL = "https://ethglobal.com/events";

/** Month abbreviation → 0-indexed month number */
const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

export class ETHGlobalScraper extends Scraper {
  readonly name = "ETHGlobal";
  readonly source = "ethglobal" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.log(`[ETHGlobal] Fetching ${ETHGLOBAL_URL}...`);

    const response = await axios.get(ETHGLOBAL_URL, {
      headers: {
        "User-Agent": "HackAtlas/1.0",
        "Accept": "text/html",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const hackathons: RawHackathon[] = [];

    // ETHGlobal renders events as <a> tags containing <section> elements
    // within the grid container under "Upcoming" heading
    $("a[href*='/events/']").each((_i, el) => {
      const $el = $(el);
      const href = $el.attr("href");
      if (!href || href === "/events") return;

      // Skip external links (like luma.com cowork events)
      const isExternal = href.startsWith("http") && !href.includes("ethglobal.com");

      // Get the event title from h2 inside the section
      const title = $el.find("h2").first().text().trim();
      if (!title) return;

      // Get location from the location badge
      const locationBadge = $el.find('svg[viewBox="0 0 24 24"]').parent();
      const locationText = locationBadge.find("span").text().trim();

      // Get event type from the type badge (Hackathon, Conference, Co-Working)
      const typeBadges = $el.find('span:contains("Hackathon"), span:contains("Conference"), span:contains("Co-Working"), span:contains("Async")');
      const eventType = typeBadges.first().text().trim();

      // Parse dates from the date display
      const dateDiv = $el.find(".text-center");
      const monthText = dateDiv.find(".uppercase").first().text().trim().toLowerCase();
      const dayTexts = dateDiv.find(".font-extrabold span").map((_j, span) => $(span).text().trim()).get();

      const dates = this.parseDates(monthText, dayTexts);

      // Determine if online
      const isOnline = eventType.toLowerCase().includes("async") ||
                       eventType.toLowerCase().includes("online") ||
                       locationText.toLowerCase().includes("online");

      // Parse location for city and country
      const { city, country } = this.parseLocation(locationText);

      // Build URL
      const fullUrl = isExternal
        ? href
        : (href.startsWith("http") ? href : `https://ethglobal.com${href}`);

      // Get banner image
      const bannerImg = $el.find("img").first().attr("src") || null;

      const description = [
        `${title} — ETHGlobal ${eventType || "event"}.`,
        locationText ? `Located in ${locationText}.` : "",
        "Ethereum/Web3 focused hackathon.",
      ]
        .filter(Boolean)
        .join(" ")
        .slice(0, 300);

      hackathons.push({
        title,
        source: "ethglobal",
        url: fullUrl,
        startDate: dates.startDate,
        endDate: dates.endDate,
        location: isOnline ? "Online" : (locationText || "Unknown"),
        isOnline,
        country,
        description,
        bannerImageUrl: bannerImg,
      });
    });

    return hackathons;
  }

  private parseDates(
    monthText: string,
    dayTexts: string[]
  ): { startDate: string | null; endDate: string | null } {
    const currentYear = new Date().getFullYear();
    const monthNum = MONTH_MAP[monthText];

    if (monthNum === undefined) return { startDate: null, endDate: null };

    // Filter out non-numeric day values (arrows, etc.)
    const days = dayTexts
      .map((d) => parseInt(d, 10))
      .filter((d) => !isNaN(d));

    if (days.length === 0) return { startDate: null, endDate: null };

    const startDay = days[0];
    const endDay = days.length > 1 ? days[days.length - 1] : startDay;

    const startDate = new Date(currentYear, monthNum, startDay);
    const endDate = new Date(currentYear, monthNum, endDay);

    // If the date is in the past by more than 6 months, assume next year
    const now = new Date();
    if (startDate.getTime() < now.getTime() - 180 * 24 * 60 * 60 * 1000) {
      startDate.setFullYear(currentYear + 1);
      endDate.setFullYear(currentYear + 1);
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  }

  private parseLocation(locationText: string): { city: string; country: string | null } {
    if (!locationText) return { city: "Unknown", country: null };

    // Format is typically "City, Country"
    const parts = locationText.split(",").map((p) => p.trim());
    return {
      city: parts[0] || "Unknown",
      country: parts.length > 1 ? parts[parts.length - 1] : null,
    };
  }
}
