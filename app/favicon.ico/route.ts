const SIZE = 32;

function setUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function setUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

function insideRoundedRect(
  x: number,
  y: number,
  left: number,
  top: number,
  right: number,
  bottom: number,
  radius: number,
) {
  const cx = Math.max(left + radius, Math.min(x, right - radius));
  const cy = Math.max(top + radius, Math.min(y, bottom - radius));
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function createFavicon() {
  const pixelBytes = SIZE * SIZE * 4;
  const maskRowBytes = Math.ceil(SIZE / 32) * 4;
  const maskBytes = maskRowBytes * SIZE;
  const imageBytes = 40 + pixelBytes + maskBytes;
  const bytes = new Uint8Array(6 + 16 + imageBytes);
  const view = new DataView(bytes.buffer);

  setUint16(view, 0, 0);
  setUint16(view, 2, 1);
  setUint16(view, 4, 1);

  bytes[6] = SIZE;
  bytes[7] = SIZE;
  bytes[8] = 0;
  bytes[9] = 0;
  setUint16(view, 10, 1);
  setUint16(view, 12, 32);
  setUint32(view, 14, imageBytes);
  setUint32(view, 18, 22);

  setUint32(view, 22, 40);
  setUint32(view, 26, SIZE);
  setUint32(view, 30, SIZE * 2);
  setUint16(view, 34, 1);
  setUint16(view, 36, 32);
  setUint32(view, 38, 0);
  setUint32(view, 42, pixelBytes);
  setUint32(view, 46, 0);
  setUint32(view, 50, 0);
  setUint32(view, 54, 0);
  setUint32(view, 58, 0);

  const pixelOffset = 62;

  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      let red = 247;
      let green = 242;
      let blue = 232;
      let alpha = 255;

      if (insideRoundedRect(x, y, 4, 4, 27, 27, 6)) {
        red = 36;
        green = 75;
        blue = 66;
      }

      const leftDot = (x - 12) ** 2 + (y - 11) ** 2 <= 9;
      const rightDot = (x - 20) ** 2 + (y - 11) ** 2 <= 9;
      if (leftDot) {
        red = 233;
        green = 184;
        blue = 114;
      }
      if (rightDot) {
        red = 217;
        green = 135;
        blue = 105;
      }

      if (insideRoundedRect(x, y, 9, 16, 22, 24, 3)) {
        red = 255;
        green = 255;
        blue = 255;
      }

      if ((x >= 14 && x <= 17 && y >= 18 && y <= 24) ||
          (x >= 12 && x <= 19 && y >= 18 && y <= 20)) {
        red = 36;
        green = 75;
        blue = 66;
      }

      const row = SIZE - 1 - y;
      const offset = pixelOffset + (row * SIZE + x) * 4;
      bytes[offset] = blue;
      bytes[offset + 1] = green;
      bytes[offset + 2] = red;
      bytes[offset + 3] = alpha;
    }
  }

  return bytes;
}

export const runtime = 'nodejs';
export const dynamic = 'force-static';

export function GET() {
  return new Response(createFavicon(), {
    status: 200,
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
