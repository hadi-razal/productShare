import type { Metadata } from "next";
import Link from "next/link";
import {
  FiSmartphone,
  FiShoppingBag,
  FiGlobe,
} from "react-icons/fi";
import { HiWrench, HiHandRaised } from "react-icons/hi2";
import { MdPalette } from "react-icons/md";
import JsonLd from "@/components/JsonLd";
import { aboutPageJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About Product Share — Global Catalog Software from India",
  description:
    "Product Share is a global digital catalog and catalogue builder from Duoph Technologies in Kerala, India. Built for shops, restaurants, and WhatsApp sellers worldwide.",
  path: "/about-us",
  keywords: [
    "about Product Share",
    "Duoph Technologies",
    "digital catalog builder company",
    "Product Share India",
    "catalog software from Kerala",
  ],
});

const features = [
  {
    icon: FiShoppingBag,
    title: "Create product catalogs",
    description:
      "Build product showcases with photos, descriptions, and prices in minutes.",
  },
  {
    icon: FiGlobe,
    title: "Share anywhere",
    description:
      "One professional link for WhatsApp, Instagram, QR codes, and the web.",
  },
  {
    icon: FiSmartphone,
    title: "Mobile-first",
    description:
      "Catalogs look sharp on every phone, which is where customers actually browse.",
  },
  {
    icon: HiWrench,
    title: "Zero technical skills",
    description: "No coding or design expertise needed. Launch in minutes.",
  },
  {
    icon: HiHandRaised,
    title: "Small business focused",
    description:
      "Built for independent sellers who need to look established without a full website.",
  },
  {
    icon: MdPalette,
    title: "Brand customization",
    description: "Add logos, colors, and layouts to match your brand identity.",
  },
];

const facts = [
  { number: "Global", label: "Built to share anywhere" },
  { number: "India", label: "Founded in Kerala" },
  { number: "Free", label: "To get started" },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <JsonLd data={aboutPageJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about-us" },
        ])}
      />

      <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <section className="max-w-3xl pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            About
          </p>
          <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
            Product Share
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
            {siteConfig.longDescription}
          </p>
        </section>

        <section className="mt-12 grid grid-cols-3 gap-4 border-y border-primary/15 py-8 max-w-xl">
          {facts.map((fact) => (
            <div key={fact.label}>
              <p className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                {fact.number}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                {fact.label}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              Our story
            </p>
            <h2 className="mt-3 text-[22px] font-bold uppercase tracking-tight text-slate-900">
              Founded in India, built for the world
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-neutral-600 md:text-[15px]">
            <p>
              Product Share is built in Kerala, India by{" "}
              <span className="font-semibold text-primary">Duoph Technologies</span>.
              Businesses everywhere still share products as scattered chat photos
              or outdated PDFs. A full website is often too slow and too expensive
              when you only need a catalog.
            </p>
            <p>
              We started with shops, restaurants, and WhatsApp sellers who needed
              a clean link they could send today. That same product now serves as
              global catalog software: an online product catalogue, digital menu,
              and no-code storefront.
            </p>
            <p>
              India is our home. The catalog is for anyone, anywhere, who needs
              to show products clearly and share them fast.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Platform
          </p>
          <h2 className="mt-3 text-[22px] font-bold uppercase tracking-tight text-slate-900">
            Tools to help you sell
          </h2>
          <p className="mt-3 max-w-xl text-sm text-neutral-600">
            Built for restaurants, retailers, makers, and chat-first sellers.
          </p>

          <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="border-t border-primary/15 pt-6">
                <feature.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-primary/15 pt-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Mission
          </p>
          <h2 className="mt-3 max-w-2xl text-[22px] font-bold uppercase tracking-tight text-slate-900 md:text-[28px]">
            Make product sharing simple for every business
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-[15px]">
            Affordable digital catalogs and catalogues, without forcing anyone
            into a complicated website project. Learn more in{" "}
            <Link href="/what-is-product-share" className="text-primary hover:underline">
              What is Product Share?
            </Link>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-primary px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-primary/90"
            >
              Start for free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-primary px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-white"
            >
              Talk to us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
