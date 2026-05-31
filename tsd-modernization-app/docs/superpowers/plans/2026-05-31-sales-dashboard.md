# Sales & Pitch Dashboard — Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax. This repo has **no test framework**; we add `vitest` only for the security-critical pricing/floor module (Task 4). Everything else is verified with `npm run typecheck`, `npm run lint`, `npm run build`, and manual checks.

**Goal:** A field sales tool on `/sales` (admin-only, iPad-first) where Nash loads per-prospect demo work, Grant pitches it (live site, live AI receptionist, per-service value estimates) and takes a Square deposit on the spot; the same showcase is a public tokenized leave-behind that can self-convert, and a paid deposit auto-creates the client.

**Architecture:** New routes + server actions inside the existing `tsd-modernization-app` (Next.js 16, App Router). New Supabase tables (`prospects`, `prospect_assets`, `prospect_estimates`, `discount_codes`, `prospect_deposits`, `showcase_voice_calls`) with RLS mirroring the existing pattern (admin reads via `is_app_admin()`, all writes through service-role server code). Square via documented REST API behind an env-flagged adapter; price/discount/floor computed **server-side only**.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase (`@supabase/ssr` + service-role), Tailwind v4, Zod, `@vapi-ai/web` (existing `VoiceWidget`), Anthropic SDK (existing audit synth), Square REST, Vitest (new, logic-only).

**Repo paths:**
- App root: `tsd-modernization-app/` (all paths below are relative to it unless noted).
- Git root: one level up (`…/Modernization Solutions Site/tsd-modernization`). Run `git` with `-C "$(git rev-parse --show-toplevel)"` or from the app dir (git discovers the root).
- Migrations: `supabase/migrations/` (next numbers: `0003`, `0004`).
- Path alias: `@/*` → `./src/*`.

**Key conventions to follow (verified in existing code):**
- Admin server actions: `"use server"` → `await requireRole("admin")` → Zod parse `FormData` → `supabaseAdmin()` → mutate → `revalidatePath(...)`. (See `src/app/admin/clients/actions.ts`.)
- Service-role client: `supabaseAdmin()` from `@/lib/supabase/admin` (bypasses RLS; only after an admin gate or internal-secret header).
- User-scoped client: `supabaseServer()` from `@/lib/supabase/server`.
- Env access: `env()` from `@/lib/env` (Zod-validated; add new vars there).
- Internal fire-and-forget routes: gate on `x-internal-secret` header === `env().INTERNAL_API_SECRET` (see `src/app/api/audit/run/route.ts`).
- UI: `PageHeader`, `Button`/`LinkButton`, `Input`/`Label`/`Select`/`Textarea`, `Badge`, `EmptyState`, `BackLink`; theme CSS vars (`var(--surface)`, `var(--accent)`, etc.). `export const dynamic = "force-dynamic"` on data pages.
- Anthropic structured output: tool-use with `tool_choice: { type: "tool", name }` + Zod validation (see `src/lib/audit/synthesize.ts`).

---

## Task 1: Branch + dependencies + env scaffolding

**Files:**
- Modify: `package.json` (add `vitest`, add `test` script)
- Create: `vitest.config.ts`
- Modify: `src/lib/env.ts` (add Square + showcase vars, all optional)
- Modify: `.env.example` (document new vars)

- [ ] **Step 1: Branch from main**

```bash
cd "/Users/nashdavis/Documents/TSD/TSD Modernization Solution/Modernization Solutions Site/tsd-modernization"
git checkout main && git pull --ff-only
git checkout -b sales-dashboard
```

- [ ] **Step 2: Add vitest (logic tests only)**

Run (from app dir):
```bash
cd tsd-modernization-app
npm install -D vitest@^2
```

- [ ] **Step 3: Add test script to `package.json`**

In `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
  resolve: { alias: { "@": resolve(__dirname, "./src") } },
});
```

- [ ] **Step 5: Extend `src/lib/env.ts`**

Add these keys to `serverSchema` (all optional so dev/build works before Square is wired):
```ts
  // Square (deposits). Sandbox until go-live; flip SQUARE_ENV to "production".
  SQUARE_ACCESS_TOKEN: z.string().min(1).optional(),
  SQUARE_LOCATION_ID: z.string().min(1).optional(),
  SQUARE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  SQUARE_WEBHOOK_SIGNATURE_KEY: z.string().min(1).optional(),
```

- [ ] **Step 6: Document in `.env.example`**

Append:
```
# Square (sales-dashboard deposits). Dashboard: developer.squareup.com > your app.
# Use sandbox credentials until go-live, then set SQUARE_ENV=production and swap the token.
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
SQUARE_ENV=sandbox
# Webhook signature key from the Square webhook subscription (Notifications > Webhooks).
SQUARE_WEBHOOK_SIGNATURE_KEY=
```

- [ ] **Step 7: Verify**

Run: `npm run typecheck`
Expected: PASS (no usages yet; env stays valid because new keys are optional).

- [ ] **Step 8: Commit**

```bash
git add tsd-modernization-app/package.json tsd-modernization-app/package-lock.json tsd-modernization-app/vitest.config.ts tsd-modernization-app/src/lib/env.ts tsd-modernization-app/.env.example
git commit -m "chore(sales): add vitest + Square/showcase env scaffolding"
```

---

## Task 2: Database migration — tables

**Files:**
- Create: `supabase/migrations/0003_prospects.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Sales & pitch dashboard. Prospect = the sales object between a raw `lead`
-- (audit capture) and a signed `client`. lead --promote--> prospect --deposit--> client.
create extension if not exists "pgcrypto";

create table public.prospects (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  business_url text not null,
  contact_name text,
  email text,
  phone text,
  source_lead_id uuid references public.leads on delete set null,
  demo_site_url text,
  vapi_assistant_id text,
  outline_md text,
  audit_id uuid references public.audits on delete set null,
  deposit_target numeric(10,2) not null default 0,
  max_discount_pct smallint not null default 0 check (max_discount_pct between 0 and 100),
  package_tier text,
  status text not null default 'new' check (status in ('new','pitched','won','lost')),
  notes text,
  share_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  share_enabled boolean not null default true,
  converted_client_id uuid references public.clients on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index prospects_status_idx on public.prospects(status);
create index prospects_share_token_idx on public.prospects(share_token);

create trigger prospects_set_updated_at
  before update on public.prospects
  for each row execute function public.set_updated_at();

create table public.prospect_assets (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects on delete cascade,
  kind text not null check (kind in ('image','pdf','other')),
  storage_path text not null,
  label text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index prospect_assets_prospect_idx on public.prospect_assets(prospect_id);

create table public.prospect_estimates (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects on delete cascade,
  service_key text not null check (service_key in ('website','front_desk','concierge','booking_bridge')),
  dollar_value numeric(10,2) not null default 0,
  cadence text not null default 'monthly' check (cadence in ('monthly','one_time')),
  rationale text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index prospect_estimates_prospect_idx on public.prospect_estimates(prospect_id);

create table public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  pct smallint not null check (pct between 0 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tracks each checkout attempt so the Square webhook can match an order back to a
-- prospect and stay idempotent. "record the payment" in the spec lives here.
create table public.prospect_deposits (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects on delete cascade,
  amount numeric(10,2) not null,
  code text,
  square_payment_link_id text,
  square_order_id text,
  square_payment_id text,
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index prospect_deposits_prospect_idx on public.prospect_deposits(prospect_id);
create index prospect_deposits_order_idx on public.prospect_deposits(square_order_id);

create trigger prospect_deposits_set_updated_at
  before update on public.prospect_deposits
  for each row execute function public.set_updated_at();

-- Per-token daily cap for the public showcase voice demo (avoid runaway Vapi minutes).
create table public.showcase_voice_calls (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects on delete cascade,
  created_at timestamptz not null default now()
);
create index showcase_voice_calls_prospect_day_idx
  on public.showcase_voice_calls(prospect_id, created_at);

-- Seed the starter discount codes (Grant's silent lever). Adjust later in /sales/codes.
insert into public.discount_codes (code, pct, active) values
  ('g5', 5, true),
  ('g10', 10, true),
  ('g15', 15, true)
on conflict (code) do nothing;
```

- [ ] **Step 2: Apply the migration**

Open the Supabase SQL editor for the project (URL in env `NEXT_PUBLIC_SUPABASE_URL`) and paste/run the file, OR `supabase db push` if the CLI is linked. Confirm: `select count(*) from prospects;` returns 0 and `select code from discount_codes;` returns g5/g10/g15.

- [ ] **Step 3: Commit**

```bash
git add tsd-modernization-app/supabase/migrations/0003_prospects.sql
git commit -m "feat(sales): add prospects/estimates/assets/codes/deposits schema"
```

---

## Task 3: Database migration — RLS

**Files:**
- Create: `supabase/migrations/0004_prospects_rls.sql`

- [ ] **Step 1: Write RLS (mirrors `0002_rls.sql`)**

```sql
-- RLS for sales-dashboard tables. Authenticated reads gated to admins via
-- is_app_admin(); all writes go through service-role server code (no write policies).
-- The public showcase reads via a service-role token route, not the anon role.
alter table public.prospects enable row level security;
alter table public.prospect_assets enable row level security;
alter table public.prospect_estimates enable row level security;
alter table public.discount_codes enable row level security;
alter table public.prospect_deposits enable row level security;
alter table public.showcase_voice_calls enable row level security;

create policy prospects_select on public.prospects
  for select using (public.is_app_admin());
create policy prospect_assets_select on public.prospect_assets
  for select using (public.is_app_admin());
create policy prospect_estimates_select on public.prospect_estimates
  for select using (public.is_app_admin());
create policy discount_codes_select on public.discount_codes
  for select using (public.is_app_admin());
create policy prospect_deposits_select on public.prospect_deposits
  for select using (public.is_app_admin());
-- showcase_voice_calls: no authenticated select policy needed (service-role only).
```

- [ ] **Step 2: Create the private storage bucket**

In Supabase Dashboard → Storage → New bucket: name `prospect-assets`, **Public = off**. (Reads/writes happen through service-role server code, which bypasses bucket RLS.)

- [ ] **Step 3: Apply + commit**

Run the SQL in the editor, then:
```bash
git add tsd-modernization-app/supabase/migrations/0004_prospects_rls.sql
git commit -m "feat(sales): RLS for sales-dashboard tables"
```

---

## Task 4: Pricing + discount-floor module (TDD — the security core)

This is the one place money math lives, so it gets real tests. Pure functions, no IO.

**Files:**
- Create: `src/lib/sales/pricing.ts`
- Test: `src/lib/sales/pricing.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { resolveDepositAmount, centsFromDollars } from "./pricing";

describe("resolveDepositAmount", () => {
  const base = { targetDollars: 1500, maxDiscountPct: 10 };

  it("returns the target when no code is given", () => {
    const r = resolveDepositAmount({ ...base, code: null, codePct: null });
    expect(r.amountDollars).toBe(1500);
    expect(r.appliedPct).toBe(0);
    expect(r.codeAccepted).toBe(false);
  });

  it("applies a code within the floor", () => {
    const r = resolveDepositAmount({ ...base, code: "g10", codePct: 10 });
    expect(r.amountDollars).toBe(1350); // 1500 - 10%
    expect(r.appliedPct).toBe(10);
    expect(r.codeAccepted).toBe(true);
  });

  it("rejects a code deeper than the floor (no discount, generic miss)", () => {
    const r = resolveDepositAmount({ ...base, code: "g15", codePct: 15 });
    expect(r.amountDollars).toBe(1500); // floor holds
    expect(r.appliedPct).toBe(0);
    expect(r.codeAccepted).toBe(false);
  });

  it("treats an unknown code (null pct) as no discount", () => {
    const r = resolveDepositAmount({ ...base, code: "zzz", codePct: null });
    expect(r.amountDollars).toBe(1500);
    expect(r.codeAccepted).toBe(false);
  });

  it("never returns below zero or NaN", () => {
    const r = resolveDepositAmount({ targetDollars: 0, maxDiscountPct: 100, code: "g10", codePct: 10 });
    expect(r.amountDollars).toBe(0);
  });
});

describe("centsFromDollars", () => {
  it("converts to integer cents", () => {
    expect(centsFromDollars(1350)).toBe(135000);
    expect(centsFromDollars(19.99)).toBe(1999);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- pricing`
Expected: FAIL ("Cannot find module './pricing'").

- [ ] **Step 3: Implement `src/lib/sales/pricing.ts`**

```ts
/**
 * Deposit pricing + discount-floor logic. PURE — no IO, no env.
 * The single source of truth for how much Square charges. Server-only callers
 * pass the prospect's own target + floor and the looked-up code pct; the browser
 * never sends a price.
 */
export interface ResolveDepositInput {
  targetDollars: number;
  maxDiscountPct: number; // the silent floor (0-100)
  code: string | null; // raw code the user typed (for echo only)
  codePct: number | null; // pct from discount_codes, or null if code unknown/inactive
}

export interface ResolvedDeposit {
  amountDollars: number;
  appliedPct: number;
  codeAccepted: boolean;
}

export function resolveDepositAmount(input: ResolveDepositInput): ResolvedDeposit {
  const target = Math.max(0, Number(input.targetDollars) || 0);
  const floor = clampPct(input.maxDiscountPct);
  const pct = input.codePct == null ? 0 : clampPct(input.codePct);

  // A code only counts if it exists AND is within the prospect's floor.
  const accepted = input.code != null && input.codePct != null && pct > 0 && pct <= floor;
  const appliedPct = accepted ? pct : 0;
  const amount = round2(target * (1 - appliedPct / 100));

  return { amountDollars: Math.max(0, amount), appliedPct, codeAccepted: accepted };
}

export function centsFromDollars(dollars: number): number {
  return Math.round((Number(dollars) || 0) * 100);
}

function clampPct(n: number): number {
  const v = Number(n) || 0;
  return Math.min(100, Math.max(0, v));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
```

- [ ] **Step 4: Run tests to confirm pass**

Run: `npm test -- pricing`
Expected: PASS (6 assertions).

- [ ] **Step 5: Commit**

```bash
git add tsd-modernization-app/src/lib/sales/pricing.ts tsd-modernization-app/src/lib/sales/pricing.test.ts
git commit -m "feat(sales): deposit pricing + discount-floor logic (tested)"
```

---

## Task 5: Service catalog + TS DB types

**Files:**
- Create: `src/lib/sales/services.ts`
- Modify: `src/lib/supabase/types.ts` (add the 6 tables)

- [ ] **Step 1: Create `src/lib/sales/services.ts`**

```ts
/** The four TSD services scored on a prospect's value estimates. */
export const SERVICE_KEYS = ["website", "front_desk", "concierge", "booking_bridge"] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const SERVICE_LABEL: Record<ServiceKey, string> = {
  website: "Custom website",
  front_desk: "TSD Front Desk",
  concierge: "TSD Concierge",
  booking_bridge: "Booking Bridge",
};

export const SERVICE_BLURB: Record<ServiceKey, string> = {
  website: "A modern site that turns visitors into booked work.",
  front_desk: "AI receptionist that answers every call, day or night.",
  concierge: "On-site AI that answers product questions and captures leads.",
  booking_bridge: "Lets customers book and schedule without phone tag.",
};

export function usd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}
```

- [ ] **Step 2: Extend `src/lib/supabase/types.ts`**

Add these type aliases near the existing ones (after `ClientUserRole`):
```ts
export type ProspectStatus = "new" | "pitched" | "won" | "lost";
export type ProspectAssetKind = "image" | "pdf" | "other";
export type EstimateServiceKey = "website" | "front_desk" | "concierge" | "booking_bridge";
export type EstimateCadence = "monthly" | "one_time";
export type DepositStatus = "pending" | "paid" | "failed";
```

Inside `Database["public"]["Tables"]`, add (after `work_items`):
```ts
      prospects: {
        Row: {
          id: string;
          business_name: string;
          business_url: string;
          contact_name: string | null;
          email: string | null;
          phone: string | null;
          source_lead_id: string | null;
          demo_site_url: string | null;
          vapi_assistant_id: string | null;
          outline_md: string | null;
          audit_id: string | null;
          deposit_target: number;
          max_discount_pct: number;
          package_tier: string | null;
          status: ProspectStatus;
          notes: string | null;
          share_token: string;
          share_enabled: boolean;
          converted_client_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          business_url: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          source_lead_id?: string | null;
          demo_site_url?: string | null;
          vapi_assistant_id?: string | null;
          outline_md?: string | null;
          audit_id?: string | null;
          deposit_target?: number;
          max_discount_pct?: number;
          package_tier?: string | null;
          status?: ProspectStatus;
          notes?: string | null;
          share_token?: string;
          share_enabled?: boolean;
          converted_client_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospects"]["Insert"]>;
        Relationships: [];
      };
      prospect_assets: {
        Row: {
          id: string;
          prospect_id: string;
          kind: ProspectAssetKind;
          storage_path: string;
          label: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          kind: ProspectAssetKind;
          storage_path: string;
          label?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospect_assets"]["Insert"]>;
        Relationships: [];
      };
      prospect_estimates: {
        Row: {
          id: string;
          prospect_id: string;
          service_key: EstimateServiceKey;
          dollar_value: number;
          cadence: EstimateCadence;
          rationale: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          service_key: EstimateServiceKey;
          dollar_value?: number;
          cadence?: EstimateCadence;
          rationale?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospect_estimates"]["Insert"]>;
        Relationships: [];
      };
      discount_codes: {
        Row: { id: string; code: string; pct: number; active: boolean; created_at: string };
        Insert: { id?: string; code: string; pct: number; active?: boolean; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["discount_codes"]["Insert"]>;
        Relationships: [];
      };
      prospect_deposits: {
        Row: {
          id: string;
          prospect_id: string;
          amount: number;
          code: string | null;
          square_payment_link_id: string | null;
          square_order_id: string | null;
          square_payment_id: string | null;
          status: DepositStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          prospect_id: string;
          amount: number;
          code?: string | null;
          square_payment_link_id?: string | null;
          square_order_id?: string | null;
          square_payment_id?: string | null;
          status?: DepositStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["prospect_deposits"]["Insert"]>;
        Relationships: [];
      };
      showcase_voice_calls: {
        Row: { id: string; prospect_id: string; created_at: string };
        Insert: { id?: string; prospect_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["showcase_voice_calls"]["Insert"]>;
        Relationships: [];
      };
```

- [ ] **Step 3: Verify + commit**

Run: `npm run typecheck` → PASS.
```bash
git add tsd-modernization-app/src/lib/sales/services.ts tsd-modernization-app/src/lib/supabase/types.ts
git commit -m "feat(sales): service catalog + DB types for new tables"
```

---

## Task 6: Square REST adapter (env-flagged, graceful when unset)

**Files:**
- Create: `src/lib/square/checkout.ts`

- [ ] **Step 1: Implement the adapter**

```ts
import "server-only";
import { env } from "@/lib/env";

const BASE: Record<"sandbox" | "production", string> = {
  sandbox: "https://connect.squareupsandbox.com",
  production: "https://connect.squareup.com",
};
const SQUARE_VERSION = "2025-01-23"; // pin; bump deliberately when upgrading.

export function squareConfigured(): boolean {
  const e = env();
  return Boolean(e.SQUARE_ACCESS_TOKEN && e.SQUARE_LOCATION_ID);
}

export interface CreatePaymentLinkArgs {
  name: string; // shown on Square checkout, e.g. "Deposit — Bisque Imports"
  amountCents: number;
  idempotencyKey: string; // our prospect_deposits.id
  redirectUrl: string; // where Square returns the buyer after paying
  referenceId: string; // our prospect_deposits.id, echoed back on the order
}

export interface PaymentLink {
  id: string;
  url: string;
  orderId: string | null;
}

export async function createPaymentLink(args: CreatePaymentLinkArgs): Promise<PaymentLink> {
  const e = env();
  if (!squareConfigured()) throw new Error("Square not configured");
  const res = await fetch(`${BASE[e.SQUARE_ENV]}/v2/online-checkout/payment-links`, {
    method: "POST",
    headers: {
      "Square-Version": SQUARE_VERSION,
      Authorization: `Bearer ${e.SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idempotency_key: args.idempotencyKey,
      quick_pay: {
        name: args.name,
        price_money: { amount: args.amountCents, currency: "USD" },
        location_id: e.SQUARE_LOCATION_ID,
      },
      checkout_options: { redirect_url: args.redirectUrl },
      payment_note: args.referenceId,
    }),
  });
  const json = (await res.json()) as {
    payment_link?: { id: string; url: string; order_id?: string };
    errors?: { detail?: string }[];
  };
  if (!res.ok || !json.payment_link) {
    throw new Error(json.errors?.[0]?.detail ?? `Square error ${res.status}`);
  }
  return {
    id: json.payment_link.id,
    url: json.payment_link.url,
    orderId: json.payment_link.order_id ?? null,
  };
}

/** Fetch an order to confirm it's actually paid before we convert (defense in depth). */
export async function getOrderState(orderId: string): Promise<string | null> {
  const e = env();
  if (!squareConfigured()) return null;
  const res = await fetch(`${BASE[e.SQUARE_ENV]}/v2/orders/${orderId}`, {
    headers: {
      "Square-Version": SQUARE_VERSION,
      Authorization: `Bearer ${e.SQUARE_ACCESS_TOKEN}`,
    },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { order?: { state?: string } };
  return json.order?.state ?? null;
}
```

- [ ] **Step 2: Verify against sandbox (manual, before relying on it)**

With sandbox creds in `.env.local`, run a one-off `curl` to confirm the shape:
```bash
curl -s https://connect.squareupsandbox.com/v2/online-checkout/payment-links \
 -H "Square-Version: 2025-01-23" -H "Authorization: Bearer $SQUARE_ACCESS_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"idempotency_key":"test-1","quick_pay":{"name":"Test","price_money":{"amount":100,"currency":"USD"},"location_id":"'"$SQUARE_LOCATION_ID"'"}}' | head -40
```
Expected: JSON with `payment_link.url`. If the field names differ in your Square version, adjust the adapter (this is the one external API to confirm live).

- [ ] **Step 3: typecheck + commit**

Run: `npm run typecheck` → PASS.
```bash
git add tsd-modernization-app/src/lib/square/checkout.ts
git commit -m "feat(sales): Square REST checkout adapter (env-flagged)"
```

---

## Task 7: Prospect server actions (CRUD, promote, share, status)

**Files:**
- Create: `src/app/sales/actions.ts`

- [ ] **Step 1: Implement actions (follows `admin/clients/actions.ts` patterns)**

```ts
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PACKAGE_TIERS } from "@/lib/packages";

const urlField = z
  .string()
  .min(1)
  .transform((v) => (v.startsWith("http") ? v : `https://${v}`))
  .pipe(z.string().url());

const ProspectSchema = z.object({
  business_name: z.string().min(2),
  business_url: urlField,
  contact_name: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  demo_site_url: z.string().optional().or(z.literal("")),
  vapi_assistant_id: z.string().optional().or(z.literal("")),
  outline_md: z.string().optional().or(z.literal("")),
  package_tier: z.enum(PACKAGE_TIERS as unknown as [string, ...string[]]).optional().or(z.literal("")),
  deposit_target: z.coerce.number().min(0).default(0),
  max_discount_pct: z.coerce.number().int().min(0).max(100).default(0),
  notes: z.string().optional().or(z.literal("")),
});

function clean(v: FormDataEntryValue | null): string {
  return (v ?? "").toString();
}

export async function createProspect(formData: FormData) {
  await requireRole("admin");
  const p = ProspectSchema.parse({
    business_name: clean(formData.get("business_name")),
    business_url: clean(formData.get("business_url")),
    contact_name: clean(formData.get("contact_name")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    demo_site_url: clean(formData.get("demo_site_url")),
    vapi_assistant_id: clean(formData.get("vapi_assistant_id")),
    outline_md: clean(formData.get("outline_md")),
    package_tier: clean(formData.get("package_tier")),
    deposit_target: clean(formData.get("deposit_target")) || 0,
    max_discount_pct: clean(formData.get("max_discount_pct")) || 0,
    notes: clean(formData.get("notes")),
  });
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("prospects")
    .insert({
      business_name: p.business_name,
      business_url: p.business_url,
      contact_name: p.contact_name || null,
      email: p.email || null,
      phone: p.phone || null,
      demo_site_url: p.demo_site_url || null,
      vapi_assistant_id: p.vapi_assistant_id || null,
      outline_md: p.outline_md || null,
      package_tier: p.package_tier || null,
      deposit_target: p.deposit_target,
      max_discount_pct: p.max_discount_pct,
      notes: p.notes || null,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "insert failed");
  revalidatePath("/sales");
  redirect(`/sales/${data.id}`);
}

export async function updateProspect(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const p = ProspectSchema.parse({
    business_name: clean(formData.get("business_name")),
    business_url: clean(formData.get("business_url")),
    contact_name: clean(formData.get("contact_name")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone")),
    demo_site_url: clean(formData.get("demo_site_url")),
    vapi_assistant_id: clean(formData.get("vapi_assistant_id")),
    outline_md: clean(formData.get("outline_md")),
    package_tier: clean(formData.get("package_tier")),
    deposit_target: clean(formData.get("deposit_target")) || 0,
    max_discount_pct: clean(formData.get("max_discount_pct")) || 0,
    notes: clean(formData.get("notes")),
  });
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("prospects")
    .update({
      business_name: p.business_name,
      business_url: p.business_url,
      contact_name: p.contact_name || null,
      email: p.email || null,
      phone: p.phone || null,
      demo_site_url: p.demo_site_url || null,
      vapi_assistant_id: p.vapi_assistant_id || null,
      outline_md: p.outline_md || null,
      package_tier: p.package_tier || null,
      deposit_target: p.deposit_target,
      max_discount_pct: p.max_discount_pct,
      notes: p.notes || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/sales/${id}`);
  revalidatePath("/sales");
  redirect(`/sales/${id}`);
}

export async function setProspectStatus(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const status = z.enum(["new", "pitched", "won", "lost"]).parse(formData.get("status"));
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  revalidatePath(`/sales/${id}`);
}

export async function toggleShare(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const enabled = formData.get("enabled") === "true";
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").update({ share_enabled: enabled }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/sales/${id}`);
}

export async function deleteProspect(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const sb = supabaseAdmin();
  const { error } = await sb.from("prospects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/sales");
  redirect("/sales");
}

export async function promoteLead(formData: FormData) {
  await requireRole("admin");
  const leadId = z.string().uuid().parse(formData.get("lead_id"));
  const sb = supabaseAdmin();
  const { data: lead, error: lErr } = await sb
    .from("leads")
    .select("id,business_name,business_url,email,phone")
    .eq("id", leadId)
    .single();
  if (lErr || !lead) throw new Error(lErr?.message ?? "lead not found");

  // Pull the lead's latest ready audit (for "Draft from audit" later).
  const { data: audit } = await sb
    .from("audits")
    .select("id")
    .eq("owner_type", "lead")
    .eq("owner_id", leadId)
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await sb
    .from("prospects")
    .insert({
      business_name: lead.business_name,
      business_url: lead.business_url,
      email: lead.email,
      phone: lead.phone,
      source_lead_id: lead.id,
      audit_id: audit?.id ?? null,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "promote failed");
  revalidatePath("/sales");
  redirect(`/sales/${data.id}`);
}
```

- [ ] **Step 2: typecheck + commit**

Run: `npm run typecheck` → PASS.
```bash
git add tsd-modernization-app/src/app/sales/actions.ts
git commit -m "feat(sales): prospect CRUD + promote-from-lead + share/status actions"
```

---

## Task 8: Estimate + asset + discount-code actions

**Files:**
- Create: `src/app/sales/estimate-actions.ts`
- Create: `src/lib/sales/draft-estimates.ts` (Anthropic, mirrors audit synth)

- [ ] **Step 1: `src/lib/sales/draft-estimates.ts`**

```ts
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { env } from "@/lib/env";
import { SERVICE_KEYS } from "@/lib/sales/services";

const DraftSchema = z.object({
  estimates: z
    .array(
      z.object({
        service_key: z.enum(SERVICE_KEYS as unknown as [string, ...string[]]),
        dollar_value: z.number().min(0),
        rationale: z.string().min(3),
      })
    )
    .min(1)
    .max(4),
});
export type DraftEstimates = z.infer<typeof DraftSchema>;

const TOOL: Anthropic.Tool = {
  name: "submit_estimates",
  description: "Submit per-service monthly dollar value estimates for a prospect. Call once.",
  input_schema: {
    type: "object",
    properties: {
      estimates: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        items: {
          type: "object",
          properties: {
            service_key: { type: "string", enum: [...SERVICE_KEYS] },
            dollar_value: { type: "number", minimum: 0 },
            rationale: { type: "string" },
          },
          required: ["service_key", "dollar_value", "rationale"],
          additionalProperties: false,
        },
      },
    },
    required: ["estimates"],
    additionalProperties: false,
  },
};

const SYSTEM = `You estimate the monthly dollar value each TSD service would add to a specific small business, for a sales pitch. Services: website (custom website), front_desk (AI phone receptionist), concierge (on-site AI assistant), booking_bridge (online booking). Use the audit findings to ground each number in that business's reality (missed calls, weak site, review gaps, etc.). Return conservative, defensible monthly dollar figures and a one-sentence rationale tied to evidence. Call submit_estimates exactly once with up to 4 services (most relevant first).`;

export async function draftEstimatesFromAudit(auditJson: unknown): Promise<DraftEstimates> {
  const e = env();
  const client = new Anthropic({ apiKey: e.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: e.ANTHROPIC_MODEL,
    max_tokens: 1500,
    system: [{ type: "text", text: SYSTEM }],
    tools: [TOOL],
    tool_choice: { type: "tool", name: "submit_estimates" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `<audit>\n${JSON.stringify(auditJson, null, 2)}\n</audit>\n\nEstimate per-service monthly value and call submit_estimates.`,
          },
        ],
      },
    ],
  });
  const tool = msg.content.find((c): c is Anthropic.ToolUseBlock => c.type === "tool_use");
  if (!tool) throw new Error("draft: model did not call submit_estimates");
  return DraftSchema.parse(tool.input);
}
```

- [ ] **Step 2: `src/app/sales/estimate-actions.ts`**

```ts
"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/require";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { SERVICE_KEYS } from "@/lib/sales/services";
import { draftEstimatesFromAudit } from "@/lib/sales/draft-estimates";

export async function upsertEstimate(formData: FormData) {
  await requireRole("admin");
  const schema = z.object({
    id: z.string().uuid().optional().or(z.literal("")),
    prospect_id: z.string().uuid(),
    service_key: z.enum(SERVICE_KEYS as unknown as [string, ...string[]]),
    dollar_value: z.coerce.number().min(0).default(0),
    rationale: z.string().optional().or(z.literal("")),
  });
  const p = schema.parse({
    id: (formData.get("id") ?? "").toString(),
    prospect_id: formData.get("prospect_id"),
    service_key: formData.get("service_key"),
    dollar_value: (formData.get("dollar_value") ?? "0").toString(),
    rationale: (formData.get("rationale") ?? "").toString(),
  });
  const sb = supabaseAdmin();
  if (p.id) {
    await sb.from("prospect_estimates").update({
      service_key: p.service_key, dollar_value: p.dollar_value, rationale: p.rationale || null,
    }).eq("id", p.id);
  } else {
    await sb.from("prospect_estimates").insert({
      prospect_id: p.prospect_id, service_key: p.service_key,
      dollar_value: p.dollar_value, rationale: p.rationale || null,
    });
  }
  revalidatePath(`/sales/${p.prospect_id}`);
}

export async function deleteEstimate(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  await supabaseAdmin().from("prospect_estimates").delete().eq("id", id);
  revalidatePath(`/sales/${prospectId}`);
}

export async function draftEstimates(formData: FormData) {
  await requireRole("admin");
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  const sb = supabaseAdmin();
  const { data: prospect } = await sb.from("prospects").select("audit_id").eq("id", prospectId).single();
  if (!prospect?.audit_id) throw new Error("No audit linked to this prospect.");
  const { data: audit } = await sb.from("audits").select("scores,report_md").eq("id", prospect.audit_id).single();
  if (!audit) throw new Error("Audit not found.");
  const draft = await draftEstimatesFromAudit({ scores: audit.scores, report_md: audit.report_md });
  // Replace existing estimates with the fresh draft.
  await sb.from("prospect_estimates").delete().eq("prospect_id", prospectId);
  await sb.from("prospect_estimates").insert(
    draft.estimates.map((e, i) => ({
      prospect_id: prospectId, service_key: e.service_key,
      dollar_value: e.dollar_value, rationale: e.rationale, sort_order: i,
    }))
  );
  revalidatePath(`/sales/${prospectId}`);
}

export async function uploadAsset(formData: FormData) {
  await requireRole("admin");
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("No file.");
  const label = (formData.get("label") ?? "").toString() || null;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const kind = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext) ? "image" : ext === "pdf" ? "pdf" : "other";
  const path = `${prospectId}/${crypto.randomUUID()}.${ext}`;
  const sb = supabaseAdmin();
  const { error: upErr } = await sb.storage.from("prospect-assets").upload(path, file, {
    contentType: file.type || undefined, upsert: false,
  });
  if (upErr) throw new Error(upErr.message);
  await sb.from("prospect_assets").insert({ prospect_id: prospectId, kind, storage_path: path, label });
  revalidatePath(`/sales/${prospectId}`);
}

export async function deleteAsset(formData: FormData) {
  await requireRole("admin");
  const id = z.string().uuid().parse(formData.get("id"));
  const prospectId = z.string().uuid().parse(formData.get("prospect_id"));
  const sb = supabaseAdmin();
  const { data: asset } = await sb.from("prospect_assets").select("storage_path").eq("id", id).single();
  if (asset) await sb.storage.from("prospect-assets").remove([asset.storage_path]);
  await sb.from("prospect_assets").delete().eq("id", id);
  revalidatePath(`/sales/${prospectId}`);
}

export async function upsertDiscountCode(formData: FormData) {
  await requireRole("admin");
  const schema = z.object({
    code: z.string().min(1).transform((s) => s.trim().toLowerCase()),
    pct: z.coerce.number().int().min(1).max(100),
    active: z.boolean().default(true),
  });
  const p = schema.parse({
    code: (formData.get("code") ?? "").toString(),
    pct: (formData.get("pct") ?? "0").toString(),
    active: formData.get("active") !== "false",
  });
  await supabaseAdmin().from("discount_codes").upsert({ code: p.code, pct: p.pct, active: p.active }, { onConflict: "code" });
  revalidatePath("/sales/codes");
}

export async function deleteDiscountCode(formData: FormData) {
  await requireRole("admin");
  const code = z.string().parse(formData.get("code"));
  await supabaseAdmin().from("discount_codes").delete().eq("code", code);
  revalidatePath("/sales/codes");
}
```

- [ ] **Step 3: typecheck + commit**

Run: `npm run typecheck` → PASS.
```bash
git add tsd-modernization-app/src/app/sales/estimate-actions.ts tsd-modernization-app/src/lib/sales/draft-estimates.ts
git commit -m "feat(sales): estimate/asset/code actions + AI draft-from-audit"
```

---

## Task 9: Shared showcase data loader + components

These render in BOTH the admin pitch view and the public showcase, so they live in shared files.

**Files:**
- Create: `src/lib/sales/load-showcase.ts` (signed asset URLs + shaped data)
- Create: `src/app/sales/_components/ShowcaseSections.tsx` (site card, estimates, outline, assets — presentational, no secrets)
- Create: `src/app/sales/_components/DepositPanel.tsx` (client component: promo box + pay button)
- Create: `src/app/sales/_components/PublicVoiceCard.tsx` (client: capped voice for public link)

- [ ] **Step 1: `src/lib/sales/load-showcase.ts`**

```ts
import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

export type ProspectRow = Database["public"]["Tables"]["prospects"]["Row"];
export type EstimateRow = Database["public"]["Tables"]["prospect_estimates"]["Row"];

export interface ShowcaseAsset { id: string; kind: string; label: string | null; url: string }
export interface Showcase {
  prospect: ProspectRow;
  estimates: EstimateRow[];
  assets: ShowcaseAsset[];
}

async function buildAssets(prospectId: string): Promise<ShowcaseAsset[]> {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("prospect_assets")
    .select("id,kind,label,storage_path,sort_order")
    .eq("prospect_id", prospectId)
    .order("sort_order", { ascending: true });
  const rows = data ?? [];
  const out: ShowcaseAsset[] = [];
  for (const r of rows) {
    const { data: signed } = await sb.storage
      .from("prospect-assets")
      .createSignedUrl(r.storage_path, 60 * 60);
    out.push({ id: r.id, kind: r.kind, label: r.label, url: signed?.signedUrl ?? "" });
  }
  return out;
}

export async function loadShowcaseById(id: string): Promise<Showcase | null> {
  const sb = supabaseAdmin();
  const { data: prospect } = await sb.from("prospects").select("*").eq("id", id).single();
  if (!prospect) return null;
  const { data: estimates } = await sb
    .from("prospect_estimates").select("*").eq("prospect_id", id).order("sort_order", { ascending: true });
  return { prospect, estimates: estimates ?? [], assets: await buildAssets(id) };
}

export async function loadShowcaseByToken(token: string): Promise<Showcase | null> {
  const sb = supabaseAdmin();
  const { data: prospect } = await sb
    .from("prospects").select("*").eq("share_token", token).eq("share_enabled", true).maybeSingle();
  if (!prospect) return null;
  const { data: estimates } = await sb
    .from("prospect_estimates").select("*").eq("prospect_id", prospect.id).order("sort_order", { ascending: true });
  return { prospect, estimates: estimates ?? [], assets: await buildAssets(prospect.id) };
}
```

- [ ] **Step 2: `src/app/sales/_components/ShowcaseSections.tsx`**

```tsx
import { ExternalLink, FileText, ImageIcon } from "lucide-react";
import { SERVICE_LABEL, usd, type ServiceKey } from "@/lib/sales/services";
import type { Showcase } from "@/lib/sales/load-showcase";

export function SiteCard({ url }: { url: string | null }) {
  if (!url) return null;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        The website we built you
      </h2>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--primary-bg)] px-5 text-base font-semibold text-[var(--primary-fg)] hover:bg-[var(--primary-bg-hover)]">
          Open full site <ExternalLink size={16} />
        </a>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="Scan to open the site on your phone" width={120} height={120}
          className="rounded-lg bg-white p-2" />
      </div>
    </section>
  );
}

export function EstimatesCard({ estimates }: { estimates: Showcase["estimates"] }) {
  if (estimates.length === 0) return null;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        What each service is worth to you
      </h2>
      <ul className="mt-4 divide-y divide-[var(--border)]">
        {estimates.map((e) => (
          <li key={e.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-[var(--text)]">{SERVICE_LABEL[e.service_key as ServiceKey]}</p>
              {e.rationale && <p className="text-sm text-[var(--text-muted)]">{e.rationale}</p>}
            </div>
            <span className="shrink-0 font-mono text-lg font-semibold text-[var(--success)]">
              +{usd(Number(e.dollar_value))}{e.cadence === "monthly" ? "/mo" : ""}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function OutlineCard({ md }: { md: string | null }) {
  if (!md) return null;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Project outline
      </h2>
      <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]">{md}</div>
    </section>
  );
}

export function AssetsCard({ assets }: { assets: Showcase["assets"] }) {
  if (assets.length === 0) return null;
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Demo work</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {assets.map((a) =>
          a.kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={a.id} src={a.url} alt={a.label ?? "Demo asset"} className="rounded-lg border border-[var(--border)]" />
          ) : (
            <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text)] hover:border-[var(--accent)]">
              {a.kind === "pdf" ? <FileText size={16} /> : <ImageIcon size={16} />}
              {a.label ?? "Open file"}
            </a>
          )
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `src/app/sales/_components/DepositPanel.tsx`**

```tsx
"use client";
import { useState } from "react";
import { usd } from "@/lib/sales/services";

export default function DepositPanel({
  prospectId, token, targetDollars,
}: { prospectId?: string; token?: string; targetDollars: number }) {
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState<number>(targetDollars);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/square/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_id: prospectId, token, code: code.trim() || null }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsg(json.error ?? "Could not start checkout.");
        return;
      }
      if (json.applied_pct > 0) setPreview(json.amount_dollars);
      window.location.href = json.url; // Square hosted checkout
    } catch {
      setMsg("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[14px] border border-[var(--success)]/30 bg-[var(--success-soft)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--success)]">
        Ready to start? Reserve your build
      </h2>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm text-[var(--text-muted)]">Deposit today</span>
        <span className="font-mono text-3xl font-bold text-[var(--text)]">{usd(preview)}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code (optional)"
          className="w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2.5 text-base text-[var(--text)] outline-none focus:border-[var(--accent)]" />
      </div>
      {msg && <p className="mt-2 text-sm text-[var(--danger)]">{msg}</p>}
      <button onClick={start} disabled={loading}
        className="mt-4 h-12 w-full rounded-md bg-[var(--success)] text-base font-bold text-white hover:opacity-90 disabled:opacity-60">
        {loading ? "Starting…" : "Pay deposit with Square →"}
      </button>
    </section>
  );
}
```

- [ ] **Step 4: `src/app/sales/_components/PublicVoiceCard.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Phone, PhoneOff, Mic } from "lucide-react";

const MAX_CALL_SECONDS = 180; // per-call cap on the public link.

export default function PublicVoiceCard({ token }: { token: string }) {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!key) return;
    const vapi = new Vapi(key);
    vapiRef.current = vapi;
    vapi.on("call-start", () => setStatus("live"));
    vapi.on("call-end", () => setStatus("idle"));
    vapi.on("error", (e: unknown) => {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Vapi error");
    });
    return () => vapi.stop();
  }, []);

  async function start() {
    setError(null);
    setStatus("connecting");
    try {
      const res = await fetch(`/api/showcase/${token}/voice-grant`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(json.error ?? "Demo unavailable right now.");
        return;
      }
      await vapiRef.current?.start(json.assistant_id, {
        maxDurationSeconds: MAX_CALL_SECONDS,
      } as Record<string, unknown>);
    } catch {
      setStatus("error");
      setError("Could not start the call.");
    }
  }

  const live = status === "live";
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        Your AI receptionist — live demo
      </h2>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><Mic size={20} /></div>
          <p className="text-sm text-[var(--text-muted)]">Ask your hours, or place an order.</p>
        </div>
        {!live ? (
          <button onClick={start} disabled={status === "connecting"}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--primary-bg)] px-5 font-semibold text-[var(--primary-fg)] disabled:opacity-60">
            <Phone size={16} /> {status === "connecting" ? "Connecting…" : "Start call"}
          </button>
        ) : (
          <button onClick={() => vapiRef.current?.stop()}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--danger)] px-5 font-semibold text-white">
            <PhoneOff size={16} /> End
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>}
    </section>
  );
}
```

- [ ] **Step 5: typecheck + commit**

Run: `npm run typecheck` → PASS.
```bash
git add tsd-modernization-app/src/lib/sales/load-showcase.ts tsd-modernization-app/src/app/sales/_components
git commit -m "feat(sales): shared showcase loader + presentational components"
```

---

## Task 10: API routes — Square checkout, webhook, voice-grant

**Files:**
- Create: `src/app/api/square/checkout/route.ts`
- Create: `src/app/api/square/webhook/route.ts`
- Create: `src/app/api/showcase/[token]/voice-grant/route.ts`

- [ ] **Step 1: `src/app/api/square/checkout/route.ts`**

Resolves the amount server-side from the prospect's own target+floor (never trusts the client), creates a deposit row, returns the Square URL. Accepts either an admin session (`prospect_id`) or a public token.

```ts
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { resolveDepositAmount, centsFromDollars } from "@/lib/sales/pricing";
import { createPaymentLink, squareConfigured } from "@/lib/square/checkout";

export const runtime = "nodejs";

const Body = z.object({
  prospect_id: z.string().uuid().optional(),
  token: z.string().optional(),
  code: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  if (!squareConfigured()) {
    return NextResponse.json({ error: "Payments aren't enabled yet." }, { status: 503 });
  }
  const body = Body.parse(await req.json());
  const sb = supabaseAdmin();

  // Resolve the prospect either by admin-supplied id (requires login) or public token.
  let prospect: { id: string; business_name: string; deposit_target: number; max_discount_pct: number } | null = null;
  if (body.prospect_id) {
    const { data: { user } } = await (await supabaseServer()).auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const { data } = await sb.from("prospects")
      .select("id,business_name,deposit_target,max_discount_pct").eq("id", body.prospect_id).single();
    prospect = data;
  } else if (body.token) {
    const { data } = await sb.from("prospects")
      .select("id,business_name,deposit_target,max_discount_pct")
      .eq("share_token", body.token).eq("share_enabled", true).maybeSingle();
    prospect = data;
  }
  if (!prospect) return NextResponse.json({ error: "Prospect not found." }, { status: 404 });

  // Look up the code's pct (server-side; never trust the client's number).
  let codePct: number | null = null;
  const codeRaw = body.code?.trim().toLowerCase() || null;
  if (codeRaw) {
    const { data: c } = await sb.from("discount_codes")
      .select("pct,active").eq("code", codeRaw).maybeSingle();
    codePct = c && c.active ? c.pct : null;
  }

  const resolved = resolveDepositAmount({
    targetDollars: Number(prospect.deposit_target),
    maxDiscountPct: Number(prospect.max_discount_pct),
    code: codeRaw,
    codePct,
  });
  if (resolved.amountDollars <= 0) {
    return NextResponse.json({ error: "Deposit amount isn't set." }, { status: 400 });
  }

  const { data: deposit, error: depErr } = await sb.from("prospect_deposits").insert({
    prospect_id: prospect.id,
    amount: resolved.amountDollars,
    code: resolved.codeAccepted ? codeRaw : null,
    status: "pending",
  }).select("id").single();
  if (depErr || !deposit) return NextResponse.json({ error: "Could not create deposit." }, { status: 500 });

  const link = await createPaymentLink({
    name: `Deposit — ${prospect.business_name}`,
    amountCents: centsFromDollars(resolved.amountDollars),
    idempotencyKey: deposit.id,
    redirectUrl: `${env().NEXT_PUBLIC_SITE_URL}/sales/thanks`,
    referenceId: deposit.id,
  });

  await sb.from("prospect_deposits").update({
    square_payment_link_id: link.id, square_order_id: link.orderId,
  }).eq("id", deposit.id);

  return NextResponse.json({
    url: link.url,
    amount_dollars: resolved.amountDollars,
    applied_pct: resolved.appliedPct,
  });
}
```

- [ ] **Step 2: `src/app/api/square/webhook/route.ts`**

Verifies Square's HMAC-SHA256 signature, confirms the order is actually paid, flips the deposit + prospect, and auto-creates the client.

```ts
import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getOrderState } from "@/lib/square/checkout";

export const runtime = "nodejs";

function verify(req: NextRequest, rawBody: string): boolean {
  const e = env();
  const key = e.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!key) return false;
  const sig = req.headers.get("x-square-hmacsha256-signature") ?? "";
  const url = `${e.NEXT_PUBLIC_SITE_URL}/api/square/webhook`;
  const hmac = crypto.createHmac("sha256", key).update(url + rawBody).digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(sig));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verify(req, raw)) return NextResponse.json({ error: "bad signature" }, { status: 401 });

  const event = JSON.parse(raw) as {
    type?: string;
    data?: { object?: { payment?: { order_id?: string; status?: string } } };
  };
  const orderId = event.data?.object?.payment?.order_id;
  if (!orderId) return NextResponse.json({ ok: true }); // not a payment event we track

  const sb = supabaseAdmin();
  const { data: deposit } = await sb.from("prospect_deposits")
    .select("id,prospect_id,status").eq("square_order_id", orderId).maybeSingle();
  if (!deposit) return NextResponse.json({ ok: true });
  if (deposit.status === "paid") return NextResponse.json({ ok: true }); // idempotent

  // Defense in depth: confirm with Square the order is actually completed/paid.
  const state = await getOrderState(orderId);
  if (state !== "COMPLETED" && event.data?.object?.payment?.status !== "COMPLETED") {
    return NextResponse.json({ ok: true });
  }

  await sb.from("prospect_deposits").update({
    status: "paid", square_payment_id: orderId,
  }).eq("id", deposit.id);

  // Load the prospect and auto-create the client (carry fields forward).
  const { data: prospect } = await sb.from("prospects")
    .select("*").eq("id", deposit.prospect_id).single();
  if (!prospect) return NextResponse.json({ ok: true });

  if (!prospect.converted_client_id) {
    const { data: client } = await sb.from("clients").insert({
      name: prospect.business_name,
      website_url: prospect.demo_site_url || prospect.business_url,
      package_tier: prospect.package_tier || "website_ai_bundle",
      vapi_assistant_id: prospect.vapi_assistant_id,
    }).select("id").single();
    await sb.from("prospects").update({
      status: "won", converted_client_id: client?.id ?? null,
    }).eq("id", prospect.id);
    if (prospect.source_lead_id && client) {
      await sb.from("leads").update({ converted_client_id: client.id }).eq("id", prospect.source_lead_id);
    }
  } else {
    await sb.from("prospects").update({ status: "won" }).eq("id", prospect.id);
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: `src/app/api/showcase/[token]/voice-grant/route.ts`**

Daily cap per token, then returns the assistant id.

```ts
import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const DAILY_CAP = 5;

export async function POST(_req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const sb = supabaseAdmin();
  const { data: prospect } = await sb.from("prospects")
    .select("id,vapi_assistant_id").eq("share_token", token).eq("share_enabled", true).maybeSingle();
  if (!prospect?.vapi_assistant_id) {
    return NextResponse.json({ error: "Demo not available." }, { status: 404 });
  }
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await sb.from("showcase_voice_calls")
    .select("id", { count: "exact", head: true })
    .eq("prospect_id", prospect.id).gte("created_at", since);
  if ((count ?? 0) >= DAILY_CAP) {
    return NextResponse.json({ error: "Demo limit reached for today." }, { status: 429 });
  }
  await sb.from("showcase_voice_calls").insert({ prospect_id: prospect.id });
  return NextResponse.json({ assistant_id: prospect.vapi_assistant_id });
}
```

> NOTE on `Date.now()`/`new Date()`: these are normal Node route handlers (not workflow scripts), so the runtime restriction in the Workflow tool does NOT apply here — standard date APIs are fine.

- [ ] **Step 4: typecheck + commit**

Run: `npm run typecheck` → PASS.
```bash
git add tsd-modernization-app/src/app/api/square tsd-modernization-app/src/app/api/showcase
git commit -m "feat(sales): Square checkout + webhook (auto-convert) + capped voice-grant"
```

---

## Task 11: Pages — pitch view, board, forms, codes, public showcase, thanks

**Files:**
- Create: `src/app/sales/page.tsx` (board)
- Create: `src/app/sales/SalesNav.tsx` (tiny header w/ requireRole + sign out)
- Create: `src/app/sales/layout.tsx` (gate `requireRole("admin")`)
- Create: `src/app/sales/[id]/page.tsx` (pitch view — admin)
- Create: `src/app/sales/[id]/PitchActions.tsx` (status pills + share toggle, client)
- Create: `src/app/sales/new/page.tsx` (create form)
- Create: `src/app/sales/[id]/edit/page.tsx` (edit form + estimates + assets)
- Create: `src/app/sales/codes/page.tsx` (discount codes)
- Create: `src/app/sales/thanks/page.tsx` (post-payment return)
- Create: `src/app/showcase/[token]/page.tsx` (public leave-behind)

- [ ] **Step 1: `src/app/sales/layout.tsx`** — gates the whole admin sales area.

```tsx
import { requireRole } from "@/lib/auth/require";

export default async function SalesLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin");
  return <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</div>;
}
```

- [ ] **Step 2: `src/app/sales/page.tsx`** — the board (adapts detailing `/sales`).

```tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { usd } from "@/lib/sales/services";
import type { ProspectStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const ORDER: ProspectStatus[] = ["new", "pitched", "won", "lost"];
const LABEL: Record<ProspectStatus, string> = { new: "New", pitched: "Pitched", won: "Won", lost: "Lost" };
const TONE: Record<ProspectStatus, "amber" | "blue" | "emerald" | "neutral"> = {
  new: "amber", pitched: "blue", won: "emerald", lost: "neutral",
};

export default async function SalesBoard() {
  const sb = supabaseAdmin();
  const { data: prospects } = await sb
    .from("prospects")
    .select("id,business_name,business_url,status,package_tier,deposit_target,updated_at")
    .order("updated_at", { ascending: false });
  const rows = prospects ?? [];
  const counts = {
    new: rows.filter((r) => r.status === "new").length,
    pitched: rows.filter((r) => r.status === "pitched").length,
    won: rows.filter((r) => r.status === "won").length,
    all: rows.length,
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <PageHeader eyebrow="Sales" title="Prospects"
        description="Tap a prospect to open their pitch. Promote audit leads or add one by hand."
        actions={<LinkButton href="/sales/new" leftIcon={<Plus size={16} />}>New prospect</LinkButton>} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([["New", counts.new], ["Pitched", counts.pitched], ["Won", counts.won], ["All", counts.all]] as const).map(
          ([label, value]) => (
            <div key={label} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-subtle)]">{label}</div>
              <div className="font-mono text-2xl text-[var(--text)]">{value}</div>
            </div>
          )
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No prospects yet" description="Add your first prospect to start pitching." />
      ) : (
        ORDER.map((status) => {
          const items = rows.filter((r) => r.status === status);
          if (items.length === 0) return null;
          return (
            <section key={status}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {LABEL[status]} · {items.length}
              </h2>
              <ul className="space-y-3">
                {items.map((p) => (
                  <li key={p.id}>
                    <Link href={`/sales/${p.id}`}
                      className="flex items-center justify-between gap-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-[var(--shadow-card)] transition-colors hover:border-[var(--accent)]">
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--text)]">{p.business_name}</p>
                        <p className="truncate text-sm text-[var(--text-muted)]">{p.business_url}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {p.deposit_target > 0 && (
                          <span className="font-mono text-sm text-[var(--text)]">{usd(Number(p.deposit_target))}</span>
                        )}
                        <Badge tone={TONE[p.status]}>{LABEL[p.status]}</Badge>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      <PromoteLeads />
    </div>
  );
}

async function PromoteLeads() {
  const sb = supabaseAdmin();
  const { data: leads } = await sb
    .from("leads").select("id,business_name,business_url").is("converted_client_id", null)
    .order("created_at", { ascending: false }).limit(25);
  const { data: existing } = await sb.from("prospects").select("source_lead_id");
  const taken = new Set((existing ?? []).map((e) => e.source_lead_id).filter(Boolean));
  const open = (leads ?? []).filter((l) => !taken.has(l.id));
  if (open.length === 0) return null;
  const { promoteLead } = await import("./actions");
  return (
    <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-display text-lg font-semibold text-[var(--text)]">Promote an audit lead</h2>
      <ul className="mt-4 divide-y divide-[var(--border)]">
        {open.map((l) => (
          <li key={l.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-medium text-[var(--text)]">{l.business_name}</p>
              <p className="truncate text-sm text-[var(--text-muted)]">{l.business_url}</p>
            </div>
            <form action={promoteLead}>
              <input type="hidden" name="lead_id" value={l.id} />
              <button className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
                Promote →
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: `src/app/sales/[id]/page.tsx`** — the pitch view.

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { loadShowcaseById } from "@/lib/sales/load-showcase";
import { SiteCard, EstimatesCard, OutlineCard, AssetsCard } from "../_components/ShowcaseSections";
import DepositPanel from "../_components/DepositPanel";
import PitchActions from "./PitchActions";
import VoiceWidget from "@/app/app/voice/VoiceWidget";
import BackLink from "@/components/BackLink";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function PitchView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const showcase = await loadShowcaseById(id);
  if (!showcase) notFound();
  const { prospect, estimates, assets } = showcase;
  const shareUrl = `${env().NEXT_PUBLIC_SITE_URL}/showcase/${prospect.share_token}`;

  return (
    <div className="space-y-6 animate-fade-up">
      <BackLink href="/sales" label="All prospects" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">{prospect.business_name}</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{prospect.business_url}</p>
        </div>
        <Link href={`/sales/${id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] px-3 py-2 text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]">
          <Pencil size={14} /> Edit
        </Link>
      </div>

      <PitchActions id={prospect.id} status={prospect.status} shareEnabled={prospect.share_enabled} shareUrl={shareUrl} />

      <SiteCard url={prospect.demo_site_url} />
      {prospect.vapi_assistant_id && (
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Your AI receptionist — live demo
          </h2>
          <VoiceWidget assistantId={prospect.vapi_assistant_id} />
        </section>
      )}
      <EstimatesCard estimates={estimates} />
      <OutlineCard md={prospect.outline_md} />
      <AssetsCard assets={assets} />
      {prospect.deposit_target > 0 && (
        <DepositPanel prospectId={prospect.id} targetDollars={Number(prospect.deposit_target)} />
      )}
    </div>
  );
}
```

- [ ] **Step 4: `src/app/sales/[id]/PitchActions.tsx`** — status + share (client).

```tsx
"use client";
import { useState } from "react";
import { setProspectStatus, toggleShare } from "../actions";
import type { ProspectStatus } from "@/lib/supabase/types";

const STATUSES: ProspectStatus[] = ["new", "pitched", "won", "lost"];

export default function PitchActions({
  id, status, shareEnabled, shareUrl,
}: { id: string; status: ProspectStatus; shareEnabled: boolean; shareUrl: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
      {STATUSES.map((s) => (
        <form key={s} action={setProspectStatus}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={s} />
          <button className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            status === s ? "bg-[var(--accent)] text-white" : "border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}>{s}</button>
        </form>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <button onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-xs text-[var(--text)] hover:border-[var(--accent)]">
          {copied ? "Copied!" : "Copy leave-behind link"}
        </button>
        <form action={toggleShare}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="enabled" value={(!shareEnabled).toString()} />
          <button className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)]">
            {shareEnabled ? "Disable link" : "Enable link"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: `src/app/sales/new/page.tsx`** — create form.

```tsx
import { PageHeader } from "@/components/ui/PageHeader";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import BackLink from "@/components/BackLink";
import { PACKAGE_TIERS } from "@/lib/packages";
import { createProspect } from "../actions";

export default function NewProspectPage() {
  return (
    <div className="space-y-6">
      <BackLink href="/sales" label="All prospects" />
      <PageHeader eyebrow="Sales" title="New prospect" />
      <form action={createProspect} className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="business_name">Business name</Label><Input id="business_name" name="business_name" required className="mt-1.5" /></div>
        <div><Label htmlFor="business_url">Business URL</Label><Input id="business_url" name="business_url" required placeholder="acme.com" className="mt-1.5" /></div>
        <div><Label htmlFor="contact_name" hint="(optional)">Contact name</Label><Input id="contact_name" name="contact_name" className="mt-1.5" /></div>
        <div><Label htmlFor="email" hint="(optional)">Email</Label><Input id="email" name="email" type="email" className="mt-1.5" /></div>
        <div><Label htmlFor="phone" hint="(optional)">Phone</Label><Input id="phone" name="phone" className="mt-1.5" /></div>
        <div><Label htmlFor="demo_site_url" hint="(optional)">Demo site URL</Label><Input id="demo_site_url" name="demo_site_url" placeholder="https://demo.…" className="mt-1.5" /></div>
        <div><Label htmlFor="vapi_assistant_id" hint="(optional)">Vapi assistant ID</Label><Input id="vapi_assistant_id" name="vapi_assistant_id" className="mt-1.5" /></div>
        <div>
          <Label htmlFor="package_tier" hint="(optional)">Package tier</Label>
          <Select id="package_tier" name="package_tier" defaultValue="" className="mt-1.5">
            <option value="">—</option>
            {PACKAGE_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div><Label htmlFor="deposit_target">Deposit target ($)</Label><Input id="deposit_target" name="deposit_target" type="number" min="0" step="1" defaultValue="0" className="mt-1.5" /></div>
        <div><Label htmlFor="max_discount_pct" hint="(Nash-only floor)">Max discount %</Label><Input id="max_discount_pct" name="max_discount_pct" type="number" min="0" max="100" step="1" defaultValue="0" className="mt-1.5" /></div>
        <div className="sm:col-span-2"><Label htmlFor="outline_md" hint="(optional)">Project outline</Label><Textarea id="outline_md" name="outline_md" rows={5} className="mt-1.5" /></div>
        <div className="sm:col-span-2"><Label htmlFor="notes" hint="(internal)">Notes</Label><Textarea id="notes" name="notes" rows={2} className="mt-1.5" /></div>
        <div className="sm:col-span-2"><Button type="submit">Create prospect</Button></div>
      </form>
    </div>
  );
}
```

- [ ] **Step 6: `src/app/sales/[id]/edit/page.tsx`** — edit + estimates + assets.

```tsx
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { loadShowcaseById } from "@/lib/sales/load-showcase";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input, Label, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import BackLink from "@/components/BackLink";
import { PACKAGE_TIERS } from "@/lib/packages";
import { SERVICE_KEYS, SERVICE_LABEL, type ServiceKey } from "@/lib/sales/services";
import { updateProspect, deleteProspect } from "../../actions";
import { upsertEstimate, deleteEstimate, draftEstimates, uploadAsset, deleteAsset } from "../../estimate-actions";

export const dynamic = "force-dynamic";

export default async function EditProspect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = supabaseAdmin();
  const { data: p } = await sb.from("prospects").select("*").eq("id", id).single();
  if (!p) notFound();
  const showcase = await loadShowcaseById(id);
  const estimates = showcase?.estimates ?? [];
  const assets = showcase?.assets ?? [];

  return (
    <div className="space-y-8">
      <BackLink href={`/sales/${id}`} label="Back to pitch" />
      <PageHeader eyebrow="Sales" title={`Edit — ${p.business_name}`} />

      <form action={updateProspect} className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="id" value={p.id} />
        <div><Label htmlFor="business_name">Business name</Label><Input id="business_name" name="business_name" defaultValue={p.business_name} required className="mt-1.5" /></div>
        <div><Label htmlFor="business_url">Business URL</Label><Input id="business_url" name="business_url" defaultValue={p.business_url} required className="mt-1.5" /></div>
        <div><Label htmlFor="contact_name" hint="(optional)">Contact name</Label><Input id="contact_name" name="contact_name" defaultValue={p.contact_name ?? ""} className="mt-1.5" /></div>
        <div><Label htmlFor="email" hint="(optional)">Email</Label><Input id="email" name="email" type="email" defaultValue={p.email ?? ""} className="mt-1.5" /></div>
        <div><Label htmlFor="phone" hint="(optional)">Phone</Label><Input id="phone" name="phone" defaultValue={p.phone ?? ""} className="mt-1.5" /></div>
        <div><Label htmlFor="demo_site_url" hint="(optional)">Demo site URL</Label><Input id="demo_site_url" name="demo_site_url" defaultValue={p.demo_site_url ?? ""} className="mt-1.5" /></div>
        <div><Label htmlFor="vapi_assistant_id" hint="(optional)">Vapi assistant ID</Label><Input id="vapi_assistant_id" name="vapi_assistant_id" defaultValue={p.vapi_assistant_id ?? ""} className="mt-1.5" /></div>
        <div>
          <Label htmlFor="package_tier" hint="(optional)">Package tier</Label>
          <Select id="package_tier" name="package_tier" defaultValue={p.package_tier ?? ""} className="mt-1.5">
            <option value="">—</option>
            {PACKAGE_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div><Label htmlFor="deposit_target">Deposit target ($)</Label><Input id="deposit_target" name="deposit_target" type="number" min="0" step="1" defaultValue={String(p.deposit_target)} className="mt-1.5" /></div>
        <div><Label htmlFor="max_discount_pct" hint="(Nash-only floor)">Max discount %</Label><Input id="max_discount_pct" name="max_discount_pct" type="number" min="0" max="100" step="1" defaultValue={String(p.max_discount_pct)} className="mt-1.5" /></div>
        <div className="sm:col-span-2"><Label htmlFor="outline_md" hint="(optional)">Project outline</Label><Textarea id="outline_md" name="outline_md" rows={5} defaultValue={p.outline_md ?? ""} className="mt-1.5" /></div>
        <div className="sm:col-span-2"><Label htmlFor="notes" hint="(internal)">Notes</Label><Textarea id="notes" name="notes" rows={2} defaultValue={p.notes ?? ""} className="mt-1.5" /></div>
        <div className="sm:col-span-2"><Button type="submit">Save changes</Button></div>
      </form>

      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[var(--text)]">Value estimates</h2>
          {p.audit_id && (
            <form action={draftEstimates}>
              <input type="hidden" name="prospect_id" value={p.id} />
              <Button type="submit" variant="secondary" size="sm">Draft from audit</Button>
            </form>
          )}
        </div>
        <ul className="mt-4 space-y-3">
          {estimates.map((e) => (
            <li key={e.id}>
              <form action={upsertEstimate} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="prospect_id" value={p.id} />
                <input type="hidden" name="service_key" value={e.service_key} />
                <span className="min-w-[140px] text-sm font-medium text-[var(--text)]">{SERVICE_LABEL[e.service_key as ServiceKey]}</span>
                <Input name="dollar_value" type="number" min="0" defaultValue={String(e.dollar_value)} className="w-28" aria-label="Dollar value" />
                <Input name="rationale" defaultValue={e.rationale ?? ""} placeholder="Rationale" className="flex-1 min-w-[180px]" aria-label="Rationale" />
                <Button type="submit" size="sm">Save</Button>
              </form>
              <form action={deleteEstimate} className="mt-1">
                <input type="hidden" name="id" value={e.id} />
                <input type="hidden" name="prospect_id" value={p.id} />
                <button className="text-xs text-[var(--danger)] hover:underline">Remove</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={upsertEstimate} className="mt-4 flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-4">
          <input type="hidden" name="prospect_id" value={p.id} />
          <Select name="service_key" defaultValue={SERVICE_KEYS[0]} className="w-auto" aria-label="Service">
            {SERVICE_KEYS.map((k) => <option key={k} value={k}>{SERVICE_LABEL[k]}</option>)}
          </Select>
          <Input name="dollar_value" type="number" min="0" defaultValue="0" className="w-28" aria-label="Dollar value" />
          <Input name="rationale" placeholder="Rationale" className="flex-1 min-w-[180px]" aria-label="Rationale" />
          <Button type="submit" size="sm">Add</Button>
        </form>
      </section>

      <section className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-lg font-semibold text-[var(--text)]">Demo work files</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {assets.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2">
              <span className="truncate text-sm text-[var(--text)]">{a.label ?? a.kind}</span>
              <form action={deleteAsset}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="prospect_id" value={p.id} />
                <button className="text-[var(--danger)]" aria-label="Delete asset"><Trash2 size={14} /></button>
              </form>
            </li>
          ))}
        </ul>
        <form action={uploadAsset} className="mt-4 flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-4">
          <input type="hidden" name="prospect_id" value={p.id} />
          <input type="file" name="file" required className="text-sm text-[var(--text-muted)]" />
          <Input name="label" placeholder="Label (optional)" className="flex-1 min-w-[160px]" aria-label="Label" />
          <Button type="submit" size="sm">Upload</Button>
        </form>
      </section>

      <form action={deleteProspect} className="border-t border-[var(--border)] pt-6">
        <input type="hidden" name="id" value={p.id} />
        <Button type="submit" variant="danger" size="sm">Delete prospect</Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 7: `src/app/sales/codes/page.tsx`**

```tsx
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import BackLink from "@/components/BackLink";
import { upsertDiscountCode, deleteDiscountCode } from "../estimate-actions";

export const dynamic = "force-dynamic";

export default async function CodesPage() {
  const { data: codes } = await supabaseAdmin().from("discount_codes").select("*").order("code");
  return (
    <div className="space-y-6">
      <BackLink href="/sales" label="All prospects" />
      <PageHeader eyebrow="Sales" title="Discount codes"
        description="Grant's silent lever. Codes are checked against each prospect's hidden floor server-side." />
      <ul className="divide-y divide-[var(--border)] rounded-[14px] border border-[var(--border)] bg-[var(--surface)]">
        {(codes ?? []).map((c) => (
          <li key={c.code} className="flex items-center justify-between gap-3 px-5 py-3">
            <span className="font-mono text-[var(--text)]">{c.code}</span>
            <span className="text-sm text-[var(--text-muted)]">{c.pct}% {c.active ? "" : "(inactive)"}</span>
            <form action={deleteDiscountCode}>
              <input type="hidden" name="code" value={c.code} />
              <button className="text-xs text-[var(--danger)] hover:underline">Delete</button>
            </form>
          </li>
        ))}
      </ul>
      <form action={upsertDiscountCode} className="flex flex-wrap items-end gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5">
        <div><Label htmlFor="code">Code</Label><Input id="code" name="code" required placeholder="g20" className="mt-1.5" /></div>
        <div><Label htmlFor="pct">Percent off</Label><Input id="pct" name="pct" type="number" min="1" max="100" required className="mt-1.5 w-28" /></div>
        <Button type="submit">Save code</Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 8: `src/app/sales/thanks/page.tsx`**

```tsx
export default function ThanksPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-[var(--text)]">Deposit received</h1>
      <p className="mt-3 text-[var(--text-muted)]">Thank you — your build is reserved. We&rsquo;ll be in touch shortly with next steps.</p>
    </div>
  );
}
```

- [ ] **Step 9: `src/app/showcase/[token]/page.tsx`** — public leave-behind (no login).

```tsx
import { notFound } from "next/navigation";
import { loadShowcaseByToken } from "@/lib/sales/load-showcase";
import { SiteCard, EstimatesCard, OutlineCard, AssetsCard } from "@/app/sales/_components/ShowcaseSections";
import DepositPanel from "@/app/sales/_components/DepositPanel";
import PublicVoiceCard from "@/app/sales/_components/PublicVoiceCard";

export const dynamic = "force-dynamic";

export default async function ShowcasePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const showcase = await loadShowcaseByToken(token);
  if (!showcase) notFound();
  const { prospect, estimates, assets } = showcase;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text)]">{prospect.business_name}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Prepared for you by TSD Modernization Solutions</p>
      </header>
      <div className="space-y-6">
        <SiteCard url={prospect.demo_site_url} />
        {prospect.vapi_assistant_id && <PublicVoiceCard token={prospect.share_token} />}
        <EstimatesCard estimates={estimates} />
        <OutlineCard md={prospect.outline_md} />
        <AssetsCard assets={assets} />
        {prospect.deposit_target > 0 && (
          <DepositPanel token={prospect.share_token} targetDollars={Number(prospect.deposit_target)} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 10: Add a `/sales` link to the admin nav** — `src/app/admin/layout.tsx`, after the Clients link:

```tsx
            <Link
              href="/sales"
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              Sales
            </Link>
```

- [ ] **Step 11: Verify everything**

```bash
npm run typecheck && npm run lint && npm run build
```
Expected: all PASS. Fix any type/lint errors before committing.

- [ ] **Step 12: Commit**

```bash
git add tsd-modernization-app/src/app/sales tsd-modernization-app/src/app/showcase tsd-modernization-app/src/app/admin/layout.tsx
git commit -m "feat(sales): board, pitch view, forms, codes, public showcase, thanks"
```

---

## Task 12: Grant's access + proxy + manual verification

**Files:**
- Modify: `src/middleware.ts` (only if it has an explicit route allowlist; otherwise no change)

- [ ] **Step 1: Confirm `/showcase` is publicly reachable**

Read `src/middleware.ts`. If it redirects unauthenticated users away from everything except an allowlist, add `/showcase` (and `/api/square/webhook`, `/api/showcase`) to the public list. If it only refreshes the session (no gating), no change is needed — the `/sales` layout's `requireRole("admin")` is what protects admin pages, and `/showcase` has no gate.

- [ ] **Step 2: Give Grant an admin membership**

Grant signs in once at `/login` (magic link) to create his auth user. Then, in the Supabase SQL editor:
```sql
insert into public.client_users (user_id, client_id, role)
select u.id, c.id, 'admin'
from auth.users u
cross join (select id from public.clients order by created_at limit 1) c
where u.email = 'GRANT_EMAIL_HERE'
on conflict do nothing;
```
(`requireRole("admin")` only checks that *an* admin row exists for the user; the `client_id` it points to is irrelevant for admin gating.)

- [ ] **Step 3: Manual smoke test (dev)**

Run: `npm run dev`. As an admin:
1. `/sales` → "New prospect" → create one with a demo URL, Vapi ID, deposit target 1500, max discount 10.
2. Open `/sales/<id>` → confirm site card, voice widget, deposit panel render.
3. "Copy leave-behind link" → open `/showcase/<token>` in a private window (no login) → confirm read-only render + deposit panel, and that no edit/status controls appear.
4. If Square sandbox creds are set: click "Pay deposit with Square", complete sandbox payment, point a Square sandbox webhook at `/api/square/webhook`, and confirm the prospect flips to **won** and a client row appears.

- [ ] **Step 4: Commit any proxy change**

```bash
git add tsd-modernization-app/src/middleware.ts
git commit -m "feat(sales): allow public /showcase + Square webhook through proxy"
```

(Skip the commit if no change was needed.)

---

## Task 13: Final verification, push, PR

- [ ] **Step 1: Full gate**

```bash
cd tsd-modernization-app
npm run typecheck && npm run lint && npm run build && npm test
```
Expected: all PASS.

- [ ] **Step 2: Push the branch**

```bash
cd "$(git rev-parse --show-toplevel)"
git push -u origin sales-dashboard
```

- [ ] **Step 3: Open a PR**

```bash
gh pr create --title "Sales & pitch dashboard (Grant's iPad)" \
  --body "Implements docs/superpowers/specs/2026-05-31-sales-dashboard-design.md. New /sales admin pipeline + /sales/[id] pitch view, public /showcase/[token] leave-behind, Square hosted-checkout deposits with server-side discount-floor enforcement, AI-drafted value estimates, capped public voice demo. Square is env-flagged (sandbox) and degrades gracefully when unset.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Go-live checklist (post-merge, when ready to take real money)

1. Add `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_WEBHOOK_SIGNATURE_KEY` to Vercel env; set `SQUARE_ENV=production`.
2. In Square Dashboard → Webhooks: subscribe `payment.created` + `payment.updated` to `https://tsd-modernization.com/api/square/webhook`; copy the signature key into env.
3. Re-run the manual deposit test against production with a small real amount; confirm auto-convert.
4. Decide the open items from the spec §13 (voice caps, deposit defaults, whether to lock `max_discount_pct` to a Nash-only control).
