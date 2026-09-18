import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/json-ld";
import { pageMetadata, solutionPages } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Catalog Solutions — WhatsApp, Digital Menus & Online Catalogues",
  description:
    "Product Share solutions for WhatsApp catalogs, QR code restaurant menus, online product catalogues, and small-business storefronts. Built for sellers worldwide.",
  path: "/solutions",
  keywords: [
    "catalog solutions",
    "WhatsApp catalog software",
    "digital menu platform",
    "online catalogue solutions",
  ],
});

export default function SolutionsPage() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <JsonLd
        data={webPageJsonLd({
          path: "/solutions",
          name: "Product Share catalog solutions",
          description:
            "WhatsApp catalogs, digital menus, and online product catalogues for businesses worldwide.",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ])}
      />

      <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <section className="max-w-3xl pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Solutions
          </p>
          <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
            Catalogs for every way you sell
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {siteConfig.name} is global catalog software. Use one platform as a
            WhatsApp catalog, a QR code restaurant menu, or an online product
            catalogue — without building a website.
          </p>
        </section>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {solutionPages.map((solution) => (
            <Link
              key={solution.slug}
              href={solution.path}
              className="border border-primary/15 p-8 transition hover:border-primary"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                {solution.eyebrow}
              </p>
              <h2 className="mt-3 text-[20px] font-bold uppercase tracking-tight text-slate-900">
                {solution.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {solution.intro}
              </p>
              <span className="mt-6 inline-flex text-[12px] font-medium uppercase tracking-[0.16em] text-primary">
                Learn more
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
