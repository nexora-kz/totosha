import { NextResponse } from 'next/server';
import { TOTOSHA_BUILD_DATE, TOTOSHA_VERSION } from '../../../lib/totoshaConfig';

function ready(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

export async function GET() {
  const checks = {
    site: true,
    telegram: ready(process.env.TELEGRAM_BOT_TOKEN) && ready(process.env.TELEGRAM_CHAT_ID),
    supabase: ready(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      ready(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    production: process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production',
  };

  return NextResponse.json({
    ok: Object.values(checks).every(Boolean),
    service: 'totosha-site',
    version: TOTOSHA_VERSION,
    buildDate: TOTOSHA_BUILD_DATE,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    deploymentUrl: process.env.VERCEL_URL || 'unknown',
    checkedAt: new Date().toISOString(),
    checks,
  });
}
