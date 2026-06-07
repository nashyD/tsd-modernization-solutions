-- Prospect discovery + product-led pitch routing.
--
-- Adds `primary_product` (which product we LEAD the pitch with) so the /sales
-- board can be filtered by product, plus the discovery/firmographic fields the
-- Google Places harvester will populate later (place_id, lat/lng, rating,
-- review_count, gap_summary, fit_score, source_url, discovery_source).
--
-- All columns are nullable, so existing prospects are unaffected. A CHECK in
-- SQL passes when the value is NULL, so legacy rows with no primary_product are
-- fine. primary_product/secondary_product reuse the SAME vocabulary as
-- prospect_estimates.service_key: website / front_desk / booking_bridge / concierge.

alter table public.prospects
  add column if not exists primary_product text
    check (primary_product in ('website','front_desk','booking_bridge','concierge')),
  add column if not exists secondary_product text
    check (secondary_product in ('website','front_desk','booking_bridge','concierge')),
  add column if not exists city text,
  add column if not exists place_id text,
  add column if not exists lat numeric(9,6),
  add column if not exists lng numeric(9,6),
  add column if not exists rating numeric(2,1),
  add column if not exists review_count integer,
  add column if not exists gap_summary text,
  add column if not exists fit_score numeric(5,2),
  add column if not exists source_url text,
  add column if not exists discovery_source text;

-- Dedup harvested businesses on Google place_id, but only when one is present
-- (a partial unique index allows many NULLs, e.g. the hand-seeded rows below).
create unique index if not exists prospects_place_id_key
  on public.prospects(place_id) where place_id is not null;

-- Filter/sort the board by the product we're leading with.
create index if not exists prospects_primary_product_idx
  on public.prospects(primary_product);
