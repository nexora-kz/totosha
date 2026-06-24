import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type ApplicationPayload = {
  name?: string;
  phone?: string;
  vacancyId?: string;
  vacancyTitle?: string;
  experience?: string;
  resumeUrl?: string;
  comment?: string;
  source?: string;
  website?: string;
};

type RateEntry = { count: number; resetAt: number };
const rateStore = new Map<string, RateEntry>();
const duplicateStore = new Map<string, number>();

function clean(value: unknown, max = 1000) {
  return String(value || '').trim().slice(0, max);
}

function phone(value: unknown) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length !== 11 || digits[0] !== '7') return null;
  return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
}

function ip(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function limited(key: string) {
  const now = Date.now();
  const entry = rateStore.get(key);
  if (!entry || entry.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  rateStore.set(key, entry);
  return entry.count > 5;
}

function supabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function telegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  if (limited(ip(request))) {
    return NextResponse.json({ ok: false, error: 'Слишком много обращений. Повторите позже.' }, { status: 429, headers });
  }

  const payload = await request.json().catch(() => null) as ApplicationPayload | null;
  if (!payload) return NextResponse.json({ ok: false, error: 'Некорректная анкета.' }, { status: 400, headers });
  if (clean(payload.website, 100)) return NextResponse.json({ ok: true, accepted: true }, { status: 202, headers });

  const name = clean(payload.name, 100);
  const formattedPhone = phone(payload.phone);
  const vacancyId = clean(payload.vacancyId, 120) || 'talent-pool';
  const vacancyTitle = clean(payload.vacancyTitle, 180) || 'Кадровый резерв Тотоша';
  const experience = clean(payload.experience, 2000);
  const resumeUrl = clean(payload.resumeUrl, 500);
  const comment = clean(payload.comment, 3000);
  const source = clean(payload.source, 120) || 'totoshakids.kz/vacancies';

  if (name.length < 2 || !formattedPhone) {
    return NextResponse.json({ ok: false, error: 'Проверьте имя и номер телефона.' }, { status: 400, headers });
  }

  const duplicateKey = `${formattedPhone}:${vacancyId}`;
  const previous = duplicateStore.get(duplicateKey) || 0;
  if (Date.now() - previous < 60_000) {
    return NextResponse.json({ ok: true, accepted: true, duplicate: true }, { status: 202, headers });
  }
  duplicateStore.set(duplicateKey, Date.now());

  const createdAt = new Date().toISOString();
  const record = {
    name,
    phone: formattedPhone,
    vacancy_id: vacancyId,
    vacancy_title: vacancyTitle,
    experience,
    resume_url: resumeUrl || null,
    comment,
    source,
    status: 'new',
    created_at: createdAt,
    updated_at: createdAt,
  };

  let stored = false;
  const client = supabase();
  if (client) {
    const { error } = await client.from('job_applications').insert(record);
    stored = !error;
    if (error) console.error('TOTOSHA job application storage failed', error.message);
  }

  const sent = await telegram([
    '👩‍🏫 Новый отклик на вакансию Тотоша',
    '',
    `Вакансия: ${vacancyTitle}`,
    `Кандидат: ${name}`,
    `Телефон: ${formattedPhone}`,
    `Опыт: ${experience || 'Не указан'}`,
    `Резюме: ${resumeUrl || 'Ссылка не указана'}`,
    `Комментарий: ${comment || 'Нет'}`,
    `Источник: ${source}`,
  ].join('\n'));

  const delivered = stored || sent;
  return NextResponse.json({
    ok: delivered,
    accepted: delivered,
    stored,
    telegram: sent,
    error: delivered ? undefined : 'Не удалось доставить анкету автоматически.',
  }, { status: delivered ? 200 : 503, headers });
}
