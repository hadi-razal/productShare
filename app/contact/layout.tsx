import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, contactPageJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Product Share — Catalog Support Worldwide",
  description: `Get in touch with Product Share for catalog support, pricing, and partnerships. Email ${siteConfig.supportEmail}. Phone ${siteConfig.supportPhone}. Hours: ${siteConfig.supportHours}.`,
  path: "/contact",
  keywords: [
    "contact Product Share",
    "Product Share support",
    "digital catalog builder support",
    "Duoph Technologies contact",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={contactPageJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      {children}
    </>
  );
}
