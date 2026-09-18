import HomePage from "@/components/HomePage";
import JsonLd from "@/components/JsonLd";
import { faqJsonLd, webPageJsonLd } from "@/lib/json-ld";
import { homeFaqs, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title:
    "Product Share — Digital Catalog & Catalogue Builder for Shops, Restaurants & WhatsApp Sellers",
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
  keywords: [
    "best digital catalog builder",
    "online catalogue for shops",
    "create WhatsApp catalog",
    "QR code restaurant menu",
    "global catalog software",
  ],
  ogTitle: "Product Share — Digital catalogs for businesses worldwide",
  ogDescription:
    "Create an online product catalog, restaurant menu, or WhatsApp catalogue in minutes. Share it anywhere.",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          path: "/",
          name: "Product Share digital catalog builder",
          description: siteConfig.description,
        })}
      />
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <HomePage />
    </>
  );
}
