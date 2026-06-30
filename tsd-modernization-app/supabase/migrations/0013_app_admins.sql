-- 0013: separate the global app-admin from the per-client membership role.
--
-- BEFORE: public.is_app_admin() returned true for ANY client_users row with
-- role='admin'. Because client_users.role is a per-client membership column and
-- the per-client invite form offered 'admin', a single admin mis-grant silently
-- minted a cross-tenant super-admin who could read every lead, every prospect,
-- and every other shop's data through the public PostgREST endpoint.
--
-- AFTER: app-admin is an explicit allowlist (public.app_admins). is_app_admin()
-- consults only that table, so a per-client 'admin' membership no longer grants
-- anything global. Every RLS policy already delegates to is_app_admin(), so this
-- one redefinition retightens leads/prospects/clients/work_items/audits at once.
--
-- ORDERING / NO-LOCKOUT: this seeds app_admins from the CURRENT role='admin'
-- holders so no existing TSD operator loses access on deploy. AFTER running,
-- review app_admins and DELETE any row that belongs to a client contact rather
-- than a TSD staffer (run the audit data-check first; demote any such client to
-- 'owner' before this migration so the seed does not carry them over).

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;

-- Only app admins can read the allowlist. Resolved at query time, so it uses the
-- NEW is_app_admin() defined below. Writes are service-role only (no write policy).
create policy app_admins_select on public.app_admins
  for select using (public.is_app_admin());

-- Seed from the current admins so existing TSD staff keep access on deploy.
insert into public.app_admins (user_id, note)
  select distinct user_id, 'seeded from client_users.role=admin in 0013'
  from public.client_users
  where role = 'admin'
on conflict (user_id) do nothing;

-- Redefine the predicate every RLS policy delegates to. Functions resolve at
-- query time, so this instantly switches all policies to the explicit allowlist.
create or replace function public.is_app_admin()
returns boolean
language sql security definer set search_path = public, auth
as $$
  select exists (
    select 1 from public.app_admins where user_id = auth.uid()
  );
$$;
