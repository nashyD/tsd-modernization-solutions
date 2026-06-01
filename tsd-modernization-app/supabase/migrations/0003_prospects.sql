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
