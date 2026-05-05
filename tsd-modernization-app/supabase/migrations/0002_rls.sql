-- Row-level security policies for the portal.
-- Phase 1 (lead audits) bypasses RLS via the service-role key on /api/audit/* routes —
-- leads have no auth user yet. RLS protects authenticated client/portal data.

alter table public.clients enable row level security;
alter table public.client_users enable row level security;
alter table public.work_items enable row level security;
alter table public.audits enable row level security;
alter table public.leads enable row level security;

-- Helper: is the current user a member of this client?
create or replace function public.is_client_member(target_client uuid)
returns boolean
language sql security definer set search_path = public, auth
as $$
  select exists (
    select 1 from public.client_users
    where user_id = auth.uid() and client_id = target_client
  );
$$;

-- Helper: is the current user an admin (any client_users row with role='admin')?
create or replace function public.is_app_admin()
returns boolean
language sql security definer set search_path = public, auth
as $$
  select exists (
    select 1 from public.client_users
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- clients: members can read their own; admins can read all.
create policy clients_select on public.clients
  for select using (public.is_client_member(id) or public.is_app_admin());

-- client_users: a user sees their own memberships; admins see all.
create policy client_users_select on public.client_users
  for select using (user_id = auth.uid() or public.is_app_admin());

-- work_items: members can read for their client; admins read all.
create policy work_items_select on public.work_items
  for select using (public.is_client_member(client_id) or public.is_app_admin());

-- audits: lead audits never readable via authenticated client (use service-role on public report page);
-- client audits readable by client members and admins.
create policy audits_select on public.audits
  for select using (
    (owner_type = 'client' and public.is_client_member(owner_id))
    or public.is_app_admin()
  );

-- leads: only admins.
create policy leads_select on public.leads
  for select using (public.is_app_admin());

-- All writes go through service-role (server actions / route handlers).
-- No insert/update/delete policies are defined for authenticated role — RLS denies by default.
