import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  MONTHLY_PRICE_INR,
  YEARLY_DISCOUNT_PERCENT,
  YEARLY_PRICE_INR,
  inrLabel,
} from "@/lib/pricing";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing — Free Digital Catalog Plans & Paid Catalog Software",
  description: `Product Share pricing: free catalog plan with 3 listings. Monthly plan at ${inrLabel(MONTHLY_PRICE_INR)}. Yearly plan at ${inrLabel(YEARLY_PRICE_INR)} with ${YEARLY_DISCOUNT_PERCENT}% off. Catalog software for businesses worldwide.`,
  path: "/pricing",
  keywords: [
    "Product Share pricing",
    "digital catalog builder price",
    "free catalog builder",
    "WhatsApp catalog pricing",
    "online catalogue subscription",
  ],
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      {children}
    </>
  );
}
