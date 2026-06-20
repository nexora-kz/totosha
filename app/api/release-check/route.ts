import { NextRequest, NextResponse } from 'next/server';
import { TOTOSHA_BUILD_DATE, TOTOSHA_CONTACTS, TOTOSHA_VERSION } from '../../../lib/totoshaConfig';

const SITE_URL = 'https://www.totoshakids.kz';

const REQUIRED_PAGES = [
  { path: '/', marker: 'Тотоша' },
  { path: '/about', marker: 'Тотоша' },
  { path: '/programs', marker: 'Программы' },
  { path: '/parents', marker: 'Родителям' },
  { path: '/cabinet', marker: 'Цифровой кабинет' },
  { path: '/franchise', marker: 'Франшиза' },
  { path: '/contacts', marker: TOTOSHA_CONTACTS.phoneDisplay },
  { path: '/life', marker: 'Жизнь Тотоша' },
] as const;

type PageCheck = {
  path: string;
  status: number | null;
  ok: boolean;
  requiredText?: string;
  requiredAny?: string[];
  reason?: string;
  ms: number;
};

function ready(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

async function checkPage(path: string, requiredText?: string, requiredAny?: string[]): Promise<PageCheck> {
  const started = Date.now();
  try {
    const response = await fetch(`${SITE_URL}${path}`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'TOTOSHA-Release-Gate/1.2',
      },
    });
    const text = await response.text();
    const hasText = requiredText ? text.includes(requiredText) : true;
    const hasAny = requiredAny && requiredAny.length > 0 ? requiredAny.some((item) => text.includes(item)) : true;
    const ok = response.ok && hasText && hasAny;

    return {
      path,
      status: response.status,
      ok,
      requiredText,
      requiredAny,
      reason: ok
        ? 'ok'
        : response.ok
          ? `required marker not found${requiredText ? `: ${requiredText}` : ''}${requiredAny ? ` / any: ${requiredAny.join(' | ')}` : ''}`
          : `http ${response.status}`,
      ms: Date.now() - started,
    };
  } catch (error) {
    return {
      path,
      status: null,
      ok: false,
      requiredText,
      requiredAny,
      reason: error instanceof Error ? error.message : 'unknown fetch error',
      ms: Date.now() - started,
    };
  }
}

export async function GET(request: NextRequest) {
  const expectedCommit = request.nextUrl.searchParams.get('commit') || '';
  const liveCommit = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
  const commitMatches = expectedCommit ? liveCommit.startsWith(expectedCommit) : liveCommit !== 'unknown';

  const telegramReady = ready(process.env.TELEGRAM_BOT_TOKEN) && ready(process.env.TELEGRAM_CHAT_ID);
  const supabaseReady = ready(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    ready(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const checks = await Promise.all([
    ...REQUIRED_PAGES.map((item) => checkPage(item.path, item.marker)),
    checkPage('/sitemap.xml', undefined, ['totoshakids.kz', '/about', '/programs', '/contacts', '<urlset', '<sitemapindex']),
    checkPage('/robots.txt', undefined, ['sitemap.xml', 'Sitemap', 'User-agent', 'User-Agent']),
    checkPage('/api/health', 'totosha-site'),
  ]);

  const pagesOk = checks.every((item) => item.ok);
  const ok = pagesOk && commitMatches && telegramReady && supabaseReady;

  return NextResponse.json({
    ok,
    gate: ok ? 'pass' : 'fail',
    service: 'totosha-release-gate',
    site: SITE_URL,
    version: TOTOSHA_VERSION,
    stable: TOTOSHA_VERSION === 'v037',
    buildDate: TOTOSHA_BUILD_DATE,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    checkedAt: new Date().toISOString(),
    requiredPages: REQUIRED_PAGES.map((item) => item.path),
    commit: {
      expected: expectedCommit || null,
      live: liveCommit,
      matches: commitMatches,
    },
    integrations: {
      telegram: telegramReady ? 'ready' : 'not_configured',
      supabase: supabaseReady ? 'ready' : 'not_configured',
    },
    summary: {
      total: checks.length,
      passed: checks.filter((item) => item.ok).length,
      failed: checks.filter((item) => !item.ok).length,
    },
    checks,
  }, {
    status: ok ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
