// ═══════════════════════════════════════════════════════════
// HackAtlas — Classification Pipeline Stage
// Assigns region (India/Global) and domain tags to hackathons.
// ═══════════════════════════════════════════════════════════

import type { DomainTag, Hackathon, Region, SourceName } from "../types/hackathon.js";

// ── India-default sources ──────────────────────────────────
const INDIA_SOURCES: SourceName[] = [
  "unstop",
  "devfolio",
  "hackerearth",
  "reskilll",
  "sih",
  "hack2skill",
];

// ── Indian city names for location matching ────────────────
const INDIAN_CITIES = [
  "bangalore",
  "bengaluru",
  "mumbai",
  "delhi",
  "new delhi",
  "hyderabad",
  "pune",
  "chennai",
  "kolkata",
  "noida",
  "gurgaon",
  "gurugram",
  "jaipur",
  "ahmedabad",
  "lucknow",
  "chandigarh",
  "indore",
  "bhopal",
  "kochi",
  "coimbatore",
  "thiruvananthapuram",
  "trivandrum",
  "visakhapatnam",
  "vizag",
  "nagpur",
  "surat",
  "vadodara",
  "mysore",
  "mysuru",
  "mangalore",
  "mangaluru",
  "bhubaneswar",
  "patna",
  "ranchi",
  "guwahati",
  "dehradun",
  "amritsar",
  "varanasi",
  "agra",
  "kanpur",
  "jodhpur",
  "udaipur",
  "madurai",
  "tiruchirappalli",
  "hubli",
  "belgaum",
  "manipal",
  "pilani",
  "kharagpur",
  "roorkee",
  "warangal",
  "vellore",
  "asansol",
];

// ── Domain keyword sets ────────────────────────────────────
const DOMAIN_KEYWORDS: Record<DomainTag, string[]> = {
  Web3: [
    "blockchain", "web3", "solana", "ethereum", "crypto", "defi",
    "nft", "dao", "smart contract", "dapp", "decentralized",
    "token", "wallet", "consensus", "layer 2", "l2", "zk",
    "zero knowledge", "rollup", "onchain", "on-chain",
  ],
  AI: [
    "artificial intelligence", "machine learning", " ai ",
    "genai", "gen ai", "generative ai", "llm", "agent",
    "neural", "deep learning", "nlp", "computer vision",
    "chatbot", "gpt", "transformer", "rag", "agentic",
  ],
  Fintech: [
    "fintech", "payments", "banking", "finance", "trading",
    "insurtech", "regtech", "lending", "upi", "neobank",
  ],
  Student: [
    "student", "college", "campus", "undergraduate",
    "university", "school", "academic", "freshers",
  ],
  Government: [
    "ministry", "sih", "smart india", "public sector",
    "e-governance", "civic", "government", "gov",
  ],
  Design: [
    "design", "ui/ux", "ux", "figma", "prototype",
    "designathon",
  ],
  "Open Source": [
    "open source", "oss", "foss", "gsoc", "hacktoberfest",
    "open-source", "contribution",
  ],
  General: [], // fallback — no keywords
};

/**
 * Detect the region for a hackathon based on its source and location.
 */
function detectRegion(h: Hackathon): Region {
  // India-default sources
  if (INDIA_SOURCES.includes(h.source)) {
    return "India";
  }

  // For global sources, check location and country fields
  const locationLower = (h.location || "").toLowerCase();
  const countryLower = (h.country || "").toLowerCase();

  // Check for literal "India" or "IN" country code
  if (
    countryLower === "india" ||
    countryLower === "in" ||
    locationLower.includes("india")
  ) {
    return "India";
  }

  // Check for Indian city names in location
  for (const city of INDIAN_CITIES) {
    if (locationLower.includes(city)) {
      return "India";
    }
  }

  return "Global";
}

/**
 * Assign domain tags based on keyword matching in title + description.
 * Case-insensitive. Returns at least ["General"] if nothing matches.
 */
function detectDomainTags(h: Hackathon): DomainTag[] {
  const text = ` ${h.title} ${h.description} `.toLowerCase();
  const matched: DomainTag[] = [];

  for (const [tag, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (tag === "General") continue; // skip General — it's the fallback

    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matched.push(tag as DomainTag);
        break; // one match per category is enough
      }
    }
  }

  return matched.length > 0 ? matched : ["General"];
}

/**
 * Classify an array of hackathons: assign region and domain tags.
 * Mutates the hackathons in-place and returns the same array.
 */
export function classify(hackathons: Hackathon[]): Hackathon[] {
  for (const h of hackathons) {
    h.region = detectRegion(h);
    h.domainTags = detectDomainTags(h);
  }
  return hackathons;
}
