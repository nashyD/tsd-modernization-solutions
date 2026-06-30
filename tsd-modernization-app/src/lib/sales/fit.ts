// Fit score (0-100) display helpers. The numeric score is computed and stored on
// prospects.fit_score (see supabase/backfill-fit-score.sql): higher = more
// valuable + winnable. These map a score to a band for labels/colors. Bishop's
// /sales/practice queue works the LOWEST band first to practice cold calls.

export type FitBand = "practice" | "warm" | "strong" | "hot" | "unscored";

export function fitBand(score: number | null | undefined): FitBand {
  if (score == null) return "unscored";
  if (score < 25) return "practice";
  if (score < 45) return "warm";
  if (score < 65) return "strong";
  return "hot";
}

export const FIT_BAND_LABEL: Record<FitBand, string> = {
  practice: "Practice",
  warm: "Warm",
  strong: "Strong",
  hot: "Hot",
  unscored: "Unscored",
};

// Badge tones available in the design system.
export const FIT_BAND_TONE: Record<
  FitBand,
  "neutral" | "amber" | "blue" | "emerald"
> = {
  practice: "neutral",
  warm: "amber",
  strong: "blue",
  hot: "emerald",
  unscored: "neutral",
};

/** Short "Practice · 18" style label for a badge. */
export function fitLabel(score: number | null | undefined): string {
  const band = fitBand(score);
  if (band === "unscored") return "Unscored";
  return `${FIT_BAND_LABEL[band]} · ${Math.round(score as number)}`;
}
