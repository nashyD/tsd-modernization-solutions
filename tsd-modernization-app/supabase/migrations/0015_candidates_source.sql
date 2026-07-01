-- 0015: open prospect_candidates to a second feed (grant-leadscout) alongside
-- the Places harvester. Leadscout leads have no Google place_id but do carry a
-- researched owner email, so: place_id goes nullable (unique only where
-- present), a source tag + citation ref land on every row, and dedupe moves to
-- a generated key (place_id when present, else normalized name+phone) so the
-- import route can upsert without re-serving businesses the vault already
-- found. The route additionally dedupes against existing prospects by
-- normalized name/phone — that is what keeps the 50 seeded leadboard prospects
-- (seed-2026-06-30-leadboard-prospects.sql) from reappearing as candidates.

alter table public.prospect_candidates
  alter column place_id drop not null;

-- Replace the bare unique with a partial unique (place_id when present).
alter table public.prospect_candidates
  drop constraint if exists prospect_candidates_place_id_key;
create unique index if not exists prospect_candidates_place_id_key
  on public.prospect_candidates(place_id)
  where place_id is not null;

alter table public.prospect_candidates
  add column if not exists email text,
  add column if not exists source text not null default 'places'
    check (source in ('places','leadscout','manual')),
  add column if not exists source_ref text;

-- Normalized dedupe key: place_id wins; otherwise lowercased name (stripped of
-- punctuation + business suffixes) joined with the phone's digits.
create or replace function public.candidate_dedupe_key(
  p_place_id text, p_name text, p_phone text
) returns text
language sql immutable as $$
  select coalesce(
    p_place_id,
    regexp_replace(
      regexp_replace(lower(coalesce(p_name,'')), '\y(llc|inc|co|corp|company|the)\y', '', 'g'),
      '[^a-z0-9]', '', 'g'
    ) || '|' || regexp_replace(coalesce(p_phone,''), '\D', '', 'g')
  );
$$;

alter table public.prospect_candidates
  add column if not exists dedupe_key text
  generated always as (public.candidate_dedupe_key(place_id, business_name, phone)) stored;

create unique index if not exists prospect_candidates_dedupe_key_idx
  on public.prospect_candidates(dedupe_key);
