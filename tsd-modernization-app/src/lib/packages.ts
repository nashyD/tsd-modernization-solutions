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
  anchor: string;
  tagline: string;
  included: string[];
  cap?: string;
}

export const PACKAGES: Record<PackageTier, PackageDefinition> = {
  discovery_audit: {
    tier: "discovery_audit",
    name: "Phase I — Discovery Audit",
    price: "$1,500",
    anchor: "$3,000",
    tagline:
      "A 2-3 hour structured tech audit with a written modernization roadmap. Money-back if we can't find $25K of opportunities.",
    included: [
      "Live audit session with the founders",
      "Written modernization roadmap (PDF)",
      "Tooling and vendor recommendations",
      "Quick-win checklist you can run yourself",
    ],
  },
  website_ai_bundle: {
    tier: "website_ai_bundle",
    name: "Phase II — Website + AI Bundle",
    price: "$2,000",
    anchor: "$4,000",
    tagline:
      "Custom website, AI chatbot or receptionist, SEO setup, source-code ownership, and founder on-call through Aug 31.",
    included: [
      "Custom website (you own the source)",
      "AI chatbot or AI receptionist (one)",
      "SEO + analytics wired in",
      "Founder on-call support through Aug 31, 2026",
      "AI receptionist setup ($497 value) bundled",
    ],
    cap: "10 spots — Founding Cohort",
  },
  founding_partnership: {
    tier: "founding_partnership",
    name: "Founding Partnership",
    price: "$5,000",
    anchor: "$10,000",
    tagline:
      "Phase I + Phase II + AI receptionist + 4 months of operations support. Bishop named as your ops contact.",
    included: [
      "Everything in Phase I and Phase II",
      "AI receptionist (production)",
      "4 months ops support",
      "Named ops contact",
      "Priority on every TSD service",
    ],
    cap: "3 spots — Founding Cohort",
  },
};

export function packageByTier(tier: string): PackageDefinition | null {
  if ((PACKAGE_TIERS as readonly string[]).includes(tier)) {
    return PACKAGES[tier as PackageTier];
  }
  return null;
}
