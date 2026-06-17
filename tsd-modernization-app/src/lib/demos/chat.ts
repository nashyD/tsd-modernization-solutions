import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type {
  ChatMessage,
  ChatResponse,
  Citation,
  DemoBusiness,
  DemoLang,
  RetrievalChunk,
  RetrievedDoc,
  SeedDoc,
} from "./types";
import { retrieve } from "./retrieve";
import { buildSystemPrompt } from "./knowledge";

// The concierge reads its key directly (not through the strict env() validator)
// so a public demo page renders even if some unrelated env var is missing — it
// just falls back to a grounded, templated "offline" answer. In production the
// app always has ANTHROPIC_API_KEY set, so visitors get real Claude replies.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

let client: Anthropic | null = null;
function anthropic(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (client) return client;
  client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const respondTool: Anthropic.Tool = {
  name: "respond",
  description:
    "Return your reply, the ids of any source documents you cited, and whether to offer a TSD fit call.",
  input_schema: {
    type: "object",
    properties: {
      reply: {
        type: "string",
        description: "Your short, helpful reply, in the requested language.",
      },
      citationIds: {
        type: "array",
        items: { type: "string" },
        description:
          "Exact ids of the source documents you used; empty array if none.",
      },
      suggestFitCall: {
        type: "boolean",
        description:
          "True only if the visitor shows interest in getting an assistant like this for their own business or asks about TSD.",
      },
    },
    required: ["reply", "citationIds", "suggestFitCall"],
  },
};

function snippet(s: string, n = 160): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "…" : t;
}

function toCitations(ids: string[], docs: SeedDoc[]): Citation[] {
  return ids
    .map((id) => docs.find((d) => d.id === id))
    .filter((d): d is RetrievedDoc => Boolean(d))
    .map((d) => ({
      id: d.id,
      title: d.title,
      sourceLabel: d.sourceLabel,
      kind: d.kind,
      price: d.price ?? null,
    }));
}

function chunksFrom(docs: RetrievedDoc[], cited: Set<string>): RetrievalChunk[] {
  return docs.map((d) => ({
    id: d.id,
    title: d.title,
    sourceLabel: d.sourceLabel,
    kind: d.kind,
    score: d.score,
    snippet: snippet(d.body),
    cited: cited.has(d.id),
  }));
}

export async function ask(
  business: DemoBusiness,
  messages: ChatMessage[],
  lang: DemoLang,
): Promise<ChatResponse> {
  const last = messages[messages.length - 1];
  const query = typeof last?.content === "string" ? last.content.trim() : "";

  // Corpora are small (≤ ~24 short docs), so we hand the model the WHOLE
  // knowledge base each turn in a stable order — the system prompt stays
  // identical across turns (prompt-cache friendly) and answers stay reliable
  // for any phrasing or language, not just keyword matches. Keyword ranking is
  // used only to drive the "how I found this" panel and the offline fallback.
  const t0 = Date.now();
  const { docs: ranked, method } = retrieve(business, query, business.docs.length);
  const retrieveMs = Date.now() - t0;

  const a = anthropic();
  if (!a) return offlineAnswer(business, query, ranked, method, retrieveMs);

  try {
    const system = buildSystemPrompt(business, business.docs, lang);
    const t1 = Date.now();
    const res = await a.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      tools: [respondTool],
      tool_choice: { type: "tool", name: "respond" },
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const generateMs = Date.now() - t1;

    const toolUse = res.content.find(
      (c): c is Anthropic.ToolUseBlock => c.type === "tool_use",
    );
    if (!toolUse) throw new Error("model did not return a structured response");
    const input = toolUse.input as {
      reply: string;
      citationIds: string[];
      suggestFitCall: boolean;
    };
    const ids = Array.isArray(input.citationIds) ? input.citationIds : [];
    const cited = new Set(ids);

    return {
      reply: input.reply,
      citations: toCitations(ids, business.docs),
      suggestFitCall: !!input.suggestFitCall,
      retrieval: {
        query,
        method,
        model: MODEL,
        chunks: panelChunks(ranked, cited),
        timings: { retrieveMs, generateMs },
        offline: false,
      },
    };
  } catch (err) {
    console.error("[demos/chat] generation failed, serving offline answer:", err);
    return offlineAnswer(business, query, ranked, method, retrieveMs);
  }
}

// The panel shows the most keyword-relevant docs (the visible RAG proof), plus
// any the model cited that fell outside the top slice — so every citation chip
// has a matching highlighted row.
function panelChunks(ranked: RetrievedDoc[], cited: Set<string>): RetrievalChunk[] {
  const top = ranked.slice(0, 6);
  const extra = ranked.filter((d) => cited.has(d.id) && !top.includes(d));
  return chunksFrom([...top, ...extra], cited);
}

// Grounded, templated reply used when there is no Anthropic key or the model
// call fails. Keeps the UI fully demoable and never throws in front of a guest.
function offlineAnswer(
  business: DemoBusiness,
  query: string,
  docs: RetrievedDoc[],
  method: string,
  retrieveMs: number,
): ChatResponse {
  // The corpus bodies are already written as direct, in-voice customer answers,
  // so the cleanest grounded fallback is simply the best-matching one verbatim.
  const top = docs[0];
  const reply = top
    ? snippet(top.body, 320)
    : `I don't see that in ${business.company}'s information yet — I'd be happy to pass your question to the team.`;
  const ids = top ? docs.slice(0, 2).map((d) => d.id) : [];
  const cited = new Set(ids);
  return {
    reply,
    citations: toCitations(ids, docs),
    suggestFitCall: false,
    retrieval: {
      query,
      method,
      model: "offline preview",
      chunks: panelChunks(docs, cited),
      timings: { retrieveMs, generateMs: 0 },
      offline: true,
    },
  };
}
