import type { IConfig } from 'next-sitemap';

const config: IConfig = {
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
  transform: async (config, path) => {
    const priorities: Record<string, number> = {
      '/': 1.0,
      '/what-is-product-share': 0.95,
      '/solutions': 0.9,
      '/pricing': 0.9,
      '/solutions/whatsapp-catalog': 0.85,
      '/solutions/digital-menu': 0.85,
      '/solutions/online-catalogue': 0.85,
      '/solutions/small-business': 0.8,
      '/guides/create-a-digital-catalog': 0.8,
      '/faq': 0.8,
      '/about-us': 0.75,
      '/contact': 0.7,
    };
    const changefreqs: Record<string, IConfig['changefreq']> = {
      '/': 'weekly',
      '/pricing': 'weekly',
      '/solutions': 'weekly',
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
