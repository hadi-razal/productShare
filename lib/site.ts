export const siteConfig = {
  name: "Product Share",
  legalName: "Product Share India",
  shortName: "Product Share",
  tagline: "Digital catalogs for businesses worldwide",
  description:
    "Product Share is a global digital catalog and catalogue builder. Create an online product catalog, restaurant menu, or WhatsApp catalog in minutes and share it anywhere — no website required.",
  longDescription:
    "Product Share is catalog software for shops, restaurants, creators, and WhatsApp or Instagram sellers. Publish a branded online catalogue with photos, prices, and a shareable link. Customers open it on any phone. Founded in Kerala, India by Duoph Technologies, the product is built for businesses everywhere.",
  url: "https://productshare.in",
  locale: "en_US",
  alternateLocales: ["en_IN", "en_GB", "en_AU", "en_CA"],
  language: "en",
  category: "Business Tools",
  classification: "Digital Catalog and Catalogue Software",
  foundingDate: "2023",
  foundingLocation: "Kerala, India",
  areaServed: "Worldwide",
  parentOrganization: {
    name: "Duoph Technologies",
    url: "https://www.duoph.in/",
  },
  supportEmail: "productshareindia@gmail.com",
  supportPhone: "+91 94002 44731",
  supportPhoneHref: "+919400244731",
  supportWhatsAppNumber: "919400244731",
  supportHours: "Mon-Fri, 9am-5pm IST",
  twitterHandle: "@Hadi_Razal",
  sameAs: [
    "https://twitter.com/Hadi_Razal",
    "https://www.duoph.in/",
  ],
  keywords: [
    "digital catalog builder",
    "digital catalogue software",
    "online product catalog",
    "online product catalogue",
    "product catalog maker",
    "product catalogue maker",
    "WhatsApp catalog",
    "WhatsApp business catalog",
    "Instagram product catalog",
    "digital restaurant menu",
    "QR code menu",
    "QR code catalog",
    "shareable product catalog",
    "catalog website builder",
    "no-code storefront",
    "online catalog for small business",
    "mobile product catalog",
    "digital lookbook",
    "wholesale catalog software",
    "PDF catalog alternative",
    "create online catalog",
    "Product Share",
    "Product Share India",
  ],
} as const;

export const absoluteUrl = (path = "/") => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path, siteConfig.url).toString();
};

export const defaultOgImage = absoluteUrl("/opengraph-image");
