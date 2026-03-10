import type { IConfig } from 'next-sitemap';

const config: IConfig = {
  siteUrl: 'https://productshare.in',
  generateRobotsTxt: false, // handled by app/robots.ts (Next.js native)
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/login',
    '/register',
    '/forgot-password',
    '/store/settings',
    '/store/add-product',
    '/store/reviews',
    '/store/*/edit/*',
    '/api/*',
  ],
  transform: async (config, path) => {
    const priorities: Record<string, number> = {
      '/': 1.0,
      '/pricing': 0.9,
      '/about-us': 0.8,
      '/contact': 0.7,
    };
    const changefreqs: Record<string, IConfig['changefreq']> = {
      '/': 'weekly',
      '/pricing': 'weekly',
      '/about-us': 'monthly',
      '/contact': 'monthly',
    };
    return {
      loc: path,
      changefreq: changefreqs[path] ?? config.changefreq,
      priority: priorities[path] ?? config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};

export default config;
