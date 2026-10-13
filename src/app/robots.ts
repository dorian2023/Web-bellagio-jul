import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mueblesbellagio.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
