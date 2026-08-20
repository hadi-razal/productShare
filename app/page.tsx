import HomePage from "@/components/HomePage";
import { Metadata } from "next";
import { defaultOgImage, siteConfig } from "@/lib/site";

const baseUrl = siteConfig.url;

export const metadata: Metadata = {
  title: "Product Share India - Digital Catalog Builder for Indian Businesses",
  description:
    "Create professional digital catalogs and menus in minutes with Product Share India. Share products on WhatsApp, social media, and QR codes without building a full website.",
  keywords: [
    ...siteConfig.keywords,
    "Product Share India",
    "online product catalog",
    "catalog builder for restaurants",
    "share products online India",
  ],
  applicationName: siteConfig.name,
  authors: [{ name: "Duoph Technologies", url: "https://www.duoph.in/" }],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Product Share India - Digital Catalog Builder for Restaurants and Stores",
    description:
      "Build and share polished product catalogs and menus in minutes. Ideal for restaurants, shops, and small businesses.",
    url: baseUrl,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} social preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Digital Catalog Builder`,
    description:
      "Create digital catalogs and menus that are easy to publish and share.",
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
    images: [defaultOgImage],
  },
};

export default function Page() {
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    operatingSystem: "Web Browser",
    applicationCategory: "BusinessApplication",
    url: baseUrl,
    description: siteConfig.description,
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "INR",
        description: "Start for free with up to 3 product listings",
      },
      {
        "@type": "Offer",
        name: "Starter Plan",
        price: "499",
        priceCurrency: "INR",
        description: "Up to 25 product listings and 5 prebuilt themes",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "999",
        priceCurrency: "INR",
        description: "Up to 150 product listings and 12 prebuilt themes",
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Product Share India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Product Share India is a catalog builder from Kerala, India. It helps restaurants, retail stores, and small businesses create and share product catalogs without a full website. The product is just launching.",
        },
      },
      {
        "@type": "Question",
        name: "How much does Product Share India cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Product Share India offers a free plan with up to 3 product listings. The Starter Plan is INR 499 per month with up to 25 listings and 5 prebuilt themes. The Pro Plan is INR 999 per month with up to 150 listings and 12 prebuilt themes.",
        },
      },
      {
        "@type": "Question",
        name: "Can I share my catalog on WhatsApp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every catalog gets a shareable link that you can post on WhatsApp, Instagram, and other platforms.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePage />
    </>
  );
}
