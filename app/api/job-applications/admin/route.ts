import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CRM_SESSION_COOKIE, verifyCrmSessionToken } from '../../../../lib/crmAuth';
import { getCrmSupabase } from '../../../../lib/crmSupabase';

async function authorized() {
  const store = await cookies();
  return verifyCrmSessionToken(store.get(CRM_SESSION_COOKIE)?.value);
}

function clean(value: unknown, max = 3000) {
  return String(value || '').trim().slice(0, max);
}

export async function GET(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const supabase = getCrmSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });

  const url = new URL(request.url);
  const status = clean(url.searchParams.get('status'), 40);
  let query = supabase.from('job_applications').select('*').order('created_at', { ascending: false }).limit(250);
  if (status && status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, applications: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const supabase = getCrmSupabase();
  if (!supabase) return NextResponse.json({ ok: false, error: 'Supabase is not configured' }, { status: 503 });

  const body = await request.json().catch(() => null) as null | Record<string, unknown>;
  const id = clean(body?.id, 100);
  if (!id) return NextResponse.json({ ok: false, error: 'Application id is required' }, { status: 400 });
  const status = clean(body?.status, 40);
  const notes = clean(body?.notes, 4000);
  const assignedTo = clean(body?.assignedTo, 120);
  const { data, error } = await supabase.from('job_applications').update({
    status: status || 'new',
    notes: notes || null,
    assigned_to: assignedTo || null,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select('*').single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, application: data });
}
