-- 0012: funnel instrumentation for the TSD Sales Loop.
-- Additive only: the old status values stay valid, so no existing row needs
-- editing and /refresh-vault never hand-reconciles this. Adds the four funnel
-- sub-stages, the cadence + consent fields the loop OWNS (computed from the
-- one-tap disposition log, never hand-edited), and a stage-transition event
-- log so per-stage conversion ratios can finally be MEASURED rather than
-- guessed. The loop has no write path here; all writes go through service-role
-- server actions, same posture as prospect_notes.

-- 1) Funnel sub-stages. 'pitched' is kept for legacy rows; 'contacted',
--    'demo_shown', 'fit_call', 'proposal' refine it. 'won' = deposit cleared
--    (set by the Square webhook), 'lost' unchanged.
alter table public.prospects
  drop constraint if exists prospects_status_check;
alter table public.prospects
  add constraint prospects_status_check
  check (status in (
    'new','contacted','demo_shown','fit_call','proposal','pitched','won','lost'
  ));

-- 2) Routing + cadence + consent fields. The loop computes touch_count /
--    last_touch_at / next_action_at from the disposition log; humans never
--    hand-edit them. Consent is a checkable field so the loop's compliance
--    lens can fail CLOSED on SMS.
alter table public.prospects
  add column if not exists owner text not null default 'unassigned'
    check (owner in ('grant','bishop','nash','unassigned')),
  add column if not exists touch_count int not null default 0,
  add column if not exists last_touch_at timestamptz,
  add column if not exists next_action_at timestamptz,
  add column if not exists sms_consent text not null default 'none'
    check (sms_consent in ('none','verbal','written')),
  add column if not exists consent_source text,
  add column if not exists consent_at timestamptz;

-- stage_entered_at: backfill from created_at so deal-age math is honest for
-- existing rows, then make it default now() + not null going forward.
alter table public.prospects
  add column if not exists stage_entered_at timestamptz;
update public.prospects
  set stage_entered_at = created_at
  where stage_entered_at is null;
alter table public.prospects
  alter column stage_entered_at set default now();
alter table public.prospects
  alter column stage_entered_at set not null;

create index if not exists prospects_owner_idx on public.prospects(owner);
create index if not exists prospects_next_action_idx
  on public.prospects(next_action_at);

-- 3) Stage-transition event log. The source of truth for every conversion
--    ratio: one row per logged disposition. Append-only, author-stamped, same
--    RLS posture as prospect_notes (admins read; writes via service role only).
create table if not exists public.prospect_stage_events (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects on delete cascade,
  from_status text,
  to_status text not null,
  disposition text not null,
  channel text,
  detail text,
  actor_user_id uuid references auth.users on delete set null,
  actor_email text,
  occurred_at timestamptz not null default now()
);
create index if not exists prospect_stage_events_prospect_idx
  on public.prospect_stage_events(prospect_id, occurred_at desc);
create index if not exists prospect_stage_events_tostatus_idx
  on public.prospect_stage_events(to_status, occurred_at);

alter table public.prospect_stage_events enable row level security;
create policy prospect_stage_events_select on public.prospect_stage_events
  for select using (public.is_app_admin());
