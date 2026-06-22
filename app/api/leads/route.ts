import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type LeadPayload = {
  name?: string;
  phone?: string;
  intent?: string;
  comment?: string;
  source?: string;
  date?: string;
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

function clean(value: unknown) {
  return String(value || '').trim();
}

function telegramText(lead: Lead) {
  const comment = lead.comment ? lead.comment : 'Без комментария';
  const created = new Date(lead.created_at).toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });

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
    return { sent: false, reason: 'Telegram не настроен' };
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
      const body = await response.text();
      return { sent: false, reason: body || `Telegram HTTP ${response.status}` };
    }

    return { sent: true };
  } catch (error) {
    return { sent: false, reason: error instanceof Error ? error.message : 'Telegram error' };
  }
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный формат заявки' }, { status: 400 });
  }

  const lead: Lead = {
    name: clean(payload.name),
    phone: clean(payload.phone),
    intent: clean(payload.intent || 'Заявка с сайта'),
    comment: clean(payload.comment),
    source: clean(payload.source || 'totoshakids.kz'),
    status: 'new',
    created_at: payload.date || new Date().toISOString(),
  };

  if (!lead.name || !lead.phone) {
    return NextResponse.json({ ok: false, error: 'Имя и телефон обязательны' }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let stored = false;
  let storageReason = '';

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from('leads').insert(lead);

    if (error) {
      storageReason = error.message;
    } else {
      stored = true;
    }
  } else {
    storageReason = 'Supabase не настроен на сервере';
  }

  const telegram = await notifyTelegram(lead);
  const delivered = stored || telegram.sent;

  return NextResponse.json(
    {
      ok: delivered,
      stored,
      storageReason: stored ? undefined : storageReason,
      telegram,
      error: delivered ? undefined : 'Заявка не была доставлена автоматически',
    },
    { status: delivered ? 200 : 503 },
  );
}
