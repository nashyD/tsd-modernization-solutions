// Owner routing at candidate-approve time. Pure and client-safe: the
// candidate card shows the suggestion, the approver can override, the server
// action falls back to the same rule when no override arrives.
//
// The rule (in precedence order):
//   1. concierge (document/catalog-heavy) -> bishop: that lane is the remote
//      Concierge motion regardless of geography.
//   2. corridor storefront -> grant: his drivable knock territory — the
//      leadscout town list plus the Steele Creek / west-Charlotte seam.
//   3. reachable remotely (phone or email on record) -> bishop.
//   4. otherwise unassigned; Nash routes by hand.

export type OwnerSuggestion = "grant" | "bishop" | "unassigned";

export type RoutableCandidate = {
  city: string | null;
  lng: number | null;
  primary_product: string | null;
  phone: string | null;
  email?: string | null;
};

// Exactly the grant-leadscout territory (Gaston County towns).
export const CORRIDOR_TOWNS = new Set([
  "gastonia",
  "dallas",
  "belmont",
  "mount holly",
  "bessemer city",
  "cherryville",
  "stanley",
  "lowell",
  "cramerton",
  "mcadenville",
]);

// Steele Creek / west Charlotte sit west of roughly -80.85; east of that is
// out of comfortable knock range.
const WEST_CHARLOTTE_LNG = -80.85;

function normalizeCity(city: string): string {
  return city.trim().toLowerCase().replace(/^mt\.?\s+/, "mount ");
}

export function inCorridor(city: string | null, lng: number | null): boolean {
  if (!city) return false;
  const c = normalizeCity(city);
  if (CORRIDOR_TOWNS.has(c)) return true;
  if (c === "charlotte" && lng !== null && lng <= WEST_CHARLOTTE_LNG) return true;
  return false;
}

export function suggestOwner(c: RoutableCandidate): OwnerSuggestion {
  if (c.primary_product === "concierge") return "bishop";
  if (inCorridor(c.city, c.lng)) return "grant";
  if (c.phone || c.email) return "bishop";
  return "unassigned";
}
