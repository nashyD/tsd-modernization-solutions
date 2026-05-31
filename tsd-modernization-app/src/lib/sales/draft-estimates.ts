import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { env } from "@/lib/env";
import { SERVICE_KEYS } from "@/lib/sales/services";

const DraftSchema = z.object({
  estimates: z
    .array(
      z.object({
        service_key: z.enum(SERVICE_KEYS as unknown as [string, ...string[]]),
        dollar_value: z.number().min(0),
        rationale: z.string().min(3),
      }),
    )
    .min(1)
    .max(4),
});
export type DraftEstimates = z.infer<typeof DraftSchema>;

const TOOL: Anthropic.Tool = {
  name: "submit_estimates",
  description:
    "Submit per-service monthly dollar value estimates for a prospect. Call once.",
  input_schema: {
    type: "object",
    properties: {
      estimates: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          type: "object",
          properties: {
            service_key: { type: "string", enum: [...SERVICE_KEYS] },
            dollar_value: { type: "number", minimum: 0 },
            rationale: { type: "string" },
          },
          required: ["service_key", "dollar_value", "rationale"],
          additionalProperties: false,
        },
      },
    },
    required: ["estimates"],
    additionalProperties: false,
  },
};

const SYSTEM = `You estimate the monthly dollar value each TSD service would add to a specific small business, for a sales pitch. Services: website (custom website), front_desk (AI phone receptionist), concierge (on-site AI assistant), booking_bridge (online booking). Use the audit findings to ground each number in that business's reality (missed calls, weak site, review gaps, etc.). Return conservative, defensible monthly dollar figures and a one-sentence rationale tied to evidence. Call submit_estimates exactly once with up to 4 services (most relevant first).`;

export async function draftEstimatesFromAudit(
  auditJson: unknown,
): Promise<DraftEstimates> {
  const e = env();
  const client = new Anthropic({ apiKey: e.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: e.ANTHROPIC_MODEL,
    max_tokens: 1500,
    system: [{ type: "text", text: SYSTEM }],
    tools: [TOOL],
    tool_choice: { type: "tool", name: "submit_estimates" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `<audit>\n${JSON.stringify(auditJson, null, 2)}\n</audit>\n\nEstimate per-service monthly value and call submit_estimates.`,
          },
        ],
      },
    ],
  });
  const tool = msg.content.find(
    (c): c is Anthropic.ToolUseBlock => c.type === "tool_use",
  );
  if (!tool) throw new Error("draft: model did not call submit_estimates");
  return DraftSchema.parse(tool.input);
}
