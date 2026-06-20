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

function clean(value: unknown) {
  return String(value || '').trim();
}

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный формат заявки' }, { status: 400 });
  }

  const lead = {
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

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ ok: true, stored: false, reason: 'Supabase не настроен на сервере', lead }, { status: 202 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from('leads').insert(lead);

  if (error) {
    return NextResponse.json({ ok: true, stored: false, reason: error.message, lead }, { status: 202 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
