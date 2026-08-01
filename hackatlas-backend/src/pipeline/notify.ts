// ═══════════════════════════════════════════════════════════
// HackAtlas — Notification Pipeline Stage
// Sends push notifications via ntfy.sh for matched hackathons.
// ═══════════════════════════════════════════════════════════

import axios from "axios";
import type { Alert, Hackathon } from "../types/hackathon.js";
import { hasBeenNotified, logNotification } from "./db.js";

const NTFY_BASE = "https://ntfy.sh";

/**
 * Check if a hackathon matches an alert's criteria.
 */
export function matchesAlert(hackathon: Hackathon, alert: Alert): boolean {
  // Region check
  if (alert.region !== "Both" && hackathon.region !== alert.region) {
    return false;
  }

  // Online-only check
  if (alert.is_online_only && !hackathon.isOnline) {
    return false;
  }

  // Minimum prize check
  if (alert.min_prize !== null && alert.min_prize > 0) {
    if (hackathon.prizePool === null || hackathon.prizePool < alert.min_prize) {
      return false;
    }
  }

  // Domain tags check (empty alert tags = match all)
  if (alert.domain_tags.length > 0) {
    const hackathonTagsLower = hackathon.domainTags.map((t) => t.toLowerCase());
    const alertTagsLower = alert.domain_tags.map((t) => t.toLowerCase());
    const hasOverlap = alertTagsLower.some((tag) => hackathonTagsLower.includes(tag));
    if (!hasOverlap) return false;
  }

  return true;
}

/**
 * Send a push notification via ntfy.sh for a hackathon.
 */
async function sendNtfyNotification(
  hackathon: Hackathon,
  topic: string
): Promise<void> {
  const regionEmoji = hackathon.region === "India" ? "🇮🇳" : "🌍";
  const title = `${regionEmoji} New Hackathon: ${hackathon.title}`;

  const bodyParts = [
    hackathon.source.toUpperCase(),
    hackathon.prizePoolRaw || "Prize TBD",
    hackathon.startDate && hackathon.endDate
      ? `${hackathon.startDate} – ${hackathon.endDate}`
      : hackathon.startDate || "Dates TBD",
    hackathon.location,
  ];
  const body = bodyParts.join(" | ");

  // Priority: high if prize > ₹1 lakh (100,000 INR)
  const priority =
    hackathon.prizePool !== null && hackathon.prizePool > 100000
      ? "high"
      : "default";

  try {
    await axios.post(`${NTFY_BASE}/${topic}`, body, {
      headers: {
        Title: title,
        Click: hackathon.url,
        Priority: priority,
        Tags: hackathon.domainTags.join(","),
      },
      timeout: 10000,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Notify] Failed to send notification for "${hackathon.title}": ${msg}`);
  }
}

/**
 * Process notifications for new hackathons against active alerts.
 * Checks notification_log to avoid duplicates.
 *
 * @returns Number of notifications sent
 */
export async function processNotifications(
  newHackathons: Hackathon[],
  alerts: Alert[]
): Promise<number> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    console.warn("[Notify] NTFY_TOPIC not set — skipping notifications");
    return 0;
  }

  if (newHackathons.length === 0 || alerts.length === 0) {
    return 0;
  }

  let notificationCount = 0;

  for (const hackathon of newHackathons) {
    for (const alert of alerts) {
      if (!matchesAlert(hackathon, alert)) continue;

      // Check if already notified
      const alreadyNotified = await hasBeenNotified(hackathon.id, alert.id);
      if (alreadyNotified) continue;

      // Send notification
      await sendNtfyNotification(hackathon, topic);

      // Log to prevent re-notification
      await logNotification(hackathon.id, alert.id);

      notificationCount++;

      // Small delay between notifications to avoid rate limiting ntfy.sh
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return notificationCount;
}
