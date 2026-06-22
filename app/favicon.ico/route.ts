const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#f7f2e8"/>
  <rect x="8" y="8" width="48" height="48" rx="13" fill="#244b42"/>
  <circle cx="24" cy="23" r="6" fill="#e9b872"/>
  <circle cx="40" cy="23" r="6" fill="#d98769"/>
  <rect x="18" y="33" width="28" height="15" rx="6" fill="#fff"/>
  <path d="M27 37h10v4h-3v8h-4v-8h-3z" fill="#244b42"/>
</svg>`;

export const dynamic = 'force-static';

export function GET() {
  return new Response(favicon, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
