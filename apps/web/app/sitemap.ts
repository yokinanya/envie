import type { MetadataRoute } from 'next'
import {
  getGuideBasePath,
  getGuideHref,
  getGuidePages,
  guideLocales,
} from './guide/guide-pages';

function createSitemapEntry(url: string, priority: number): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority,
  };
}

function getGuideRoutes(baseUrl: string): MetadataRoute.Sitemap {
  return guideLocales.flatMap((locale) => {
    const guidePages = getGuidePages(locale);
    const routes: MetadataRoute.Sitemap = [
      createSitemapEntry(`${baseUrl}${getGuideBasePath(locale)}`, 0.9),
    ];

    for (const page of guidePages) {
      routes.push(createSitemapEntry(`${baseUrl}${getGuideHref(locale, page.slug)}`, 1.0));
      if (!page.children) continue;

      routes.push(
        ...page.children.map((child) =>
          createSitemapEntry(`${baseUrl}${getGuideHref(locale, page.slug, child.slug)}`, 0.9),
        ),
      );
    }

    return routes;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // Base URLs
  const baseUrl = 'https://web.envie.cloud';
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getGuideRoutes(baseUrl),
    {
      url: `${baseUrl}/onboarding`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];
  

  return [...staticRoutes];
}
