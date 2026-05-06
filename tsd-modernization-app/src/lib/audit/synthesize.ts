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

Input: a raw_data JSON blob with two parts:
- scrape: data extracted from fetching the business's website (title, meta, structural signals, CTA presence, link counts).
- places: data from Google Places (rating, review count, photos, hours).

You will return your findings by calling the submit_audit tool. Always call it exactly once.

Scoring rubric (0-100, higher is better):
- website: signals from scrape — title/description present, mobile viewport, schema markup, OG tags, favicon, image alt %, internal nav, sitemap, https, CTAs.
- google: places.found, rating, user_ratings_total relative to industry norms (50+ reviews is solid for an SMB).
- reviews: rating quality (4.5+ great, 4.0-4.4 ok, <4.0 needs work), volume.
- trust: HTTPS, contact info on page (phone/email), schema, accurate Google listing.
- conversion: clear CTA, contact link, phone/email visible.
- presence_score: weighted average (website 0.25, google 0.25, reviews 0.20, trust 0.15, conversion 0.15).

Gaps: produce 5-10 specific, evidence-backed weaknesses. Each must cite a concrete observation from raw_data, not generic advice. Severity values: critical (loses customers daily), high (lost search traffic / trust), medium (polish), low (nice-to-have).

TSD service mapping. Pick at most 5 services that directly address the top gaps:
- website_rebuild: when website signals are critically weak.
- ai_chatbot: when site has weak CTA / no after-hours capture path AND business has phone present.
- ai_receptionist: when business is high-volume phone-based (HVAC/plumbing/auto) AND google has 50+ reviews.
- automation: when there are repetitive intake / scheduling signals.
- seo_local: when google.found is false OR rating/review_count is materially below SMB norms.
- review_management: when user_ratings_total < 25 or rating < 4.3.
- audit_only: when business is already strong (presence_score > 75).

Recommended package — exactly one of:
- discovery_audit ($1,500): presence_score 65+, gaps are diagnostic in nature.
- website_ai_bundle ($2,000): the median case, presence_score 35-70, clear website + AI gaps.
- founding_partnership ($5,000): presence_score < 40 OR multiple critical gaps OR high-revenue signals.

report_md: 400-700 word client-facing markdown report with these sections:
1. Headline summary (1-2 sentences, plain language).
2. What we found (3-5 bullets, evidence-backed).
3. What it's costing you (translate gaps into business impact, dollars where defensible).
4. What TSD would do about it (recommended package and why).
5. Your next step (one CTA: book the discovery call).

Tone: confident, specific, never hedging. Use "you/your". No "I" or "we'd love to". No emojis.`;

const SUBMIT_AUDIT_TOOL: Anthropic.Tool = {
  name: "submit_audit",
  description:
    "Submit the structured audit findings for a TSD prospect. Call exactly once.",
  input_schema: {
    type: "object",
    properties: {
      presence_score: { type: "integer", minimum: 0, maximum: 100 },
      pillar_scores: {
        type: "object",
        properties: {
          website: { type: "integer", minimum: 0, maximum: 100 },
          google: { type: "integer", minimum: 0, maximum: 100 },
          reviews: { type: "integer", minimum: 0, maximum: 100 },
          trust: { type: "integer", minimum: 0, maximum: 100 },
          conversion: { type: "integer", minimum: 0, maximum: 100 },
        },
        required: ["website", "google", "reviews", "trust", "conversion"],
        additionalProperties: false,
      },
      gaps: {
        type: "array",
        minItems: 3,
        maxItems: 12,
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            severity: {
              type: "string",
              enum: ["critical", "high", "medium", "low"],
            },
            evidence: { type: "string" },
            impact: { type: "string" },
          },
          required: ["title", "severity", "evidence", "impact"],
          additionalProperties: false,
        },
      },
      tsd_services: {
        type: "array",
        minItems: 1,
        maxItems: 5,
        items: {
          type: "object",
          properties: {
            service: {
              type: "string",
              enum: [
                "website_rebuild",
                "ai_chatbot",
                "ai_receptionist",
                "automation",
                "seo_local",
                "review_management",
                "audit_only",
              ],
            },
            rationale: { type: "string" },
          },
          required: ["service", "rationale"],
          additionalProperties: false,
        },
      },
      recommended_package: {
        type: "string",
        enum: ["discovery_audit", "website_ai_bundle", "founding_partnership"],
      },
      one_line_summary: { type: "string", minLength: 20, maxLength: 280 },
      report_md: { type: "string", minLength: 400 },
    },
    required: [
      "presence_score",
      "pillar_scores",
      "gaps",
      "tsd_services",
      "recommended_package",
      "one_line_summary",
      "report_md",
    ],
    additionalProperties: false,
  },
};

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
    tools: [SUBMIT_AUDIT_TOOL],
    tool_choice: { type: "tool", name: "submit_audit" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `<raw_data>\n${JSON.stringify(raw, null, 2)}\n</raw_data>\n\nAnalyze and call submit_audit with the findings.`,
          },
        ],
      },
    ],
  });

  const toolUse = message.content.find(
    (c): c is Anthropic.ToolUseBlock => c.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error(
      "Synthesis: model did not call submit_audit. Stop reason: " +
        message.stop_reason
    );
  }
  const input = toolUse.input as Record<string, unknown>;

  const scoresResult = AuditScoresSchema.safeParse({
    presence_score: input.presence_score,
    pillar_scores: input.pillar_scores,
    gaps: input.gaps,
    tsd_services: input.tsd_services,
    recommended_package: input.recommended_package,
    one_line_summary: input.one_line_summary,
  });
  if (!scoresResult.success) {
    console.error("[synthesize] tool input failed schema", {
      issues: scoresResult.error.issues,
      input_keys: Object.keys(input),
    });
    throw new Error(
      `Synthesis tool input failed schema: ${JSON.stringify(scoresResult.error.issues)}`
    );
  }
  const report_md = String(input.report_md ?? "");
  if (report_md.length < 200) {
    throw new Error("Synthesis returned a report shorter than 200 chars.");
  }
  return { scores: scoresResult.data, report_md };
}
