import { NextRequest, NextResponse } from 'next/server';
import { TOTOSHA_BUILD_DATE, TOTOSHA_CONTACTS, TOTOSHA_VERSION } from '../../../lib/totoshaConfig';

const SITE_URL = 'https://www.totoshakids.kz';

type PageCheck = {
  path: string;
  status: number | null;
  ok: boolean;
  requiredText?: string;
  reason?: string;
  ms: number;
};

function ready(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

async function checkPage(path: string, requiredText?: string): Promise<PageCheck> {
  const started = Date.now();
  try {
    const response = await fetch(`${SITE_URL}${path}`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'TOTOSHA-Release-Gate/1.0',
      },
    });
    const text = await response.text();
    const hasText = requiredText ? text.includes(requiredText) : true;

    return {
      path,
      status: response.status,
      ok: response.ok && hasText,
      requiredText,
      reason: response.ok ? (hasText ? 'ok' : `required text not found: ${requiredText}`) : `http ${response.status}`,
      ms: Date.now() - started,
    };
  } catch (error) {
    return {
      path,
      status: null,
      ok: false,
      requiredText,
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
    checkPage('/', 'Тотоша'),
    checkPage('/life', 'Жизнь Тотоша'),
    checkPage('/contacts', TOTOSHA_CONTACTS.phoneDisplay),
    checkPage('/about', 'Тотоша'),
    checkPage('/programs', 'Программы'),
    checkPage('/parents', 'Родителям'),
    checkPage('/cabinet', 'Цифровой кабинет'),
    checkPage('/franchise', 'Франшиза'),
    checkPage('/sitemap.xml', 'https://www.totoshakids.kz/contacts'),
    checkPage('/robots.txt', 'Sitemap: https://www.totoshakids.kz/sitemap.xml'),
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
    buildDate: TOTOSHA_BUILD_DATE,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    checkedAt: new Date().toISOString(),
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
