import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Product Share India",
  description:
    "Simple, transparent pricing for Product Share India. Free plan with 3 listings. Monthly plan at ₹699 and Yearly plan at ₹6,990 with up to 150 listings.",
  keywords: [
    "Product Share India pricing",
    "catalog builder price India",
    "digital catalog subscription",
    "monthly catalog plan India",
    "yearly catalog plan",
    "affordable catalog builder",
    "free catalog builder India",
    "₹699 catalog builder",
  ],
  alternates: {
    canonical: "https://productshare.in/pricing",
  },
  openGraph: {
    title: "Pricing — Product Share India | Plans Starting Free",
    description:
      "Start free or go premium. Monthly plan ₹699 • Yearly plan ₹6,990 (2 months free).",
    url: "https://productshare.in/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Share India Pricing — Plans Starting Free",
    description:
      "Free plan available. Monthly ₹699 or Yearly ₹6,990 — up to 150 product listings.",
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
        price: "699",
        priceCurrency: "INR",
        description: "Up to 50 products, customer behavior analytics, theme customization, priority support",
        eligibleRegion: { "@type": "Country", name: "India" },
        url: "https://productshare.in/register",
      },
      {
        "@type": "Offer",
        name: "Yearly Plan",
        price: "6990",
        priceCurrency: "INR",
        description:
          "Up to 150 products, advanced analytics, team access, bulk CSV/Excel upload",
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
