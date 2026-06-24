create extension if not exists pgcrypto;

create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  responsibilities jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  conditions jsonb not null default '[]'::jsonb,
  employment text,
  schedule text,
  location text,
  salary_from numeric,
  salary_to numeric,
  currency text not null default 'KZT',
  source text not null default 'totosha',
  external_id text unique,
  external_url text,
  published_at timestamptz,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  vacancy_id text not null,
  vacancy_title text not null,
  name text not null,
  phone text not null,
  experience text,
  resume_url text,
  comment text,
  source text,
  status text not null default 'new',
  assigned_to text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vacancies_active_sort_idx on public.vacancies(active, sort_order, created_at desc);
create index if not exists vacancies_external_idx on public.vacancies(external_id);
create index if not exists job_applications_status_idx on public.job_applications(status, created_at desc);
create index if not exists job_applications_phone_idx on public.job_applications(phone);

alter table public.vacancies enable row level security;
alter table public.job_applications enable row level security;

comment on table public.vacancies is 'Вакансии детского сада Тотоша и импортированные публикации hh.kz';
comment on table public.job_applications is 'Отклики кандидатов с сайта Тотоша';
