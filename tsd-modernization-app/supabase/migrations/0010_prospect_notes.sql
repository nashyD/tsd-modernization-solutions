-- Append-only demo/pitch notes log per prospect. Each entry records WHO logged it
-- (author_user_id + an author_email snapshot, so the name survives even if the auth
-- user is later removed) and WHEN. This is the canonical record of what happened on a
-- visit/demo — it replaces the single overwritable prospects.notes field, which now
-- serves only as an optional one-line "quick summary" pin.
create table public.prospect_notes (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects on delete cascade,
  body text not null,
  author_user_id uuid references auth.users on delete set null,
  author_email text,
  created_at timestamptz not null default now()
);
-- Newest-first reads per prospect (the log view + the board's "last touched").
create index prospect_notes_prospect_idx
  on public.prospect_notes(prospect_id, created_at desc);

-- Same posture as the other sales tables: authed admins can read; every write goes
-- through service-role server code (no insert/update/delete policy → RLS denies by default).
alter table public.prospect_notes enable row level security;
create policy prospect_notes_select on public.prospect_notes
  for select using (public.is_app_admin());
