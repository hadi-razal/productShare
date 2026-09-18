import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/json-ld";
import type { ContentPage } from "@/lib/seo";

type Breadcrumb = { name: string; path: string };

type SeoContentPageProps = {
  page: ContentPage;
  breadcrumbs: Breadcrumb[];
  extraJsonLd?: unknown[];
};

export default function SeoContentPage({
  page,
  breadcrumbs,
  extraJsonLd = [],
}: SeoContentPageProps) {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <JsonLd data={webPageJsonLd({ path: page.path, name: page.title, description: page.description })} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      {page.faqs.length > 0 ? <JsonLd data={faqJsonLd(page.faqs)} /> : null}
      {extraJsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}

      <article className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap gap-2 pt-8 text-[11px] uppercase tracking-[0.16em] text-neutral-500"
        >
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-primary">{crumb.name}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-primary">
                  {crumb.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <header className="max-w-3xl pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            {page.eyebrow}
          </p>
          <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {page.intro}
          </p>
        </header>

        <div className="mt-14 max-w-3xl space-y-12">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[22px] font-bold uppercase tracking-tight text-slate-900">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-[15px]"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-600">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {page.faqs.length > 0 ? (
          <section className="mt-16 max-w-3xl border-t border-primary/15 pt-12">
            <h2 className="text-[22px] font-bold uppercase tracking-tight text-slate-900">
              Questions
            </h2>
            <div className="mt-8 divide-y divide-primary/15 border-y border-primary/15">
              {page.faqs.map((faq) => (
                <div key={faq.question} className="py-5">
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-900">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {page.related.length > 0 ? (
          <section className="mt-16 max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              Related
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {page.related.map((item) => (
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
        ) : null}

        <section className="mt-16 max-w-3xl border-t border-primary/15 pt-12">
          <h2 className="text-[22px] font-bold uppercase tracking-tight text-slate-900">
            Publish your catalog
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600">
            Create a branded digital catalog or catalogue in minutes. Share it on
            WhatsApp, Instagram, QR codes, and the web.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-primary px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-primary/90"
            >
              Start for free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center border border-primary px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-white"
            >
              View pricing
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
