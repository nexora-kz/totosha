import { NextResponse } from 'next/server';
import { loadPublicVacancies } from '../../../../lib/vacancySources';

export async function GET() {
  const vacancies = await loadPublicVacancies();
  return NextResponse.json({ ok: true, vacancies }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
    },
  });
}
