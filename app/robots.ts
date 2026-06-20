import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/totosha-media/'],
      },
    ],
    sitemap: 'https://www.totoshakids.kz/sitemap.xml',
    host: 'https://www.totoshakids.kz',
  };
}
