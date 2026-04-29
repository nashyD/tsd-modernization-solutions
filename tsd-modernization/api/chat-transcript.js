/* ── /api/chat-transcript ──────────────────────────────────────────
 *
 * Receives the full chat conversation when a visitor leaves the site
 * (pagehide), backgrounds the tab (visibilitychange → hidden), or
 * closes the chat widget. Builds a TSD-branded HTML email matching
 * the voice receptionist's transcript format and ships it to the
 * founders via Gmail SMTP.
 *
 * Wire model: the client uses navigator.sendBeacon, which sends a
 * fire-and-forget Blob and doesn't wait for our response. So we have
 * to:
 *   - parse the body fast (sendBeacon ships as text/plain or blob,
 *     not application/json — req.body might already be parsed by
 *     Vercel or might be a raw string)
 *   - acknowledge with 204 quickly (the client won't see this anyway,
 *     but Vercel still needs us to return something)
 *   - dedup so a single conversation_id doesn't email twice
 *
 * Skips emailing when:
 *   - no real user messages (only the AI greeting present)
 *   - same conversation_id was already sent at this message count
 *     (Upstash dedup, 7-day TTL matches client localStorage retention)
 *
 * Env vars required (set in Vercel project settings):
 *   SMTP_USER, SMTP_PASS — Gmail Workspace app-password creds
 *   EMAIL_FROM (optional, defaults to SMTP_USER)
 *   EMAIL_TO   (optional, defaults to nashdavis@tsd-ventures.com)
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN — already used
 *     by /api/agent for rate limiting, reused here for dedup
 */

import nodemailer from "nodemailer";
import { Redis } from "@upstash/redis";

import { buildChatTranscriptEmail } from "./_email-template.js";

export const maxDuration = 15;

// Reuse the same Upstash creds as /api/agent. Dedup key namespace is
// separate (`chat-transcript:`) so no collision with rate-limit keys.
let dedup = null;
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
if (upstashUrl && upstashToken) {
  dedup = new Redis({ url: upstashUrl, token: upstashToken });
}

async function alreadySentAtCount(conversationId, messageCount) {
  if (!dedup || !conversationId) return false;
  try {
    const key = `chat-transcript:${conversationId}`;
    const prev = await dedup.get(key);
    if (prev != null && Number(prev) >= messageCount) return true;
    return false;
  } catch (e) {
    // Fail open — better to send a duplicate email than to drop a
    // legitimate transcript because Upstash hiccuped.
    console.warn(
      "[chat-transcript] dedup check failed, will send anyway:",
      e?.message || e,
    );
    return false;
  }
}

async function markSent(conversationId, messageCount) {
  if (!dedup || !conversationId) return;
  try {
    const key = `chat-transcript:${conversationId}`;
    // 7 day TTL — matches the client's localStorage STORAGE_MAX_AGE_MS.
    await dedup.set(key, messageCount, { ex: 7 * 24 * 60 * 60 });
  } catch (e) {
    console.warn("[chat-transcript] mark-sent failed:", e?.message || e);
  }
}

function hasRealUserMessages(messages) {
  if (!Array.isArray(messages)) return false;
  // Only count genuine visitor utterances. user-role messages whose
  // content is a tool_result array don't count — those are the model's
  // own tool-loop scaffold, not a human typing.
  return messages.some((m) => {
    if (!m || m.role !== "user") return false;
    if (typeof m.content === "string" && m.content.trim()) return true;
    return false;
  });
}

function findCapturedLead(messages) {
  // Walk forward looking for the most recent successful capture_lead
  // tool_use/tool_result pair. Returns the input dict if found.
  if (!Array.isArray(messages)) return null;
  let lastInput = null;
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (m?.role !== "assistant" || !Array.isArray(m.content)) continue;
    for (const block of m.content) {
      if (block?.type !== "tool_use" || block.name !== "capture_lead") {
        continue;
      }
      const next = messages[i + 1];
      if (next?.role !== "user" || !Array.isArray(next.content)) continue;
      const result = next.content.find(
        (b) => b?.type === "tool_result" && b.tool_use_id === block.id,
      );
      if (result && !result.is_error) {
        lastInput = block.input;
      }
    }
  }
  return lastInput;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // sendBeacon doesn't always set application/json — body might be a
  // raw string or already parsed. Normalize.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  } else if (Buffer.isBuffer(body)) {
    try {
      body = JSON.parse(body.toString("utf-8"));
    } catch {
      body = null;
    }
  }
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const {
    conversation_id: conversationId,
    messages,
    page_url: pageUrl,
    started_at: startedAt,
  } = body;

  if (!Array.isArray(messages) || !messages.length) {
    res.status(204).end();
    return;
  }

  // Skip empty/AI-only conversations — visitor never said anything,
  // not worth an email.
  if (!hasRealUserMessages(messages)) {
    res.status(204).end();
    return;
  }

  // Dedup. Same conversation, same or fewer messages = already emailed.
  // If conversation extended (more messages), send the updated version.
  if (await alreadySentAtCount(conversationId, messages.length)) {
    res.status(204).end();
    return;
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || smtpUser;
  const emailTo = process.env.EMAIL_TO || "nashdavis@tsd-ventures.com";
  if (!smtpUser || !smtpPass || !emailTo) {
    console.warn(
      "[chat-transcript] SMTP not configured (SMTP_USER/SMTP_PASS/EMAIL_TO); skipping",
    );
    // 503 so the client knows it's a config issue if they ever read
    // the response (sendBeacon won't, but a regular fetch fallback would).
    res.status(503).json({ error: "Email backend not configured" });
    return;
  }

  const capturedLead = findCapturedLead(messages);

  const { subject, html, text, logoBytes, logoCid } =
    buildChatTranscriptEmail({
      conversationId,
      messages,
      capturedLead,
      pageUrl,
      startedAt,
    });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS, not direct TLS
    auth: { user: smtpUser, pass: smtpPass },
  });

  const attachments = [];
  if (logoBytes && logoCid) {
    attachments.push({
      filename: "tsd-ms-logo.png",
      content: logoBytes,
      cid: logoCid,
      contentType: "image/png",
    });
  }

  try {
    await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject,
      text,
      html,
      attachments,
    });
    await markSent(conversationId, messages.length);
    res.status(204).end();
  } catch (e) {
    console.error("[chat-transcript] sendMail failed:", e?.message || e);
    res.status(500).json({ error: "Send failed" });
  }
}
