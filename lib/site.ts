export const siteConfig = {
  name: "Product Share India",
  shortName: "Product Share",
  description:
    "Create digital catalogs, restaurant menus, and shareable product pages for your business in minutes.",
  url: "https://productshare.in",
  locale: "en_IN",
  category: "Business Tools",
  supportEmail: "productshareindia@gmail.com",
  supportPhone: "+91 8589920409",
  supportPhoneHref: "+918589920409",
  supportWhatsAppNumber: "918589920409",
  supportHours: "Mon-Fri, 9am-5pm IST",
  twitterHandle: "@Hadi_Razal",
  keywords: [
    "digital catalog builder India",
    "restaurant menu builder",
    "product catalog maker",
    "WhatsApp catalog sharing",
    "catalog builder for small business",
    "online catalog builder India",
    "QR code catalog",
    "digital menu creator",
    "storefront builder",
    "catalog website for shops",
  ],
} as const;

export const absoluteUrl = (path = "/") => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(path, siteConfig.url).toString();
};

export const defaultOgImage = absoluteUrl("/opengraph-image");
