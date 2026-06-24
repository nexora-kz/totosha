import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CRM_SESSION_COOKIE, CRM_SESSION_MAX_AGE, createCrmSessionToken, isCrmAuthConfigured, verifyCrmPassword, verifyCrmSessionToken } from '../../../../lib/crmAuth';

export async function GET() {
  const store = await cookies();
  return NextResponse.json({
    ok: true,
    configured: isCrmAuthConfigured(),
    authenticated: verifyCrmSessionToken(store.get(CRM_SESSION_COOKIE)?.value),
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!isCrmAuthConfigured()) return NextResponse.json({ ok: false, error: 'CRM access is not configured' }, { status: 503 });
  const body = await request.json().catch(() => null) as null | { password?: string };
  if (!verifyCrmPassword(body?.password)) return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CRM_SESSION_COOKIE, createCrmSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: CRM_SESSION_MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CRM_SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
