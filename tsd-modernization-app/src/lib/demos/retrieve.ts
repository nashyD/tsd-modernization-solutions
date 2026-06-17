import type { DemoBusiness, RetrievedDoc } from "./types";

// Lightweight, dependency-free retrieval for the concierge demos: term-overlap
// scoring over each doc's title (weighted 2x) + body. No embeddings, no vector
// DB — the corpora are small (15-20 docs each) so keyword overlap is plenty to
// surface the right facts, and it runs anywhere with zero setup.

const STOP = new Set([
  "the", "a", "an", "is", "are", "do", "you", "i", "my", "of", "for", "to",
  "and", "or", "what", "how", "much", "on", "in", "with", "your", "me", "we",
  "can", "it", "this", "that", "at", "be", "have", "has", "does", "did", "any",
  "about", "please", "need", "so", "if", "when", "where", "there", "here",
  "get", "got", "would", "could", "should", "will", "am", "was", "were",
]);

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).filter(
    (t) => t.length > 1 && !STOP.has(t),
  );
}

export interface RetrieveResult {
  docs: RetrievedDoc[];
  method: string;
}

export function retrieve(
  business: DemoBusiness,
  query: string,
  k = 6,
): RetrieveResult {
  const docs = business.docs;
  const q = tokenize(query);
  if (!q.length) {
    return {
      docs: docs.slice(0, k).map((d) => ({ ...d, score: 0 })),
      method: "keyword",
    };
  }
  const qset = new Set(q);
  const scored: RetrievedDoc[] = docs.map((d) => {
    let hits = 0;
    for (const t of tokenize(d.title)) if (qset.has(t)) hits += 2;
    for (const t of tokenize(d.body)) if (qset.has(t)) hits += 1;
    const denom = q.length * 2 + 4;
    return { ...d, score: Math.min(0.99, hits / denom) };
  });
  scored.sort((a, b) => b.score - a.score);
  return { docs: scored.slice(0, k), method: "keyword" };
}
