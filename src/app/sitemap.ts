import { MetadataRoute } from 'next';
import { CATEGORIES_DATA } from '@/src/data/catalogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mueblesbellagio.com';
  const currentDate = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tiendas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic category routes for Google indexing
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES_DATA
    .filter(cat => cat.id !== 'todos')
    .map(cat => ({
      url: `${baseUrl}/catalogo/${cat.id}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [...staticRoutes, ...categoryRoutes];
}
