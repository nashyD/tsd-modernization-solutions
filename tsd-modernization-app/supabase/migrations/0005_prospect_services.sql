-- Pitch-page rework: prospects now carry a service selection (team size +
-- chosen services) that drives a live estimate and the optional deposit.
-- Deposit becomes a % of the low estimate computed server-side from the
-- selection, so deposit_target is no longer the source of truth (kept for
-- backward-compat / optional flat override, unused by the new flow).

alter table public.prospects
  add column if not exists team_size text not null default 'small',
  add column if not exists selected_services jsonb not null default '[]'::jsonb,
  add column if not exists deposit_pct smallint not null default 10
    check (deposit_pct between 0 and 100);

-- Record what selection each deposit was for (audit trail of paid scope).
alter table public.prospect_deposits
  add column if not exists meta jsonb;

-- Allow audits to be owned directly by a prospect (the "Run audit" button on
-- the sales dashboard), alongside the existing lead/client owners.
alter table public.audits drop constraint if exists audits_owner_type_check;
alter table public.audits add constraint audits_owner_type_check
  check (owner_type in ('lead','client','prospect'));
