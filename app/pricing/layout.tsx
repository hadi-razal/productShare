import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Product Share India",
  description:
    "Simple, transparent pricing for Product Share India. Free plan with 3 listings. Starter plan at ₹499 with 25 products and 5 themes. Pro plan at ₹999 with 150 products and 12 themes.",
  keywords: [
    "Product Share India pricing",
    "catalog builder price India",
    "digital catalog subscription",
    "monthly catalog plan India",
    "affordable catalog builder",
    "free catalog builder India",
    "₹499 catalog builder",
    "₹999 catalog builder",
  ],
  alternates: {
    canonical: "https://productshare.in/pricing",
  },
  openGraph: {
    title: "Pricing — Product Share India | Plans Starting Free",
    description:
      "Start free or go premium. Starter plan ₹499 • Pro plan ₹999.",
    url: "https://productshare.in/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Share India Pricing — Plans Starting Free",
    description:
      "Free plan available. Starter ₹499 (25 products, 5 themes) or Pro ₹999 (150 products, 12 themes).",
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
        name: "Starter Plan",
        price: "499",
        priceCurrency: "INR",
        description: "Up to 25 products, 5 prebuilt themes, customer behavior analytics, theme customization, priority support",
        eligibleRegion: { "@type": "Country", name: "India" },
        url: "https://productshare.in/register",
      },
      {
        "@type": "Offer",
        name: "Pro Plan",
        price: "999",
        priceCurrency: "INR",
        description:
          "Up to 150 products, 12 prebuilt themes, advanced analytics, team access, bulk CSV/Excel upload",
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
