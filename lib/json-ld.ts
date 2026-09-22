import {
  PLANS,
  YEARLY_DISCOUNT_PERCENT,
  yearlyPriceInr,
} from "@/lib/pricing";
import {
  homeFaqs,
  howToSteps,
  knowsAbout,
  type FaqItem,
} from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { StorefrontProduct, StorefrontStore } from "@/lib/storefront";

export const organizationId = `${siteConfig.url}/#organization`;
export const websiteId = `${siteConfig.url}/#website`;
export const softwareId = `${siteConfig.url}/#software`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "OnlineBusiness"],
    "@id": organizationId,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: ["Product Share India", "ProductShare", "productshare.in"],
    url: siteConfig.url,
    logo: absoluteUrl("/icon.png"),
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.longDescription,
    email: siteConfig.supportEmail,
    telephone: siteConfig.supportPhone,
    foundingDate: siteConfig.foundingDate,
    knowsAbout: [...knowsAbout],
    areaServed: {
      "@type": "Place",
      name: siteConfig.areaServed,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.supportPhone,
      email: siteConfig.supportEmail,
      contactType: "customer support",
      availableLanguage: ["English", "Hindi", "Malayalam"],
      areaServed: "Worldwide",
    },
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.parentOrganization.name,
      url: siteConfig.parentOrganization.url,
    },
    sameAs: [...siteConfig.sameAs],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": organizationId },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": softwareId,
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    operatingSystem: "Web Browser",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Digital catalog and catalogue builder",
    url: siteConfig.url,
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.longDescription,
    featureList: [
      "Online product catalog and catalogue",
      "WhatsApp catalog sharing",
      "Digital restaurant menu and QR code menu",
      "Branded no-code storefront",
      "Product photos, videos, prices, and variants",
      "Catalog analytics",
    ],
    audience: {
      "@type": "Audience",
      audienceType:
        "Shops, restaurants, WhatsApp sellers, Instagram sellers, and small businesses worldwide",
    },
    creator: { "@id": organizationId },
    offers: [
      {
        "@type": "Offer",
        name: "Plus Monthly",
        price: String(PLANS.plus.monthlyPriceInr),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl("/pricing"),
        description: `Up to ${PLANS.plus.productLimit} product listings and 3 storefront themes`,
      },
      {
        "@type": "Offer",
        name: "Plus Yearly",
        price: String(yearlyPriceInr(PLANS.plus.monthlyPriceInr)),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl("/pricing"),
        description: `Plus billed annually. ${YEARLY_DISCOUNT_PERCENT}% off upfront yearly payment.`,
      },
      {
        "@type": "Offer",
        name: "Pro Monthly",
        price: String(PLANS.pro.monthlyPriceInr),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl("/pricing"),
        description: `Up to ${PLANS.pro.productLimit} product listings and 10+ storefront themes`,
      },
      {
        "@type": "Offer",
        name: "Pro Yearly",
        price: String(yearlyPriceInr(PLANS.pro.monthlyPriceInr)),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: absoluteUrl("/pricing"),
        description: `Pro billed annually. ${YEARLY_DISCOUNT_PERCENT}% off upfront yearly payment.`,
      },
    ],
  };
}

export function faqJsonLd(faqs: FaqItem[] = homeFaqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function howToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to create a digital catalog with Product Share",
    description:
      "Publish an online product catalog, WhatsApp catalogue, or QR code menu without building a website.",
    totalTime: "PT15M",
    supply: [
      { "@type": "HowToSupply", name: "Product photos" },
      { "@type": "HowToSupply", name: "Prices and short descriptions" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Product Share" },
    ],
    step: howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: "url" in step ? step.url : undefined,
    })),
  };
}

export function webPageJsonLd({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": websiteId },
    about: { "@id": softwareId },
    publisher: { "@id": organizationId },
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${absoluteUrl("/about-us")}#webpage`,
    url: absoluteUrl("/about-us"),
    name: "About Product Share",
    description: siteConfig.longDescription,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": websiteId },
    mainEntity: { "@id": organizationId },
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl("/contact")}#webpage`,
    url: absoluteUrl("/contact"),
    name: "Contact Product Share",
    description: `Contact ${siteConfig.name} for catalog support, pricing, and partnerships.`,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": websiteId },
  };
}

export function definedTermSetJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Product Share catalog terms",
    hasDefinedTerm: [
      {
        "@type": "DefinedTerm",
        name: "Digital catalog",
        description:
          "An online product catalog with photos, prices, and a shareable link. Also called a digital catalogue.",
      },
      {
        "@type": "DefinedTerm",
        name: "WhatsApp catalog",
        description:
          "A product catalog designed to be shared in WhatsApp chats, broadcasts, and business profiles.",
      },
      {
        "@type": "DefinedTerm",
        name: "QR code menu",
        description:
          "A digital restaurant menu opened by scanning a QR code at a table, counter, or hotel room.",
      },
    ],
  };
}

export function storeCollectionJsonLd({
  store,
  url,
  products,
}: {
  store: StorefrontStore;
  url: string;
  products: StorefrontProduct[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${store.name} online catalog`,
    description:
      store.description ||
      `Browse ${store.name}'s digital product catalog on Product Share.`,
    url,
    isPartOf: { "@id": websiteId },
    about: {
      "@type": "Organization",
      name: store.name,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 50).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: `${url.replace(/\/$/, "")}/${product.id}`,
      })),
    },
  };
}

export function productJsonLd({
  product,
  store,
  url,
}: {
  product: StorefrontProduct;
  store: StorefrontStore;
  url: string;
}) {
  const price = Number(product.discountPrice || product.regularPrice || 0);
  const availability = product.isInStock === false
    ? "https://schema.org/OutOfStock"
    : "https://schema.org/InStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} from ${store.name}`,
    image: product.images?.filter(Boolean) ?? [],
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: store.name,
    },
    category: product.category || undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: store.currency || "INR",
      price: Number.isFinite(price) ? String(price) : undefined,
      availability,
      seller: {
        "@type": "Organization",
        name: store.name,
      },
    },
  };
}
