export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const assetUrl = new URL('/premium/hero-kazakh-child.webp.b64', request.url);
  const source = await fetch(assetUrl, { cache: 'force-cache' });

  if (!source.ok) {
    return new Response('Generated image source is unavailable', { status: 502 });
  }

  const base64 = (await source.text()).trim();
  const image = Buffer.from(base64, 'base64');

  return new Response(image, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': String(image.byteLength),
    },
  });
}
