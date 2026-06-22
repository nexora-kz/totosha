import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

export async function GET() {
  const file = path.join(process.cwd(), 'public', 'premium', 'hero-kazakh-child.webp.b64');
  const base64 = (await readFile(file, 'utf8')).trim();
  const image = Buffer.from(base64, 'base64');

  return new Response(image, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
