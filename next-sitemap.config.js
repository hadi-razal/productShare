/** @type {import('next-sitemap').IConfig} */
const config = {
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

module.exports = config;

