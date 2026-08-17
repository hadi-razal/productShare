export const siteConfig = {
  name: "Product Share India",
  shortName: "Product Share",
  description:
    "India-based digital catalog builder for local shops, restaurants, and WhatsApp sellers. Launching now.",
  url: "https://productshare.in",
  locale: "en_IN",
  category: "Business Tools",
  supportEmail: "productshareindia@gmail.com",
  supportPhone: "+91 94002 44731",
  supportPhoneHref: "+919400244731",
  supportWhatsAppNumber: "919400244731",
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
