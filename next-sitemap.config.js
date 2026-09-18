/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://productshare.in',
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/admin',
    '/admin/*',
    '/store/settings',
    '/store/add-product',
    '/store/edit',
    '/store/edit/*',
    '/store/products',
    '/store/categories',
    '/store/reviews',
    '/store/*/edit/*',
    '/store',
    '/store/*',
    '/api/*',
  ],
};

module.exports = config;
