-- 0014: queue_slots — the nightly sales loop's ranked morning queue.
--
-- This table deliberately amends 0012's "the loop has no write path here"
-- posture, per the Nash-approved engine change of 2026-07-01: the loop gets
-- exactly ONE write surface, and it is this table. Rows are rendering hints
-- for /sales/today (rank order, one-line reason, inert pitch brief, knock
-- window) — never operational state. The loop still cannot touch
-- prospects.status/owner, sends, or money: its bearer only reaches
-- /api/loop/queue, which zod-validates the payload and writes here through
-- the atomic replace RPC below. Blast radius of a bad push is one
-- `delete ... where queue_date = X and source = 'loop'`.

create table if not exists public.queue_slots (
  id uuid primary key default gen_random_uuid(),
  queue_date date not null,
  owner text not null check (owner in ('grant','bishop','nash')),
  prospect_id uuid not null references public.prospects on delete cascade,
  rank int not null check (rank between 1 and 50),
  kind text not null default 'first_touch' check (kind in ('first_touch','follow_up')),
  reason text,
  brief_md text,
  knock_window text,
  source text not null default 'loop',
  created_at timestamptz not null default now(),
  unique (queue_date, owner, rank),
  unique (queue_date, prospect_id)
);

create index if not exists queue_slots_lookup_idx
  on public.queue_slots(queue_date, owner, rank);

alter table public.queue_slots enable row level security;

-- Reps read their morning queue; writes are service-role only (the loop's
-- route), so no insert/update/delete policies exist on purpose.
drop policy if exists queue_slots_select on public.queue_slots;
create policy queue_slots_select on public.queue_slots
  for select using (public.is_app_admin());

-- Atomic replace-day: PostgREST cannot span a transaction across two calls,
-- so delete+insert lives in one security-definer RPC. Only the service role
-- can execute it (revoke from anon/authenticated below).
create or replace function public.replace_queue_slots(p_date date, p_items jsonb)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted int;
begin
  delete from public.queue_slots
    where queue_date = p_date and source = 'loop';
  insert into public.queue_slots
    (queue_date, owner, prospect_id, rank, kind, reason, brief_md, knock_window, source)
  select
    p_date,
    item->>'owner',
    (item->>'prospect_id')::uuid,
    (item->>'rank')::int,
    coalesce(item->>'kind', 'first_touch'),
    item->>'reason',
    item->>'brief_md',
    item->>'knock_window',
    'loop'
  from jsonb_array_elements(p_items) as item;
  get diagnostics inserted = row_count;
  return inserted;
end;
$$;

revoke execute on function public.replace_queue_slots(date, jsonb) from public;
revoke execute on function public.replace_queue_slots(date, jsonb) from anon;
revoke execute on function public.replace_queue_slots(date, jsonb) from authenticated;
