import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type LeadPayload = {
  name?: string;
  phone?: string;
  intent?: string;
  comment?: string;
  source?: string;
  website?: string;
};

type Lead = {
  name: string;
  phone: string;
  intent: string;
  comment: string;
  source: string;
  status: string;
  created_at: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  var totoshaLeadRateLimit: Map<string, RateLimitEntry> | undefined;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = globalThis.totoshaLeadRateLimit ?? new Map<string, RateLimitEntry>();
globalThis.totoshaLeadRateLimit = rateLimitStore;

function clean(value: unknown, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function formatPhone(value: unknown) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length !== 11 || digits[0] !== '7') return null;
  return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return current.count > RATE_LIMIT_MAX;
}

function telegramText(lead: Lead) {
  const comment = lead.comment ? lead.comment : 'Без комментария';
  const created = new Date(lead.created_at).toLocaleString('ru-RU', { timeZone: 'Asia/Qyzylorda' });

  return [
    '🧸 Новая заявка с сайта Тотоша',
    '',
    `👤 Имя: ${lead.name}`,
    `📞 Телефон: ${lead.phone}`,
    `🎯 Запрос: ${lead.intent}`,
    `💬 Комментарий: ${comment}`,
    `🌐 Источник: ${lead.source}`,
    `🕒 Время: ${created}`,
    '',
    'Ответственный: Айшагуль Галымжановна',
  ].join('\n');
}

async function notifyTelegram(lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { sent: false };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramText(lead),
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      console.error('TOTOSHA Telegram lead delivery failed', response.status, await response.text());
      return { sent: false };
    }

    return { sent: true };
  } catch (error) {
    console.error('TOTOSHA Telegram lead delivery error', error);
    return { sent: false };
  }
}

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ ok: false, error: 'Ожидается JSON' }, { status: 415 });
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Слишком много обращений. Попробуйте немного позже или напишите в WhatsApp.' },
      { status: 429 },
    );
  }

  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный формат заявки' }, { status: 400 });
  }

  if (clean(payload.website, 200)) {
    return NextResponse.json({ ok: true, accepted: true }, { status: 202 });
  }

  const name = clean(payload.name, 80);
  const phone = formatPhone(payload.phone);
  const intent = clean(payload.intent || 'Заявка с сайта', 120);
  const comment = clean(payload.comment, 1000);
  const source = clean(payload.source || 'totoshakids.kz', 120);

  if (name.length < 2 || !phone) {
    return NextResponse.json({ ok: false, error: 'Проверьте имя и номер телефона' }, { status: 400 });
  }

  const lead: Lead = {
    name,
    phone,
    intent,
    comment,
    source,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let stored = false;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from('leads').insert(lead);

    if (error) {
      console.error('TOTOSHA Supabase lead storage failed', error.message);
    } else {
      stored = true;
    }
  } else {
    console.error('TOTOSHA Supabase lead storage is not configured');
  }

  const telegram = await notifyTelegram(lead);
  const delivered = stored || telegram.sent;

  return NextResponse.json(
    {
      ok: delivered,
      accepted: delivered,
      stored,
      telegram,
      error: delivered ? undefined : 'Заявка не была доставлена автоматически',
    },
    { status: delivered ? 200 : 503 },
  );
}
