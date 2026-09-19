import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import {
  PLANS,
  YEARLY_DISCOUNT_PERCENT,
  inrLabel,
} from "@/lib/pricing";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing — Plus and Pro Catalog Plans",
  description: `Product Share pricing: Plus at ${inrLabel(PLANS.plus.monthlyPriceInr)} / month with 30 products and 3 themes. Pro at ${inrLabel(PLANS.pro.monthlyPriceInr)} / month with 120 products and 10+ themes. Yearly billing is ${YEARLY_DISCOUNT_PERCENT}% off, paid upfront.`,
  path: "/pricing",
  keywords: [
    "Product Share pricing",
    "digital catalog builder price",
    "WhatsApp catalog pricing",
    "online catalogue subscription",
    "catalog software Plus Pro plans",
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
