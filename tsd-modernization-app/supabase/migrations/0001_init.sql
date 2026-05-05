-- TSD audit + portal initial schema.
-- Run via: supabase db push  (after `supabase link --project-ref <ref>`)
-- Or paste into Supabase SQL editor for first setup.

create extension if not exists "pgcrypto";

-- packages: code-only (src/lib/packages.ts), no table.

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text not null,
  package_tier text not null,
  vapi_assistant_id text,
  vercel_project_id text,
  created_at timestamptz not null default now()
);

create table public.client_users (
  user_id uuid not null references auth.users on delete cascade,
  client_id uuid not null references public.clients on delete cascade,
  role text not null check (role in ('owner','manager','admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, client_id)
);
create index client_users_client_idx on public.client_users(client_id);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  business_url text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  converted_client_id uuid references public.clients on delete set null
);
create index leads_email_idx on public.leads(email);

create table public.audits (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('lead','client')),
  owner_id uuid not null,
  raw_data jsonb,
  scores jsonb,
  report_md text,
  status text not null default 'pending'
    check (status in ('pending','scraping','synthesizing','ready','failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index audits_owner_idx on public.audits(owner_type, owner_id);
create index audits_status_idx on public.audits(status);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger audits_set_updated_at
  before update on public.audits
  for each row execute function public.set_updated_at();

create table public.work_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo','doing','done')),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
create index work_items_client_idx on public.work_items(client_id);
