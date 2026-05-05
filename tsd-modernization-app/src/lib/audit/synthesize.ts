import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import {
  AuditScoresSchema,
  type RawAuditData,
  type SynthesisOutput,
} from "./types";

let client: Anthropic | null = null;
function anthropic() {
  if (client) return client;
  client = new Anthropic({ apiKey: env().ANTHROPIC_API_KEY });
  return client;
}

const SYSTEM_PROMPT = `You are TSD Modernization Solutions' audit synthesizer. You evaluate a small business's online presence and recommend TSD services.

You will receive a raw_data JSON blob with two parts:
- scrape: data extracted from fetching the business's website (title, meta, structural signals, CTA presence, link counts).
- places: data from Google Places (rating, review count, photos, hours).

Your job: produce a strict-JSON object matching the schema below. No prose outside the JSON.

Scoring rubric (0-100, higher is better):
- website: signals from scrape — title/description present, mobile viewport, schema markup, OG tags, favicon, image alt %, internal nav, sitemap, https, CTAs.
- google: places.found, rating, user_ratings_total relative to industry norms (50+ reviews is solid for an SMB).
- reviews: rating quality (4.5+ great, 4.0-4.4 ok, <4.0 needs work), volume, recency cannot be judged from this data — note that limitation.
- trust: HTTPS, contact info on page (phone/email), schema, accurate Google listing.
- conversion: clear CTA, contact link, phone/email visible, fast-loading signals.
- presence_score: weighted average (website 0.25, google 0.25, reviews 0.20, trust 0.15, conversion 0.15).

Gaps: 5-10 specific, evidence-backed weaknesses. Each must cite a concrete observation from raw_data, not generic advice. Severity: critical (loses customers daily), high (lost search traffic / trust), medium (polish), low (nice-to-have).

TSD service mapping. Pick at most 5 services that directly address the top gaps:
- website_rebuild: when website signals are critically weak (no schema, no OG, broken structure, looks dated).
- ai_chatbot: when site has weak CTA / no after-hours capture path AND business has phone present (good lead capture upside).
- ai_receptionist: when business is high-volume phone-based (HVAC/plumbing/auto) AND google has 50+ reviews indicating call volume.
- automation: when there are repetitive intake / scheduling signals (appointment language, multi-step contact flows).
- seo_local: when google.found is false OR rating/review_count is materially below SMB norms in their category.
- review_management: when user_ratings_total < 25 or rating < 4.3.
- audit_only: when the business is already strong (presence_score > 75) and the cleanest fit is a paid audit.

Recommended package — exactly one of:
- discovery_audit: $1,500. Fits when presence_score 65+, gaps are diagnostic in nature, business should buy a roadmap before committing to build.
- website_ai_bundle: $2,000. Fits the median case: presence_score 35-70, clear website + AI gaps.
- founding_partnership: $5,000. Fits when presence_score < 40 OR multiple critical gaps OR business signals high revenue (lots of reviews / hours / scale).

report_md: a 400-700 word client-facing markdown report. Sections:
1. Headline summary (1-2 sentences, plain language, no jargon).
2. What we found (3-5 bullets, evidence-backed).
3. What it's costing you (translate gaps into business impact, dollars where defensible).
4. What TSD would do about it (the recommended package and why, in their voice).
5. Your next step (one CTA: book the discovery call / phase I audit).

Tone: confident, specific, never hedging. Use "you/your" addressing the business owner. No "I" or "we'd love to". No emojis.

Output: A single JSON object, no markdown fences:
{
  "scores": { ... matching schema ... },
  "report_md": "..."
}`;

interface SynthesizeOptions {
  raw: RawAuditData;
}

export async function synthesizeAudit({
  raw,
}: SynthesizeOptions): Promise<SynthesisOutput> {
  const e = env();
  const message = await anthropic().messages.create({
    model: e.ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `<raw_data>\n${JSON.stringify(raw, null, 2)}\n</raw_data>\n\nReturn the JSON now.`,
          },
        ],
      },
    ],
  });

  const text = message.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { type: "text"; text: string }).text)
    .join("");

  const parsed = parseJson(text);
  const scores = AuditScoresSchema.parse(parsed.scores);
  const report_md = String(parsed.report_md ?? "");
  if (report_md.length < 200) {
    throw new Error("Synthesis returned a report shorter than 200 chars.");
  }
  return { scores, report_md };
}

function parseJson(text: string): { scores: unknown; report_md: unknown } {
  // The model occasionally wraps JSON in fences despite instructions.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const trimmed = candidate.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Could not parse synthesis output as JSON.");
  }
}
