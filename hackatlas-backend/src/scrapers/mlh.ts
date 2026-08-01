// ═══════════════════════════════════════════════════════════
// HackAtlas — MLH Scraper
// Extracts event data from MLH's Inertia.js JSON blob
// embedded in the HTML page.
// ═══════════════════════════════════════════════════════════

import axios from "axios";
import * as cheerio from "cheerio";
import { Scraper } from "./base.js";
import type { RawHackathon } from "../types/hackathon.js";

const MLH_URL = "https://mlh.io/seasons/2026/events";

interface MLHEvent {
  id: string;
  slug: string;
  name: string;
  status: string;           // "upcoming", "ended", "live"
  startsAt: string;          // ISO timestamp
  endsAt: string;            // ISO timestamp
  url: string;               // relative path like "/events/hackprix-season-3/prizes"
  location: string;          // "Hyderabad, Telangana" or "Everywhere, Worldwide"
  formatType: string;        // "physical", "digital"
  backgroundUrl: string | null;
  logoUrl: string | null;
  websiteUrl: string;
  region: string | null;     // "APAC", "AMER", "EMEA"
  venueAddress: {
    city: string;
    state: string;
    country: string;         // "IN", "US", "CA", etc.
  } | null;
  customFields?: {
    underserved_types?: string[];
  };
}

interface InertiaPageData {
  component: string;
  props: {
    seriesName: string;
    upcomingEvents: MLHEvent[];
    pastEvents: MLHEvent[];
  };
}

export class MLHScraper extends Scraper {
  readonly name = "MLH";
  readonly source = "mlh" as const;

  async scrape(): Promise<RawHackathon[]> {
    console.log(`[MLH] Fetching ${MLH_URL}...`);

    const response = await axios.get(MLH_URL, {
      headers: {
        "User-Agent": "HackAtlas/1.0",
        "Accept": "text/html",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);

    // MLH uses Inertia.js — all data is in a <script data-page="app"> tag
    const inertiaScript = $('script[data-page="app"]').html();
    if (!inertiaScript) {
      console.warn("[MLH] Could not find Inertia.js data blob");
      return [];
    }

    let pageData: InertiaPageData;
    try {
      pageData = JSON.parse(inertiaScript);
    } catch (e) {
      console.error("[MLH] Failed to parse Inertia.js JSON:", e);
      return [];
    }

    const { upcomingEvents = [], pastEvents = [] } = pageData.props;

    // Combine upcoming and recent past events (past 30 days might still be relevant)
    const allEvents = [
      ...upcomingEvents,
      ...pastEvents.filter((e) => {
        const endDate = new Date(e.endsAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return endDate >= thirtyDaysAgo;
      }),
    ];

    console.log(
      `[MLH] Found ${upcomingEvents.length} upcoming + ` +
      `${allEvents.length - upcomingEvents.length} recent past events`
    );

    return allEvents.map((event) => this.parseEvent(event));
  }

  private parseEvent(event: MLHEvent): RawHackathon {
    const isOnline =
      event.formatType === "digital" ||
      event.location?.toLowerCase().includes("everywhere") ||
      event.location?.toLowerCase().includes("worldwide");

    const country = event.venueAddress?.country || null;
    const location = isOnline ? "Online" : event.location || "Unknown";

    // Determine if this is a student event from customFields
    const isStudent = event.customFields?.underserved_types?.some(
      (t) => t.toLowerCase().includes("student") || t.toLowerCase().includes("high school")
    );

    const description = [
      `${event.name} — MLH ${event.status} event.`,
      event.location && event.location !== "Everywhere, Worldwide"
        ? `Located in ${event.location}.`
        : "Online event.",
      event.formatType === "physical" ? "In-person hackathon." : "Virtual hackathon.",
      isStudent ? "Student-focused event." : "",
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 300);

    return {
      title: event.name,
      source: "mlh",
      url: event.websiteUrl || `https://mlh.io${event.url}`,
      startDate: event.startsAt ? event.startsAt.split("T")[0] : null,
      endDate: event.endsAt ? event.endsAt.split("T")[0] : null,
      location,
      isOnline,
      country: country || null,
      description,
      bannerImageUrl: event.backgroundUrl || event.logoUrl || null,
    };
  }
}
