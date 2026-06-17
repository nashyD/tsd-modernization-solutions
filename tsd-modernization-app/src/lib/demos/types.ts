// Types for the public per-business AI Concierge demos (/demos/[slug]).
//
// Each prospect demo is a grounded retrieval-augmented assistant that answers
// ONLY from that business's own corpus. The same shape powers both the live
// Claude path and the keyless offline fallback, so a demo never 500s in front
// of a prospect.

export type DemoLang = "en" | "es";

export type DocKind = "page" | "policy" | "service" | "faq" | "menu" | "product";

/** One unit of a business's knowledge. Plain, factual, customer-facing. */
export interface SeedDoc {
  id: string; // "<slug>:<topic>", e.g. "stowe-dental:hours"
  kind: DocKind;
  title: string;
  body: string;
  sourceLabel: string; // shown on the citation, e.g. "Stowe Dental — Services"
  price?: string;
}

export interface RetrievedDoc extends SeedDoc {
  score: number;
}

/** Everything needed to render and run one business's concierge. */
export interface DemoBusiness {
  slug: string;
  company: string;
  industry: string; // short label, e.g. "Family Dentistry"
  town: string;
  county: "Gaston" | "Mecklenburg";
  domain: string; // their real site host (no protocol), or "none"
  phone?: string;
  address?: string;
  accent: string; // hex used for the avatar + accents on the page
  glyph: string; // single letter for the avatar mark
  greeting: Record<DemoLang, string>;
  starterChips: Record<DemoLang, string[]>;
  persona: string; // base persona; the model replies in the visitor's language
  /** The web/answer gap this concierge closes — owner-safe copy for the page. */
  gap: string;
  /** Neutral one-liner shown on the public gallery card. */
  tagline: string;
  docs: SeedDoc[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Citation {
  id: string;
  title: string;
  sourceLabel: string;
  kind: string;
  price: string | null;
}

export interface RetrievalChunk {
  id: string;
  title: string;
  sourceLabel: string;
  kind: string;
  score: number;
  snippet: string;
  cited: boolean;
}

export interface ChatResponse {
  reply: string;
  citations: Citation[];
  suggestFitCall: boolean;
  retrieval: {
    query: string;
    method: string;
    model: string;
    chunks: RetrievalChunk[];
    timings: { retrieveMs: number; generateMs: number };
    offline: boolean;
  };
}
