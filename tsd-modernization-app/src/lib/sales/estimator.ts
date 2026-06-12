/**
 * Pitch-page pricing estimator. PURE — no IO.
 *
 * Ported verbatim from the marketing site's PricingEstimator.jsx so the public
 * /pricing page and the sales pitch page agree to the dollar. If you tune
 * numbers, change them in BOTH places (or we later extract a shared package).
 *
 * ⚠️ PLACEHOLDER NUMBERS pending Nash's sign-off — same caveat as the marketing
 * estimator. Output is an estimate range, never a quote.
 */

export interface SizeTier {
  id: string;
  label: string;
  detail: string;
  mult: number;
  pkg: string;
}

export interface ProductDef {
  id: string;
  label: string;
  detail: string;
  low: number;
  high: number;
  ai: boolean;
}

export const SIZES: SizeTier[] = [
  { id: "solo", label: "Just me", detail: "1–2 people", mult: 0.8, pkg: "Starter Modernization" },
  { id: "small", label: "Small team", detail: "3–10 people", mult: 1.0, pkg: "Core Modernization" },
  { id: "established", label: "Established", detail: "11–30 people", mult: 1.3, pkg: "Full Modernization" },
  { id: "larger", label: "Larger", detail: "30+ people", mult: 2.7, pkg: "Custom Engagement" },
];

export const PRODUCTS: ProductDef[] = [
  { id: "website", label: "A new website", detail: "Custom, fast, source code yours", low: 2900, high: 4000, ai: false },
  { id: "frontDesk", label: "TSD Front Desk", detail: "AI receptionist — phone + chat, books work", low: 1200, high: 1600, ai: true },
  { id: "concierge", label: "TSD Concierge", detail: "Site assistant — answers from your content + catalog", low: 4100, high: 5800, ai: true },
  { id: "booking", label: "TSD Booking Bridge", detail: "Booking + workflow automation", low: 1300, high: 1900, ai: true },
  { id: "leadEngine", label: "TSD Lead Engine", detail: "Landing funnel + a lead dashboard your team works", low: 2400, high: 3400, ai: false },
  { id: "reviews", label: "Reviews & reputation", detail: "Auto-requests reviews, monitors Google + Yelp", low: 900, high: 1200, ai: true },
  { id: "outreach", label: "Lead follow-up", detail: "Re-engages old leads, no-shows, stale quotes", low: 1600, high: 2200, ai: true },
  { id: "seo", label: "Local SEO", detail: "Google Profile + local search visibility", low: 1000, high: 1500, ai: false },
];

/** Monthly Managed AI, by how many AI products are running. */
export const MANAGED: Record<number, number> = {
  0: 0,
  1: 73,
  2: 147,
  3: 222,
  4: 297,
  5: 373,
};

export const DEFAULT_SIZE = "small";

const round100 = (n: number): number => Math.round(n / 100) * 100;

export interface EstimateResult {
  sizeId: string;
  pkg: string;
  serviceIds: string[];
  low: number;
  high: number;
  isLarger: boolean;
  aiCount: number;
  managedMonthly: number;
}

/**
 * Compute the estimate for a given team size + selected service ids.
 * Unknown ids are ignored. An unknown size falls back to the default tier.
 */
export function estimate(sizeId: string, serviceIds: string[]): EstimateResult {
  const sz = SIZES.find((s) => s.id === sizeId) ?? SIZES.find((s) => s.id === DEFAULT_SIZE)!;
  const chosen = PRODUCTS.filter((p) => serviceIds.includes(p.id));
  const low = round100(chosen.reduce((a, p) => a + p.low, 0) * sz.mult);
  const high = round100(chosen.reduce((a, p) => a + p.high, 0) * sz.mult);
  const aiCount = Math.min(chosen.filter((p) => p.ai).length, 5);
  return {
    sizeId: sz.id,
    pkg: sz.pkg,
    serviceIds: chosen.map((p) => p.id),
    low,
    high,
    isLarger: sz.id === "larger",
    aiCount,
    managedMonthly: MANAGED[aiCount] ?? 0,
  };
}

/**
 * The optional "lock it in" deposit = depositPct% of the LOW estimate,
 * rounded to whole dollars. Returns 0 when nothing is selected. This is the
 * single source of truth the checkout route uses — the browser never sends a
 * price, the server recomputes from the stored selection.
 */
export function depositFromSelection(
  sizeId: string,
  serviceIds: string[],
  depositPct: number,
): number {
  const { low } = estimate(sizeId, serviceIds);
  const pct = Math.min(100, Math.max(0, Number(depositPct) || 0));
  return Math.round((low * pct) / 100);
}

export function fmtUsd(n: number): string {
  return "$" + Math.round(Number(n) || 0).toLocaleString("en-US");
}
