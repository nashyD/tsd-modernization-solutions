import type { DemoBusiness } from "./types";
import { CORPORA } from "./corpus";

// Registry of every prospect concierge demo. Each entry is one business's full
// config + knowledge corpus, defined in src/lib/demos/corpus/<slug>.ts and
// collected in the corpus barrel. Reachable at /demos/<slug>.
const BY_SLUG: Map<string, DemoBusiness> = new Map(
  CORPORA.map((b) => [b.slug, b]),
);

export function getBusiness(slug: string): DemoBusiness | undefined {
  return BY_SLUG.get(slug);
}

export function listBusinesses(): DemoBusiness[] {
  return CORPORA;
}

export function allSlugs(): string[] {
  return CORPORA.map((b) => b.slug);
}
