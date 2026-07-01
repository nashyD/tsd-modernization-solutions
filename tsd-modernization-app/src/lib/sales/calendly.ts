import "server-only";

// Fit-call booking link per prospect owner. Fit calls are Nash-led today
// ("Grab a time with Nash" + the cost-cut audit), so the default for every
// owner is Nash's event with a utm_source tag for attribution; set
// CALENDLY_URL_GRANT / CALENDLY_URL_BISHOP / CALENDLY_URL_NASH to flip any
// rep to their own calendar with zero code change.
const DEFAULT_URL = "https://calendly.com/nashdavis-tsd-ventures/30min";

export function calendlyUrlFor(owner: string | null | undefined): string {
  const byOwner: Record<string, string | undefined> = {
    grant: process.env.CALENDLY_URL_GRANT,
    bishop: process.env.CALENDLY_URL_BISHOP,
    nash: process.env.CALENDLY_URL_NASH,
  };
  const key = owner ?? "";
  const explicit = byOwner[key];
  if (explicit) return explicit;
  const base = process.env.CALENDLY_URL_NASH || DEFAULT_URL;
  const sep = base.includes("?") ? "&" : "?";
  return key && key !== "unassigned"
    ? `${base}${sep}utm_source=${encodeURIComponent(key)}`
    : base;
}
