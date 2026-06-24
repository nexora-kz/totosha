import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CRM_SESSION_COOKIE, verifyCrmSessionToken } from '../../../../lib/crmAuth';
import { getCrmSupabase } from '../../../../lib/crmSupabase';
import { TOTOSHA_RECRUITING_FALLBACK } from '../../../../lib/totoshaVacancies';

async function authorized() {
  const store = await cookies();
  return verifyCrmSessionToken(store.get(CRM_SESSION_COOKIE)?.value);
}

function clean(value: unknown, max = 4000) {
  return String(value || '').trim().slice(0, max);
}

function list(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => clean(item, 500)).filter(Boolean);
  return clean(value).split(/\n|;/).map((item) => item.trim()).filter(Boolean);
}

function record(body: Record<string, unknown>) {
  const title = clean(body.title, 180);
  const slug = clean(body.slug, 180) || title.toLocaleLowerCase('ru-RU').replace(/[^a-zа-я0-9]+/gi, '-').replace(/(^-|-$)/g, '');
  return {
    slug,
    title,
    summary: clean(body.summary, 2000),
    responsibilities: list(body.responsibilities),
    requirements: list(body.requirements),
    conditions: list(body.conditions),
    employment: clean(body.employment, 100) || 'Полная занятость',
    schedule: clean(body.schedule, 100) || 'По согласованию',
    location: clean(body.location, 250) || 'Астана, ул. Алихана Бокейхана, 29А',
    salary_from: body.salaryFrom ? Number(body.salaryFrom) : null,
    salary_to: body.salaryTo ? Number(body.salaryTo) : null,
    currency: clean(body.currency, 10) || 'KZT',
    source: clean(body.source, 30) || 'totosha',
    external_id: clean(body.externalId, 120) || null,
    external_url: clean(body.externalUrl, 500) || null,
    active: body.active !== false,
    sort_order: Number(body.sortOrder || 0),
    updated_at: new Date().toISOString(),
  };
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const supabase = getCrmSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });
  const { data, error } = await supabase.from('vacancies').select('*').order('sort_order').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, vacancies: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const supabase = getCrmSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });
  const body = await request.json().catch(() => null) as null | Record<string, unknown>;
  if (!body) return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });

  if (body.action === 'seed') {
    const seed = TOTOSHA_RECRUITING_FALLBACK.map((vacancy, index) => ({
      slug: vacancy.slug,
      title: vacancy.title,
      summary: vacancy.summary,
      responsibilities: vacancy.responsibilities,
      requirements: vacancy.requirements,
      conditions: vacancy.conditions,
      employment: vacancy.employment,
      schedule: vacancy.schedule,
      location: vacancy.location,
      salary_from: vacancy.salaryFrom || null,
      salary_to: vacancy.salaryTo || null,
      currency: vacancy.currency || 'KZT',
      source: 'totosha',
      active: true,
      sort_order: index + 1,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('vacancies').upsert(seed, { onConflict: 'slug' });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, seeded: seed.length });
  }

  const vacancy = record(body);
  if (!vacancy.title) return NextResponse.json({ ok: false, error: 'Title is required' }, { status: 400 });
  const { data, error } = await supabase.from('vacancies').insert(vacancy).select('*').single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, vacancy: data });
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const supabase = getCrmSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });
  const body = await request.json().catch(() => null) as null | Record<string, unknown>;
  const id = clean(body?.id, 100);
  if (!id || !body) return NextResponse.json({ ok: false, error: 'Vacancy id is required' }, { status: 400 });
  const { data, error } = await supabase.from('vacancies').update(record(body)).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, vacancy: data });
}

export async function DELETE(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const supabase = getCrmSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });
  const id = clean(new URL(request.url).searchParams.get('id'), 100);
  if (!id) return NextResponse.json({ ok: false, error: 'Vacancy id is required' }, { status: 400 });
  const { error } = await supabase.from('vacancies').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
