import { createHmac, timingSafeEqual } from 'node:crypto';

export const CRM_SESSION_COOKIE = 'totosha_crm_session';
export const CRM_SESSION_MAX_AGE = 12 * 60 * 60;

function authPassword() {
  return process.env.TOTOSHA_CRM_ADMIN_PASSWORD || '';
}

function sessionSecret() {
  return process.env.TOTOSHA_CRM_SESSION_SECRET || authPassword();
}

function sign(value: string) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isCrmAuthConfigured() {
  return authPassword().length >= 10 && sessionSecret().length >= 10;
}

export function verifyCrmPassword(value: unknown) {
  if (!isCrmAuthConfigured()) return false;
  return safeEqual(String(value || ''), authPassword());
}

export function createCrmSessionToken() {
  if (!isCrmAuthConfigured()) throw new Error('CRM authentication is not configured');
  const payload = Buffer.from(JSON.stringify({
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + CRM_SESSION_MAX_AGE,
  })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyCrmSessionToken(token: string | undefined | null) {
  if (!token || !isCrmAuthConfigured()) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return parsed.role === 'admin' && Number(parsed.exp || 0) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
