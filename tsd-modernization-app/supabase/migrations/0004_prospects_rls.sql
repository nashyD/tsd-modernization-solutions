-- RLS for sales-dashboard tables. Authenticated reads gated to admins via
-- is_app_admin(); all writes go through service-role server code (no write policies).
-- The public showcase reads via a service-role token route, not the anon role.
alter table public.prospects enable row level security;
alter table public.prospect_assets enable row level security;
alter table public.prospect_estimates enable row level security;
alter table public.discount_codes enable row level security;
alter table public.prospect_deposits enable row level security;
alter table public.showcase_voice_calls enable row level security;

create policy prospects_select on public.prospects
  for select using (public.is_app_admin());
create policy prospect_assets_select on public.prospect_assets
  for select using (public.is_app_admin());
create policy prospect_estimates_select on public.prospect_estimates
  for select using (public.is_app_admin());
create policy discount_codes_select on public.discount_codes
  for select using (public.is_app_admin());
create policy prospect_deposits_select on public.prospect_deposits
  for select using (public.is_app_admin());
-- showcase_voice_calls: no authenticated select policy needed (service-role only).
