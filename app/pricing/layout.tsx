import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Product Share India",
  description:
    "Simple, transparent pricing for Product Share India. Free plan available. Monthly plan at ₹499 (one-time) and Yearly plan at ₹4,790 (one-time, save 20%). No auto-pay, no hidden fees.",
  keywords: [
    "Product Share India pricing",
    "catalog builder price India",
    "digital catalog subscription",
    "monthly catalog plan India",
    "yearly catalog plan",
    "affordable catalog builder",
    "free catalog builder India",
    "₹499 catalog builder",
  ],
  alternates: {
    canonical: "https://productshare.in/pricing",
  },
  openGraph: {
    title: "Pricing — Product Share India | Plans Starting Free",
    description:
      "Start free or go premium. Monthly plan ₹499 • Yearly plan ₹4,790 (save 20%). One-time payments, no recurring charges.",
    url: "https://productshare.in/pricing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Share India Pricing — Plans Starting Free",
    description:
      "Free plan available. Monthly ₹499 or Yearly ₹4,790 — one-time payments, no auto-renewals.",
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
        price: "499",
        priceCurrency: "INR",
        description:
          "Unlimited products, analytics, customization, priority support — one-time monthly payment",
        eligibleRegion: { "@type": "Country", name: "India" },
        url: "https://productshare.in/register",
      },
      {
        "@type": "Offer",
        name: "Yearly Plan",
        price: "4790",
        priceCurrency: "INR",
        description:
          "Everything in Monthly, full year access, save 20% — one-time yearly payment",
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
