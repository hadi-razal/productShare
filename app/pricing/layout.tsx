import type { Metadata } from "next";
import {
  MONTHLY_PRICE_INR,
  YEARLY_DISCOUNT_PERCENT,
  YEARLY_PRICE_INR,
  inrLabel,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing — Product Share India",
  description:
    `Simple, transparent pricing for Product Share India. Free plan with 3 listings. Monthly plan at ${inrLabel(MONTHLY_PRICE_INR)}. Yearly plan at ${inrLabel(YEARLY_PRICE_INR)} with ${YEARLY_DISCOUNT_PERCENT}% off.`,
  keywords: [
    "Product Share India pricing",
    "catalog builder price India",
    "digital catalog subscription",
    "monthly catalog plan India",
    "affordable catalog builder",
    "free catalog builder India",
    `${inrLabel(MONTHLY_PRICE_INR)} catalog builder`,
    "yearly catalog plan India",
  ],
  alternates: {
    canonical: "https://productshare.in/pricing",
  },
  openGraph: {
    title: "Pricing — Product Share India | Plans Starting Free",
    description:
      `Start free or go premium. Monthly ${inrLabel(MONTHLY_PRICE_INR)} • Yearly ${inrLabel(YEARLY_PRICE_INR)} (${YEARLY_DISCOUNT_PERCENT}% off).`,
    url: "https://productshare.in/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Share India Pricing — Plans Starting Free",
    description:
      `Free plan available. Monthly ${inrLabel(MONTHLY_PRICE_INR)}, or yearly ${inrLabel(YEARLY_PRICE_INR)} with ${YEARLY_DISCOUNT_PERCENT}% off.`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pricingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Product Share India — Digital Catalog Builder",
    description:
      "Professional digital catalog builder for Indian small businesses, restaurants, and dropshippers.",
    url: "https://productshare.in",
    brand: {
      "@type": "Brand",
      name: "Product Share India",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "INR",
        description: "Up to 3 product listings, basic analytics, public sharing link",
        eligibleRegion: { "@type": "Country", name: "India" },
        url: "https://productshare.in/register",
      },
      {
        "@type": "Offer",
        name: "Monthly Plan",
        price: String(MONTHLY_PRICE_INR),
        priceCurrency: "INR",
        description: "Up to 25 products, 5 prebuilt themes, customer behavior analytics, theme customization, priority support",
        eligibleRegion: { "@type": "Country", name: "India" },
        url: "https://productshare.in/register",
      },
      {
        "@type": "Offer",
        name: "Yearly Plan",
        price: String(YEARLY_PRICE_INR),
        priceCurrency: "INR",
        description:
          `Up to 150 products, 12 prebuilt themes, advanced analytics, team access, bulk CSV/Excel upload. ${YEARLY_DISCOUNT_PERCENT}% off yearly billing.`,
        eligibleRegion: { "@type": "Country", name: "India" },
        url: "https://productshare.in/register",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      {children}
    </>
  );
}
