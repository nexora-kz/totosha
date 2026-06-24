import { createClient } from '@supabase/supabase-js';
import { TOTOSHA_RECRUITING_FALLBACK, TotoshaVacancy } from './totoshaVacancies';

function serverSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(/\n|;/).map((item) => item.trim()).filter(Boolean);
  }
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
    externalUrl: row.external_url ? String(row.external_url) : null,
    externalId: row.external_id ? String(row.external_id) : null,
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

  if (error || !data?.length) return TOTOSHA_RECRUITING_FALLBACK;
  return data.map((row) => mapInternal(row as Record<string, unknown>));
}

type HhVacancyItem = {
  id: string;
  name: string;
  alternate_url?: string;
  published_at?: string;
  salary?: { from?: number | null; to?: number | null; currency?: string | null } | null;
  employment?: { name?: string } | null;
  schedule?: { name?: string } | null;
  area?: { name?: string } | null;
  snippet?: { requirement?: string | null; responsibility?: string | null } | null;
};

export async function loadHhVacancies(): Promise<TotoshaVacancy[]> {
  const employerId = process.env.HH_EMPLOYER_ID;
  if (!employerId) return [];

  try {
    const response = await fetch(`https://api.hh.ru/vacancies?employer_id=${encodeURIComponent(employerId)}&per_page=100`, {
      headers: {
        'User-Agent': process.env.HH_USER_AGENT || 'TotoshaRecruiting/1.0 (totoshakids.kz)',
        Accept: 'application/json',
      },
      next: { revalidate: 900 },
    });
    if (!response.ok) return [];
    const payload = await response.json() as { items?: HhVacancyItem[] };
    return (payload.items || []).map((item) => ({
      id: `hh-${item.id}`,
      slug: `hh-${item.id}`,
      title: item.name,
      summary: item.snippet?.responsibility || item.snippet?.requirement || 'Вакансия детского сада Тотоша на HeadHunter.',
      responsibilities: item.snippet?.responsibility ? [item.snippet.responsibility] : [],
      requirements: item.snippet?.requirement ? [item.snippet.requirement] : [],
      conditions: ['Подробные условия указаны в публикации HeadHunter.'],
      employment: item.employment?.name || 'По договорённости',
      schedule: item.schedule?.name || 'По договорённости',
      location: item.area?.name || 'Астана',
      salaryFrom: item.salary?.from || null,
      salaryTo: item.salary?.to || null,
      currency: item.salary?.currency || 'KZT',
      source: 'hh',
      externalUrl: item.alternate_url || null,
      externalId: item.id,
      publishedAt: item.published_at || null,
      active: true,
    }));
  } catch {
    return [];
  }
}

export async function loadPublicVacancies() {
  const [internal, hh] = await Promise.all([loadInternalVacancies(), loadHhVacancies()]);
  const seen = new Set<string>();
  const result: TotoshaVacancy[] = [];

  for (const vacancy of [...hh, ...internal]) {
    const key = vacancy.title.toLocaleLowerCase('ru-RU').replace(/\s+/g, ' ').trim();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(vacancy);
  }

  return result;
}
