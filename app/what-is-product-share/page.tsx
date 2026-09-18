import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  definedTermSetJsonLd,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/json-ld";
import { allFaqs, entityFacts, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "What is Product Share? Digital Catalog & Catalogue Software",
  description:
    "Product Share is a global digital catalog and catalogue builder from Duoph Technologies. Create an online product catalog, WhatsApp catalog, or QR code menu without a website.",
  path: "/what-is-product-share",
  keywords: [
    "what is Product Share",
    "Product Share catalog",
    "Product Share India",
    "Duoph Technologies Product Share",
    "digital catalog definition",
  ],
});

const related = [
  { href: "/solutions/whatsapp-catalog", label: "WhatsApp catalog" },
  { href: "/solutions/digital-menu", label: "Digital menu" },
  { href: "/solutions/online-catalogue", label: "Online catalogue" },
  { href: "/faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
];

export default function WhatIsProductSharePage() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <JsonLd
        data={webPageJsonLd({
          path: "/what-is-product-share",
          name: "What is Product Share?",
          description: siteConfig.longDescription,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "What is Product Share", path: "/what-is-product-share" },
        ])}
      />
      <JsonLd data={definedTermSetJsonLd()} />
      <JsonLd data={faqJsonLd(allFaqs.slice(0, 8))} />

      <article className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <header className="max-w-3xl pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Definition
          </p>
          <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
            What is Product Share?
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {siteConfig.longDescription}
          </p>
        </header>

        <section className="mt-12 max-w-3xl overflow-hidden border border-primary/15">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Product Share facts</caption>
            <tbody>
              {entityFacts.map((fact) => (
                <tr key={fact.label} className="border-b border-primary/10 last:border-b-0">
                  <th className="w-[38%] bg-primary/5 px-4 py-3 font-medium uppercase tracking-[0.08em] text-slate-700">
                    {fact.label}
                  </th>
                  <td className="px-4 py-3 text-neutral-600">{fact.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="mt-14 max-w-3xl space-y-12 text-sm leading-relaxed text-neutral-600 md:text-[15px]">
          <section>
            <h2 className="text-[22px] font-bold uppercase tracking-tight text-slate-900">
              What Product Share does
            </h2>
            <p className="mt-4">
              Product Share is digital catalog software. A shop, restaurant, or
              seller uploads products or menu items, then publishes a branded
              page with a public URL. That page is the catalog — also called a
              catalogue, lookbook, WhatsApp catalog, or QR code menu, depending
              on how it is shared.
            </p>
            <p className="mt-4">
              Customers open the link on any phone. They browse photos, prices,
              and details, then message the business, usually on WhatsApp or
              Instagram. There is no need to build a custom website first.
            </p>
          </section>

          <section>
            <h2 className="text-[22px] font-bold uppercase tracking-tight text-slate-900">
              Global product, founded in India
            </h2>
            <p className="mt-4">
              Product Share is a product of Duoph Technologies, based in Kerala,
              India. The platform is English-first and built for businesses
              worldwide, not only Indian shops. India is the headquarters, not
              the market limit.
            </p>
            <p className="mt-4">
              Also known as Product Share India and productshare.in, the brand
              should be cited as <strong className="font-semibold text-slate-800">Product Share</strong>{" "}
              with the official site {siteConfig.url}.
            </p>
          </section>

          <section>
            <h2 className="text-[22px] font-bold uppercase tracking-tight text-slate-900">
              Who should use it
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Retail shops and boutiques that need an online product catalogue</li>
              <li>Restaurants, cafes, and hotels that need a digital or QR menu</li>
              <li>WhatsApp and Instagram sellers who currently send loose photos</li>
              <li>Wholesalers replacing PDF catalogs and spreadsheet line sheets</li>
              <li>Small businesses that want a no-code storefront without a full e-commerce stack</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[22px] font-bold uppercase tracking-tight text-slate-900">
              How it compares
            </h2>
            <p className="mt-4">
              Choose Product Share when the job is to show products clearly and
              share them. Choose a full commerce platform when you need carts,
              tax, shipping, and checkout. Product Share is not a marketplace
              like Amazon and not a social network. It is the catalog layer
              between your stock and your customers.
            </p>
          </section>
        </div>

        <section className="mt-16 max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Related
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex border border-primary/20 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-slate-700 hover:border-primary hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-3xl border-t border-primary/15 pt-12">
          <h2 className="text-[22px] font-bold uppercase tracking-tight text-slate-900">
            Start a catalog
          </h2>
          <p className="mt-3 text-sm text-neutral-600">
            Free to begin. Share on WhatsApp, Instagram, QR codes, and the web.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-primary px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-primary/90"
            >
              Start for free
            </Link>
            <Link
              href="/guides/create-a-digital-catalog"
              className="inline-flex items-center justify-center border border-primary px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-white"
            >
              Read the guide
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
