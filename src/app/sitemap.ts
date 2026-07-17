import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://patentradar.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://patentradar.vercel.app/solve', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://patentradar.vercel.app/saved', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://patentradar.vercel.app/settings', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
