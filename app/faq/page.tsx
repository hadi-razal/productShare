import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, webPageJsonLd } from "@/lib/json-ld";
import { allFaqs, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Product Share FAQ — Digital Catalogs, WhatsApp & QR Menus",
  description:
    "Answers about Product Share: what it is, who it is for, global availability, WhatsApp catalogs, digital menus, pricing, and how it compares to a website.",
  path: "/faq",
  keywords: [
    "Product Share FAQ",
    "digital catalog questions",
    "WhatsApp catalog FAQ",
    "is Product Share only for India",
  ],
});

export default function FaqPage() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <JsonLd
        data={webPageJsonLd({
          path: "/faq",
          name: "Product Share FAQ",
          description:
            "Frequently asked questions about Product Share digital catalogs and catalogues.",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLd data={faqJsonLd(allFaqs)} />

      <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <header className="max-w-3xl pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            FAQ
          </p>
          <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
            Catalog questions, answered
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Straight answers for shops, restaurants, and sellers looking for a
            digital catalog, WhatsApp catalogue, or QR code menu.
          </p>
        </header>

        <div className="mt-12 max-w-3xl divide-y divide-primary/15 border-y border-primary/15">
          {allFaqs.map((faq) => (
            <section key={faq.question} className="py-6">
              <h2 className="text-[15px] font-semibold uppercase tracking-[0.06em] text-slate-900">
                {faq.question}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {faq.answer}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/what-is-product-share"
            className="inline-flex border border-primary/20 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-slate-700 hover:border-primary hover:text-primary"
          >
            What is Product Share?
          </Link>
          <Link
            href="/contact"
            className="inline-flex border border-primary/20 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-slate-700 hover:border-primary hover:text-primary"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </div>
  );
}
