import HomePage from "@/components/HomePage";
import { Metadata } from "next";

const baseUrl = "https://productshare.in";

export const metadata: Metadata = {
  title: "Product Share India — #1 Free Digital Catalog Builder for Indian Businesses",
  description:
    "Create professional digital catalogs and menus in minutes — no coding needed. Trusted by 10,000+ Indian businesses: restaurants, retail stores, dropshippers, and more. Free to start, with WhatsApp sharing and QR codes built in.",
  keywords: [
    "Product Share India",
    "digital catalog builder India",
    "free catalog maker",
    "online product catalog",
    "restaurant menu builder India",
    "small business catalog tool",
    "dropshipping product showcase",
    "WhatsApp product catalog",
    "QR code menu generator India",
    "catalog builder for restaurants",
    "digital menu creator",
    "product listing platform India",
    "Duoph Technologies",
    "business catalog app",
    "share products online India",
  ],
  applicationName: "Product Share India",
  authors: [{ name: "Duoph Technologies", url: "https://www.duoph.in/" }],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title:
      "Product Share India — Free Digital Catalog Builder for Restaurants & Stores",
    description:
      "Build and share professional product catalogs and menus in minutes. Perfect for Indian restaurants, retail stores, and dropshippers. Free plan available.",
    url: baseUrl,
    siteName: "Product Share India",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Product Share India - Digital Catalog Builder for Indian Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Share India — Free Digital Catalog Builder",
    description:
      "Create stunning product catalogs and restaurant menus in minutes. Built for Indian businesses.",
    creator: "@Hadi_Razal",
    site: "@Hadi_Razal",
    images: [`${baseUrl}/og-image.png`],
  },
};

export default function Page() {
  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Product Share India",
    operatingSystem: "Web Browser",
    applicationCategory: "BusinessApplication",
    url: baseUrl,
    description:
      "Free digital catalog builder for Indian businesses — create and share product catalogs, restaurant menus, and store listings in minutes.",
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
        name: "Monthly Plan",
        price: "499",
        priceCurrency: "INR",
        description: "Full access — one-time monthly purchase, no recurring charges",
      },
      {
        "@type": "Offer",
        name: "Yearly Plan",
        price: "4790",
        priceCurrency: "INR",
        description: "Full access for a year — save 20% over monthly",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "500",
      bestRating: "5",
    },
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
          text: "Product Share India is a free digital catalog builder that lets restaurants, retail stores, dropshippers, and small businesses create and share professional product catalogs and menus in minutes — no coding required.",
        },
      },
      {
        "@type": "Question",
        name: "How much does Product Share India cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Product Share India offers a free plan with up to 3 product listings. The monthly premium plan costs ₹499 (one-time) and the yearly plan costs ₹4,790 (one-time, saving 20%).",
        },
      },
      {
        "@type": "Question",
        name: "Can I share my catalog on WhatsApp?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Every catalog gets a unique shareable link and QR code that you can share directly on WhatsApp, Instagram, and other platforms.",
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