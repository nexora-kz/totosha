import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CRM_SESSION_COOKIE, verifyCrmSessionToken } from '../../../../lib/crmAuth';
import { getCrmSupabase } from '../../../../lib/crmSupabase';
import { loadHhVacancies } from '../../../../lib/vacancySources';

async function authorized() {
  const store = await cookies();
  return verifyCrmSessionToken(store.get(CRM_SESSION_COOKIE)?.value);
}

function baseUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.totoshakids.kz';
  try { return new URL(configured).origin; } catch { return new URL(request.url).origin; }
}

export async function GET(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  const hhVacancies = await loadHhVacancies();
  const origin = baseUrl(request);
  return NextResponse.json({
    ok: true,
    channels: [
      {
        id: 'hh',
        name: 'hh.kz / HeadHunter',
        mode: 'api',
        configured: Boolean(process.env.HH_EMPLOYER_ID),
        importedVacancies: hhVacancies.length,
        note: process.env.HH_EMPLOYER_ID ? 'Автоматический импорт активных вакансий готов.' : 'Нужно указать HH_EMPLOYER_ID работодателя.',
      },
      {
        id: 'enbek',
        name: 'Enbek.kz',
        mode: 'feed',
        configured: true,
        externalUrl: process.env.ENBEK_EMPLOYER_URL || 'https://www.enbek.kz/',
        note: 'Подготовлен единый XML/JSON-экспорт для передачи вакансий.',
      },
      {
        id: 'rabota',
        name: 'Rabota.kz',
        mode: 'feed',
        configured: true,
        externalUrl: process.env.RABOTA_EMPLOYER_URL || 'https://rabota.kz/',
        note: 'Подготовлен единый XML/JSON-экспорт и ссылка на кабинет работодателя.',
      },
      {
        id: 'feed',
        name: 'Универсальный feed',
        mode: 'feed',
        configured: true,
        xmlUrl: `${origin}/api/vacancies/feed?format=xml`,
        jsonUrl: `${origin}/api/vacancies/feed?format=json`,
        note: 'Можно передавать агрегаторам и партнёрским сервисам.',
      },
    ],
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null) as null | { action?: string };
  if (body?.action !== 'sync_hh') return NextResponse.json({ ok: false, error: 'Unknown action' }, { status: 400 });

  const hhVacancies = await loadHhVacancies();
  if (!process.env.HH_EMPLOYER_ID) {
    return NextResponse.json({ ok: false, error: 'HH_EMPLOYER_ID is not configured' }, { status: 503 });
  }

  const supabase = getCrmSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });

  const records = hhVacancies.map((vacancy, index) => ({
    slug: vacancy.slug,
    title: vacancy.title,
    summary: vacancy.summary,
    responsibilities: vacancy.responsibilities,
    requirements: vacancy.requirements,
    conditions: vacancy.conditions,
    employment: vacancy.employment,
    schedule: vacancy.schedule,
    location: vacancy.location,
    salary_from: vacancy.salaryFrom,
    salary_to: vacancy.salaryTo,
    currency: vacancy.currency,
    source: 'hh',
    external_id: vacancy.externalId,
    external_url: vacancy.externalUrl,
    published_at: vacancy.publishedAt,
    active: true,
    sort_order: index + 100,
    updated_at: new Date().toISOString(),
  }));

  if (records.length) {
    const { error } = await supabase.from('vacancies').upsert(records, { onConflict: 'external_id' });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, imported: records.length });
}
