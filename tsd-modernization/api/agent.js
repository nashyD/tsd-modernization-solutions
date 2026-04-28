import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Vercel: extend the function timeout from the 10s default. Streaming
// responses are short (Haiku 4.5 typically finishes in <5s) but the
// tool loop can chain 2-3 model calls when capture_lead fires, so 30s
// gives comfortable headroom while staying inside the Hobby tier cap.
export const maxDuration = 30;

/* ── System prompt ─────────────────────────────────────────────────
 * Composed at module init from two pieces:
 *   1. TSD_KNOWLEDGE — shared brain, lives in /content/tsd-knowledge.md
 *      and is read by every agent surface (this chat agent, the voice
 *      receptionist, future SMS/email agents). Edit that file when TSD
 *      facts change (pricing, founders, offer mix, honest-framing rule).
 *   2. CHAT_DELIVERY — chat-surface-specific rules + capture_lead tool
 *      instructions + tone calibration. Stays inline here because it's
 *      tied to this surface's tool schema and rendering medium (markdown
 *      bullets render in the chat widget; they wouldn't make sense for
 *      a voice agent reading aloud).
 *
 * Vercel: the .md file is bundled with the function via vercel.json's
 * functions["api/agent.js"].includeFiles = "content/**". process.cwd()
 * resolves to the project root in the serverless runtime.
 */
const TSD_KNOWLEDGE = readFileSync(
  join(process.cwd(), "content", "tsd-knowledge.md"),
  "utf-8",
);

const CHAT_DELIVERY = `

---

# Surface: chat widget

You are the chat agent for TSD Modernization Solutions, embedded in the chat widget on the website. You answer visitor questions and, when someone shows real interest, you collect their info so a founder can follow up.

## Chat-surface delivery

These rules layer on top of the universal voice rules above:
- One short paragraph at a time. Don't dump the menu.
- Markdown bullets and **bold** are tolerated but rationed — visitors see them rendered, not as syntax. Use them when they actually help.

## When to capture a lead

Use the capture_lead tool when the visitor:
- Says they want to talk to a founder, schedule a call, or get started
- Asks for a quote or proposal for a specific business
- Wants more detail than chat can usefully give
- Has been chatting for a while and clearly wants to work together

Before calling the tool, you need their name, email, business name, and a one- to three-sentence summary of what they want built. **Ask for these one at a time, conversationally.** Don't drop a form on them. ("Cool, what's your name?" → wait → "What's the best email?" → wait → "What's the business?" → wait.)

If they're just browsing, answer the question and let them lead. Don't push capture on a casual visitor.

After successfully capturing a lead, tell them: "Got it — one of the founders will reach out within 24 hours."

## Tone calibration — sample chat exchanges

Visitor: "how much for a website"
Bad: "Great question! We offer a comprehensive Website + AI bundle starting at $2,000 founding rate, which includes a custom-built site..."
Good: "$2,000 for our founding cohort, $4,000 standard. That's a custom React site, an AI chatbot, SEO, the works — plus a founder on call through August. What kind of business?"

Visitor: "do you have any past clients I can look at"
Bad: "We have an excellent track record of delivering quality results to our valued clients..."
Good: "Honestly — no one yet. Summer 2026 is our first cohort, we're recruiting the founding ten right now. Founding clients get half-price and direct founder access. What were you thinking of building?"

Visitor: "ok i think im interested. how do we get started"
Bad: "Wonderful! Please provide your name, email address, business name, and a brief description of your project so we can connect you with one of our founders."
Good: "Cool. What's your name?"`;

const SYSTEM_PROMPT = TSD_KNOWLEDGE + CHAT_DELIVERY;

const TOOLS = [
  {
    name: "capture_lead",
    description:
      "Submit the visitor as a lead for one of the founders to follow up. Use only after the visitor has expressed clear interest in working together AND you have collected their name, email, business name, and a one- to three-sentence summary of what they want done. Do not call this tool for casual browsers — it goes to the founders' inbox and a low-quality lead wastes their time.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Visitor's name" },
        email: { type: "string", description: "Visitor's email address" },
        business: {
          type: "string",
          description:
            "Business name. If the visitor has not given one, pass 'Not provided'.",
        },
        summary: {
          type: "string",
          description:
            "One to three sentences summarizing what the visitor wants done, in their own words where possible. This goes directly to the founders' inbox.",
        },
      },
      required: ["name", "email", "business", "summary"],
    },
  },
];

const client = new Anthropic();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Per-IP rate limit, distributed via Upstash Redis (free tier covers
   TSD's expected volume — 10K commands/day, 256MB storage). Sliding
   window of 30 requests per 10 minutes per IP: a real conversation
   runs 5-15 messages, so legit users have ~2x headroom while aggressive
   scripts trip in the first 30 seconds.

   Replaces an earlier in-memory implementation that worked for a single
   warm container but bypassed during cold-start scaling — Upstash is
   shared state across every container, so a script can't dodge by
   spreading requests across instances.

   Fail-open behavior: if UPSTASH_REDIS_REST_URL or _TOKEN are missing,
   or if Upstash is unreachable, the limiter no-ops and the agent stays
   functional. Vercel's platform-level DDoS protection still handles the
   wider-blast case while Upstash is down. */
let ratelimit = null;
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
if (upstashUrl && upstashToken) {
  const redis = new Redis({ url: upstashUrl, token: upstashToken });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "10 m"),
    analytics: true,
    prefix: "tsd-agent",
  });
}

async function checkRateLimit(ip) {
  if (!ip) return { allowed: true };
  if (!ratelimit) return { allowed: true };
  try {
    const result = await ratelimit.limit(ip);
    return {
      allowed: result.success,
      retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
      limit: result.limit,
      remaining: result.remaining,
    };
  } catch (e) {
    // Upstash request failed — fail open and log so the outage is
    // visible in Vercel logs without taking the agent down.
    console.warn("[/api/agent] Rate-limit check failed:", e?.message || e);
    return { allowed: true };
  }
}

function getClientIP(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string") return fwd.split(",")[0]?.trim() || null;
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || null;
}

async function submitLead({ name, email, business, summary }) {
  // Lead-capture validation: catch malformed input before posting to
  // Web3Forms. The tool schema requires these fields, but the agent
  // can still pass blanks or a malformed email — guard explicitly so
  // the founders' inbox stays clean.
  const errors = [];
  if (!name?.trim()) errors.push("name is empty");
  if (!email?.trim()) errors.push("email is empty");
  else if (!EMAIL_REGEX.test(email.trim())) errors.push("email format is invalid");
  if (!summary?.trim()) errors.push("summary is empty");
  if (errors.length) {
    return {
      ok: false,
      message: `Lead validation failed: ${errors.join(", ")}. Confirm the visitor's contact details before retrying — ask them to spell their email if it looked wrong.`,
    };
  }

  const accessKey = process.env.VITE_WEB3FORMS_KEY;
  if (!accessKey) {
    return {
      ok: false,
      message:
        "Lead capture failed: Web3Forms backend not configured. Apologize and ask the visitor to call (704) 317-5630 directly.",
    };
  }
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[Chat agent] New lead from ${name.trim()}`,
        from_name: "TSD Modernization Solutions Chat Agent",
        replyto: email.trim(),
        name: name.trim(),
        email: email.trim(),
        business: business?.trim() || "Not provided",
        message: summary.trim(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return {
        ok: true,
        message:
          "Lead submitted successfully. Confirm to the visitor that one of the founders will reach out within 24 hours.",
      };
    }
    return {
      ok: false,
      message: `Lead submission failed: ${data.message || `HTTP ${res.status}`}. Apologize and ask the visitor to call (704) 317-5630 directly.`,
    };
  } catch (e) {
    return {
      ok: false,
      message: `Network error during lead submission: ${e.message}. Apologize and ask the visitor to call (704) 317-5630 directly.`,
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({
      error:
        "Agent not configured. ANTHROPIC_API_KEY is missing from Vercel environment variables.",
    });
    return;
  }

  const ip = getClientIP(req);
  const rl = await checkRateLimit(ip);
  if (!rl.allowed) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    if (rl.limit != null) res.setHeader("X-RateLimit-Limit", String(rl.limit));
    if (rl.remaining != null) res.setHeader("X-RateLimit-Remaining", String(rl.remaining));
    res.status(429).json({
      error: `Too many requests. Wait ${rl.retryAfter}s and try again.`,
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }

  const incomingMessages = body?.messages;
  if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
    res.status(400).json({ error: "Missing or empty messages array." });
    return;
  }
  if (incomingMessages.length > 60) {
    res.status(400).json({
      error:
        "Conversation too long. Refresh the page to start a new conversation.",
    });
    return;
  }

  /* ── Streaming response ─────────────────────────────────────────
   * Wire format: NDJSON. One JSON object per newline-terminated line.
   * Event types the client handles:
   *   {type:"delta", text}   — incremental text from the model
   *   {type:"done", messages, leadCaptured}  — terminal, full state
   *   {type:"error", error}  — terminal, failure
   * Tool execution happens between iterations of the loop and is
   * invisible to the client beyond a brief pause in delta events.
   */
  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  function emit(obj) {
    res.write(JSON.stringify(obj) + "\n");
    // Flush the response buffer so deltas reach the client without
    // waiting for Node to fill an internal buffer. flushHeaders is
    // a no-op after first write but res.flush exists on most adapters.
    if (typeof res.flush === "function") res.flush();
  }

  const messages = [...incomingMessages];
  let leadCaptured = false;

  try {
    for (let iteration = 0; iteration < 4; iteration++) {
      const stream = client.messages.stream({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages,
      });

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta?.type === "text_delta"
        ) {
          emit({ type: "delta", text: event.delta.text });
        }
      }

      const final = await stream.finalMessage();
      messages.push({ role: "assistant", content: final.content });

      if (final.stop_reason !== "tool_use") break;

      const toolResults = [];
      for (const block of final.content) {
        if (block.type !== "tool_use") continue;
        if (block.name === "capture_lead") {
          const result = await submitLead(block.input);
          if (result.ok) leadCaptured = true;
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result.message,
            is_error: !result.ok,
          });
        } else {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Unknown tool: ${block.name}`,
            is_error: true,
          });
        }
      }
      messages.push({ role: "user", content: toolResults });
    }

    emit({ type: "done", messages, leadCaptured });
    res.end();
  } catch (e) {
    console.error("[/api/agent] Stream failed:", e);
    // If we've already started streaming, emit error event in the wire
    // format the client expects. Otherwise return a normal JSON error.
    if (res.headersSent) {
      emit({ type: "error", error: e?.message || "Agent error." });
      res.end();
    } else {
      const status = e?.status >= 400 && e?.status < 600 ? e.status : 500;
      res.status(status).json({
        error: e?.message || "Agent error. Please try again.",
      });
    }
  }
}
