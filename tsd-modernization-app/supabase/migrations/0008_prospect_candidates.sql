-- Staging table for the Google Places discovery harvester
-- (scripts/discover-prospects.mjs). Harvested businesses land here as 'pending';
-- an admin reviews them on /sales/candidates and Approves (→ creates a prospects
-- row) or Rejects. Keeps the live pipeline clean — only approved candidates
-- become prospects.
create table public.prospect_candidates (
  id uuid primary key default gen_random_uuid(),
  place_id text not null unique,
  business_name text not null,
  address text,
  city text,
  lat numeric(9,6),
  lng numeric(9,6),
  website text,
  phone text,
  rating numeric(2,1),
  review_count integer,
  price_level text,
  primary_type text,
  primary_product text
    check (primary_product in ('website','front_desk','booking_bridge','concierge')),
  gap_summary text,
  fit_score numeric(6,2),
  signals jsonb,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  promoted_prospect_id uuid references public.prospects on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index prospect_candidates_status_idx on public.prospect_candidates(status);
create index prospect_candidates_fit_idx
  on public.prospect_candidates(fit_score desc nulls last);

create trigger prospect_candidates_set_updated_at
  before update on public.prospect_candidates
  for each row execute function public.set_updated_at();

-- Server-only: RLS on with no policies (service role bypasses; anon/authenticated
-- are denied), matching the app's other internal tables. The harvester writes via
-- the service role and /sales/candidates reads via supabaseAdmin().
alter table public.prospect_candidates enable row level security;
