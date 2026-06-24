import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CRM_SESSION_COOKIE, verifyCrmSessionToken } from '../../../../lib/crmAuth';
import { getCrmSupabase, isCrmDataConfigured } from '../../../../lib/crmSupabase';

const STATUSES = ['new', 'contacted', 'excursion_scheduled', 'excursion_done', 'waiting', 'enrolled', 'rejected'];

async function authorized() {
  const store = await cookies();
  return verifyCrmSessionToken(store.get(CRM_SESSION_COOKIE)?.value);
}

function clean(value: unknown, length = 1000) {
  return String(value || '').trim().slice(0, length);
}

export async function GET(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  if (!isCrmDataConfigured()) return NextResponse.json({ ok: false, error: 'Supabase service access is not configured' }, { status: 503 });

  const url = new URL(request.url);
  const status = clean(url.searchParams.get('status'), 40);
  const search = clean(url.searchParams.get('q'), 80).replace(/[,%()]/g, ' ');
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 100), 1), 250);
  const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0);
  const supabase = getCrmSupabase();

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== 'all') query = query.eq('status', status);
  if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,intent.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, leads: data || [], count: count || 0 }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  if (!isCrmDataConfigured()) return NextResponse.json({ ok: false, error: 'Supabase service access is not configured' }, { status: 503 });

  const body = await request.json().catch(() => null) as null | Record<string, unknown>;
  const id = clean(body?.id, 100);
  const action = clean(body?.action, 30);
  if (!id) return NextResponse.json({ ok: false, error: 'Lead id is required' }, { status: 400 });

  const supabase = getCrmSupabase();
  if (action === 'convert') {
    const { data: lead, error: leadError } = await supabase.from('leads').select('*').eq('id', id).single();
    if (leadError || !lead) return NextResponse.json({ ok: false, error: leadError?.message || 'Lead not found' }, { status: 404 });

    const { error: draftError } = await supabase.from('crm_child_drafts').upsert({
      lead_id: String(id),
      parent_name: lead.name || '',
      phone: lead.phone || '',
      child_age: lead.child_age || null,
      source: lead.source || '',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'lead_id' });
    if (draftError) return NextResponse.json({ ok: false, error: draftError.message }, { status: 500 });

    await supabase.from('leads').update({ status: 'enrolled', updated_at: new Date().toISOString() }).eq('id', id);
    await supabase.from('lead_events').insert({ lead_id: String(id), event_type: 'converted', details: 'Создан черновик карточки ребёнка' });
    return NextResponse.json({ ok: true, converted: true });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const status = clean(body?.status, 40);
  if (status) {
    if (!STATUSES.includes(status)) return NextResponse.json({ ok: false, error: 'Invalid status' }, { status: 400 });
    update.status = status;
    if (status === 'contacted') update.last_contact_at = new Date().toISOString();
  }
  if ('assigned_to' in (body || {})) update.assigned_to = clean(body?.assigned_to, 120) || null;
  if ('child_age' in (body || {})) update.child_age = clean(body?.child_age, 40) || null;
  if ('notes' in (body || {})) update.notes = clean(body?.notes, 4000) || null;
  if ('next_follow_up_at' in (body || {})) update.next_follow_up_at = clean(body?.next_follow_up_at, 40) || null;

  const { data, error } = await supabase.from('leads').update(update).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  await supabase.from('lead_events').insert({
    lead_id: String(id),
    event_type: status ? 'status_changed' : 'lead_updated',
    details: status || 'Обновлены данные заявки',
  });
  return NextResponse.json({ ok: true, lead: data });
}
