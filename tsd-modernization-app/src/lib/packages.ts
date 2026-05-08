/**
 * Pricing source of truth for the portal. Mirrors the marketing site's
 * public pricing page at tsd-modernization.com/pricing.
 *
 * Refreshed 2026-05-08 against tsd-modernization/src/pages/Pricing.jsx and
 * BUSINESS_PLAN.md §6:
 * - Website + AI Build: $5,000, founding rate, no anchor strikethrough
 * - The Full Modernization: $10,000, founding rate, by application
 * - Discovery Audit: $1,500, stepping-stone only — not a public tier, but
 *   retained here so a client whose package_tier='discovery_audit' renders
 *   correctly in the portal.
 *
 * Per-tier scarcity counters were removed from the marketing site on
 * 2026-05-03; we keep that posture here. The cohort window (Aug 10) is the
 * scarcity signal, not per-tier spot counts.
 */
export const PACKAGE_TIERS = [
  "discovery_audit",
  "website_ai_bundle",
  "founding_partnership",
] as const;

export type PackageTier = (typeof PACKAGE_TIERS)[number];

export interface PackageDefinition {
  tier: PackageTier;
  name: string;
  price: string;
  /** Optional anchor / strikethrough price. Marketing page no longer shows
   *  anchors on public tiers (per 2026-05-03 PROJECT_LOG entry); leave
   *  unset unless that posture changes. */
  anchor?: string;
  tagline: string;
  included: string[];
  /** Short label shown beneath the price — e.g. "Founding rate" or
   *  "By application". Mirrors the marketing tier card's `range` field. */
  cap?: string;
  /** Plain-text guarantee shown on the audit report's recommended-package
   *  card. Mirrors the marketing card's `objection` field. */
  guarantee?: string;
}

export const PACKAGES: Record<PackageTier, PackageDefinition> = {
  discovery_audit: {
    tier: "discovery_audit",
    name: "Discovery Audit",
    price: "$1,500",
    tagline:
      "A 2-3 hour structured tech audit with a written modernization roadmap. Stepping-stone for buyers who want a paid scope-and-recommend before committing to a full build.",
    included: [
      "Live audit session with the founders",
      "Written modernization roadmap (PDF)",
      "Tooling and vendor recommendations",
      "Quick-win checklist you can run yourself",
    ],
    cap: "By request",
    guarantee:
      "Money-back if we can't surface $25K of opportunities for your business.",
  },
  website_ai_bundle: {
    tier: "website_ai_bundle",
    name: "Website + AI Build",
    price: "$5,000",
    tagline:
      "A modern site that captures leads, shipped in 14 days. You own the code.",
    included: [
      "Custom responsive website",
      "AI chatbot or workflow automation",
      "On-page SEO + analytics wiring",
      "Written + video documentation",
      "Founder on call for fixes through August 31, 2026",
      "Full source code ownership",
    ],
    cap: "Founding rate",
    guarantee:
      "Live in 14 days from contract signature or 25% back ($1,250). 3 AI-captured leads in the first 30 days post-launch or we refund the AI portion and rebuild it free.",
  },
  founding_partnership: {
    tier: "founding_partnership",
    name: "The Full Modernization",
    price: "$10,000",
    tagline:
      "An outcome engagement. We work the system with you until the leads number hits — whatever it takes.",
    included: [
      "Discovery audit + written modernization roadmap",
      "Custom website + AI receptionist (call + chat capture)",
      "One operational integration (ServiceTitan, QuickBooks, Jobber, or your stack)",
      "Custom AI re-training on your real call data, starts after week 1",
      "Weekly written status report — what shipped, what's next, what we need from you",
      "Monthly 1-hour business review with your TSD partner + 24-hour written recap",
      "Full source code ownership",
    ],
    cap: "Founding rate · By application",
    guarantee:
      "15+ qualified leads in your pipeline before August 31, 2026, or $5,000 back and the AI integration rebuilt free. Cancel any time after handoff.",
  },
};

export function packageByTier(tier: string): PackageDefinition | null {
  if ((PACKAGE_TIERS as readonly string[]).includes(tier)) {
    return PACKAGES[tier as PackageTier];
  }
  return null;
}
