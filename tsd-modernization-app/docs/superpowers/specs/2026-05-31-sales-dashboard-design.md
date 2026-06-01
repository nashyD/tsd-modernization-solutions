# TSD Modernization — Sales & Pitch Dashboard (Grant's iPad)

**Date:** 2026-05-31
**Status:** Design approved, pending spec review
**Lives in:** tsd-modernization-app (the existing Next.js 16 app)

## 1. Purpose

A field sales tool Grant runs on an iPad. He walks into a reputation-rich local
specialist's shop, taps that prospect's card, and shows them:

1. The website TSD already built them (open full-screen + scan-to-phone QR),
2. A live demo of their AI receptionist (the existing Vapi VoiceWidget),
3. What each TSD service is worth to their business (per-service dollar estimates), and
4. A way to reserve the build with a deposit on the spot (Square hosted checkout).

The same showcase doubles as a shareable leave-behind the prospect can revisit,
and after they convert, as content in their logged-in client portal.

## 2. Why build it inside tsd-modernization-app (not standalone)

The app already contains nearly every dependency, so this is largely assembly, not
net-new infrastructure:

| Need | Already present |
|---|---|
| Live voice demo | src/app/app/voice/VoiceWidget.tsx (Vapi) |
| Per-service value estimates | Audit engine (Anthropic SDK) + audits table |
| Auth + magic links | Supabase SSR auth, /login, /auth/callback |
| Signed-client records | clients, client_users, view-as actions |
| Raw inbound leads | leads table (top of funnel, from /audit) |
| Package tiers | src/lib/packages.ts |
| Design system | PageHeader, Button, Input, EmptyState, theme tokens |

A standalone app (like detailing-inventory) would re-implement all of the above.

## 3. Lifecycle model (Approach B)

Three stages, each a distinct entity with one job:

    lead  --promote-->  prospect  --deposit paid-->  client
    (raw audit           (the sales                  (signed, delivery;
     capture, exists)     object, NEW)                exists)

A prospect and a client are genuinely different lifecycle objects, so a few fields
(business_url, vapi_assistant_id, package_tier) are intentionally copied forward on
conversion. Editing a prospect's demo must never mutate a live client's portal.

## 4. Data model

### New table: prospects
The spine. One row per company Grant is trying to land.

- Identity: id, business_name, business_url, contact_name, email, phone, source_lead_id (nullable FK to leads, set when promoted)
- Pitch assets: demo_site_url, vapi_assistant_id, outline_md, audit_id (nullable FK to audits)
- Pricing and deposit: deposit_target (numeric), max_discount_pct (smallint, the silent floor, never shown), package_tier
- Pipeline: status (new, pitched, won, lost), notes, created_at, updated_at
- Leave-behind: share_token (random, unguessable), share_enabled (bool)
- Conversion: converted_client_id (nullable FK to clients, set on deposit)

### New table: prospect_assets
Uploaded files (mockups, outline PDFs, screenshots) in Supabase Storage.
- id, prospect_id (FK), kind (image, pdf, other), storage_path, label, sort_order, created_at
- Storage: new private bucket prospect-assets.

### New table: prospect_estimates
Per-service value rows (one per service, renders as cards, independently editable and reorderable).
- id, prospect_id (FK), service_key (website, front_desk, concierge, booking_bridge), dollar_value (numeric), cadence (monthly default), rationale (text), sort_order

### New table: discount_codes
Global promo codes, Grant's silent lever.
- id, code (e.g. g5, g10), pct (smallint), active (bool), created_at

## 5. Routes & access: one showcase, three renderings

### A. Grant's pitch surface (login required: Grant / Nash)
- /sales: pipeline board. Stat tiles (New, Pitched, Won, all-time), prospect cards
  grouped by status. "+ New prospect" and "Promote from leads" (pulls raw /audit
  leads). Adapts the detailing-inventory /sales layout.
- /sales/[id]: the pitch view (see section 6). Full controls: edit, share, status,
  deposit with promo box.
- /sales/new, /sales/[id]/edit: create/edit prospect, upload assets, "Draft from
  audit" for estimates.
- /sales/codes: manage discount_codes.

### B. Public leave-behind (no login)
- /showcase/[token]: resolved by share_token via a service-role read route.
  Read-only render of the showcase: site, voice demo (capped, see section 7), value
  estimates, outline. Includes the promo-code box + "Pay deposit" button so a
  prospect can self-convert at the target price after Grant leaves. Excludes
  Edit/Share/status, audit internals, and anything revealing the floor.

### C. Signed-in portal (after conversion)
- The existing /app portal already shows package/progress/voice/etc. Once a deposit
  creates the client, the showcase content surfaces there too. No new portal work
  beyond linking.

## 6. The pitch view (/sales/[id]): layout

Single column, top-to-bottom narrative (mockup approved in brainstorming):

1. Header: business name, status pill, Share / Edit (pitch view only).
2. "The website we built you": preview, Open full site button, scan-to-phone QR.
   (Open-button-first because real sites often block iframe embedding via
   X-Frame-Options / CSP.)
3. "Your AI receptionist, live demo": the existing VoiceWidget, pointed at
   vapi_assistant_id.
4. "What each service is worth to you": the prospect_estimates cards (+$X/mo plus a
   one-line rationale each).
5. Deposit panel, "Ready to start? Reserve your build": deposit amount + a promo-code
   box (not a visible price slider) + Pay deposit with Square.
6. Outline / notes / uploaded assets below the fold.

### The discount-code mechanism (key design point)
Because the prospect sees this screen, the price lever is disguised as an ordinary
"Promo code (optional)" field, normal at any checkout, and it never reveals that
discounting is possible.
- Grant knows codes like g5 (5% off), g10 (10% off); the prospect does not.
- The per-prospect max_discount_pct is the silent floor. The server applies a code's
  pct only if it is <= that cap; a too-deep code returns a generic "invalid code."
  Nobody watching can distinguish a nonexistent code from one that exceeds the floor.
- Floor control: max_discount_pct is set by Nash and is NOT surfaced or editable in
  Grant's pitch view or the prospect edit form (it lives on a Nash-only field on the
  edit form, or a separate admin control). "Grant has full domain access" means full
  operational use of the sales tool; the floor is the one value reserved to Nash so it
  actually protects margin. (Flagged for Nash to confirm in section 13.)

## 7. Square deposit flow (hosted checkout)

Square is live (Nash registered using SSN under the single-member LLC; SS-4
resubmitted as a disregarded entity, IRS confirmation pending). Build against Square
sandbox behind an env flag; flip to production when ready.

1. "Pay deposit with Square" -> POST /api/square/checkout with { prospect_id, code? }.
2. Server is authoritative (trust boundary): load the prospect's deposit_target and
   max_discount_pct. If a code is present, look it up in discount_codes; apply its pct
   only if active and <= cap, else ignore and return "invalid code." Compute the final
   amount server-side; the browser never sends a price.
3. Server calls Square Checkout API -> returns hosted payment URL -> iPad presents it
   (tap-through or QR). No card data touches our app (PCI-safe).
4. Prospect pays on Square -> Square fires a webhook.
5. POST /api/square/webhook (verifies Square signature): record the payment, set
   prospect status = won, and auto-create the client (carry forward business_url ->
   website_url, vapi_assistant_id, package_tier; set converted_client_id). Optionally
   send a portal invite to email.

Security invariant: price, discount validity, and floor are never trusted from the
client. The amount is always recomputed server-side from the prospect's own
deposit_target + max_discount_pct. Page tampering cannot beat the floor.

## 8. Live voice demo on the public link: capped

The Vapi demo is callable from the public /showcase/[token] link (so prospects keep
selling themselves after Grant leaves), but guarded against runaway per-minute cost on
a forwarded link:
- Per-call time limit (e.g. ~3 min, final value TBD with Nash).
- Daily call cap per token (e.g. ~5/day, final value TBD with Nash).
- Enforced server-side via the route that vends the Vapi session for a token.
- Grant's logged-in pitch view is uncapped.

## 9. Access control & RLS

- /sales/*: authenticated; full capability (Grant has full domain access).
- /showcase/[token]: anonymous; served by a dedicated service-role route that filters
  strictly by share_token and returns only showcase-safe fields (never
  max_discount_pct, notes, or audit internals).
- /app/*: existing authenticated client portal.
- RLS: prospects, prospect_assets, prospect_estimates, discount_codes follow the app's
  existing pattern. Authenticated reads gated to admins via is_app_admin(); all writes
  go through server actions / route handlers using the service-role key. The public
  showcase reads through the token route only, so RLS stays closed to the
  anon/authenticated roles.

## 10. Estimate generation

"Draft from audit" calls the existing audit engine (Anthropic SDK + audits table) for
a prospect that has an audit_id, producing the four prospect_estimates rows
(dollar_value + rationale) for Nash to edit before Grant presents. If no audit exists,
fields are entered manually.

## 11. Out of scope (YAGNI)

- No separate mobile app: responsive web on the iPad (installable PWA optional later).
- No in-app card entry (Web Payments SDK): hosted checkout only for now.
- No multi-rep org chart / per-rep commission accounting in this build.
- No analytics dashboard beyond the pipeline stat tiles.
- No automated email sequences (a single optional portal invite on conversion is fine).

## 12. Reused vs. new

Reused: VoiceWidget, audit engine + audits, Supabase auth, clients / client_users,
leads, packages.ts, design-system components, proxy.ts session handling.

New: prospects / prospect_assets / prospect_estimates / discount_codes tables + RLS
migration; prospect-assets storage bucket; routes /sales, /sales/[id], /sales/new,
/sales/[id]/edit, /sales/codes, /showcase/[token]; API routes /api/square/checkout,
/api/square/webhook, and a token-scoped Vapi session route; Square SDK integration.

## 13. Open values to finalize during implementation

- Exact voice-demo caps (per-call minutes, per-token daily calls).
- Deposit default(s) and the discount-code set (g5/g10/...) + each prospect's max_discount_pct.
- Whether conversion auto-sends a portal invite or leaves it manual.
- CONFIRM: should the discount floor (max_discount_pct) be hidden/locked from Grant
  (Nash-only), or is Grant trusted to set it himself? Spec currently assumes Nash-only
  so the floor protects margin even though Grant otherwise has full access.
