alter table public.leads add column if not exists assigned_to text;
alter table public.leads add column if not exists child_age text;
alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists last_contact_at timestamptz;
alter table public.leads add column if not exists next_follow_up_at timestamptz;
alter table public.leads add column if not exists updated_at timestamptz default now();

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null,
  event_type text not null,
  details text,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_child_drafts (
  id uuid primary key default gen_random_uuid(),
  lead_id text not null unique,
  child_name text,
  parent_name text,
  phone text,
  child_age text,
  source text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_created_idx on public.leads (status, created_at desc);
create index if not exists leads_phone_idx on public.leads (phone);
create index if not exists leads_follow_up_idx on public.leads (next_follow_up_at);
create index if not exists lead_events_lead_idx on public.lead_events (lead_id, created_at desc);
