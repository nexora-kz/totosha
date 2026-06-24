import { createClient } from '@supabase/supabase-js';
import { TOTOSHA_RECRUITING_FALLBACK, TotoshaVacancy } from './totoshaVacancies';

function serverSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') return value.split(/\n|;/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function mapInternal(row: Record<string, unknown>): TotoshaVacancy {
  return {
    id: String(row.id || row.slug || crypto.randomUUID()),
    slug: String(row.slug || row.id || 'vacancy'),
    title: String(row.title || 'Вакансия Тотоша'),
    summary: String(row.summary || row.description || ''),
    responsibilities: asList(row.responsibilities),
    requirements: asList(row.requirements),
    conditions: asList(row.conditions),
    employment: String(row.employment || 'Полная занятость'),
    schedule: String(row.schedule || 'По согласованию'),
    location: String(row.location || 'Астана, ул. Алихана Бокейхана, 29А'),
    salaryFrom: row.salary_from == null ? null : Number(row.salary_from),
    salaryTo: row.salary_to == null ? null : Number(row.salary_to),
    currency: String(row.currency || 'KZT'),
    source: 'totosha',
    externalUrl: null,
    externalId: null,
    publishedAt: row.published_at ? String(row.published_at) : null,
    active: row.active !== false,
  };
}

export async function loadInternalVacancies(): Promise<TotoshaVacancy[]> {
  const supabase = serverSupabase();
  if (!supabase) return TOTOSHA_RECRUITING_FALLBACK;

  const { data, error } = await supabase
    .from('vacancies')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return TOTOSHA_RECRUITING_FALLBACK;
  if (!data?.length) return [];

  return data
    .filter((row) => !['hh', 'headhunter', 'rabota', 'paid'].includes(String((row as Record<string, unknown>).source || '').toLowerCase()))
    .map((row) => mapInternal(row as Record<string, unknown>));
}

export async function loadPublicVacancies() {
  return loadInternalVacancies();
}
