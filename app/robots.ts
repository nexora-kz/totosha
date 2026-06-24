import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/totosha-media/', '/admin', '/office', '/crm'],
      },
    ],
    sitemap: 'https://www.totoshakids.kz/sitemap-totosha.xml',
    host: 'https://www.totoshakids.kz',
  };
}
