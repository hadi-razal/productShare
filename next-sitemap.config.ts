import type { IConfig } from 'next-sitemap';

const config: IConfig = {
  siteUrl: 'https://productshare.in',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://productshare.in/sitemap.xml',
    ],
  },
};

export default config;
