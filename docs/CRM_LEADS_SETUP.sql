alter table public.leads add column if not exists assigned_to text;
alter table public.leads add column if not exists child_age text;
alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists last_contact_at timestamptz;
alter table public.leads add column if not exists next_follow_up_at timestamptz;
alter table public.leads add column if not exists updated_at timestamptz default now();
