import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.totoshakids.kz';

const routes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/programs', priority: 0.95, changeFrequency: 'monthly' as const },
  { path: '/parents', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/cabinet', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/franchise', priority: 0.75, changeFrequency: 'monthly' as const },
  { path: '/contacts', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/life', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/vacancies', priority: 0.85, changeFrequency: 'daily' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
