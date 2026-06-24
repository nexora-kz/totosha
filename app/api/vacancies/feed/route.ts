import { NextResponse } from 'next/server';
import { loadInternalVacancies } from '../../../../lib/vacancySources';

function escapeXml(value: unknown) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'xml';
  const vacancies = await loadInternalVacancies();

  if (format === 'json') {
    return NextResponse.json({
      employer: 'Детский сад Тотоша',
      website: 'https://www.totoshakids.kz',
      generatedAt: new Date().toISOString(),
      vacancies,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' },
    });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<vacancies generated_at="${new Date().toISOString()}">\n${vacancies.map((vacancy) => `  <vacancy>\n    <id>${escapeXml(vacancy.id)}</id>\n    <title>${escapeXml(vacancy.title)}</title>\n    <description>${escapeXml(vacancy.summary)}</description>\n    <employment>${escapeXml(vacancy.employment)}</employment>\n    <schedule>${escapeXml(vacancy.schedule)}</schedule>\n    <location>${escapeXml(vacancy.location)}</location>\n    <salary_from>${escapeXml(vacancy.salaryFrom || '')}</salary_from>\n    <salary_to>${escapeXml(vacancy.salaryTo || '')}</salary_to>\n    <currency>${escapeXml(vacancy.currency || 'KZT')}</currency>\n    <url>https://www.totoshakids.kz/vacancies#${escapeXml(vacancy.slug)}</url>\n  </vacancy>`).join('\n')}\n</vacancies>`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
    },
  });
}
