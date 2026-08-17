import type { Metadata } from "next";
import Link from "next/link";
import {
  FiSmartphone,
  FiShoppingBag,
  FiGlobe,
} from "react-icons/fi";
import { HiWrench, HiHandRaised } from "react-icons/hi2";
import { MdPalette } from "react-icons/md";

export const metadata: Metadata = {
  title: "About Us — Product Share India",
  description:
    "Learn about Product Share India — a digital catalog builder from Kerala, built by Duoph Technologies for Indian shops, restaurants, and WhatsApp sellers.",
  keywords: [
    "about Product Share India",
    "Duoph Technologies",
    "digital catalog builder team",
    "small business catalog platform",
    "Indian startup catalog builder",
    "product showcase platform India",
  ],
  alternates: {
    canonical: "https://productshare.in/about-us",
  },
  openGraph: {
    title: "About Product Share India — Built in India",
    description:
      "Product Share is an India-based catalog builder from Duoph Technologies. We are launching now for local shops, restaurants, and WhatsApp sellers.",
    url: "https://productshare.in/about-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Product Share India",
    description:
      "An India-based catalog builder from Duoph Technologies, made for Indian small businesses going digital.",
  },
};

const features = [
  {
    icon: FiShoppingBag,
    title: "Create Product Catalogs",
    description:
      "Build stunning product showcases with photos, descriptions, and prices in minutes.",
  },
  {
    icon: FiGlobe,
    title: "Instant Web Sharing",
    description:
      "Get a unique, professional link for your catalog to share across platforms.",
  },
  {
    icon: FiSmartphone,
    title: "Mobile-Optimized",
    description:
      "Your catalogs look flawless on every device, especially smartphones.",
  },
  {
    icon: HiWrench,
    title: "Zero Technical Skills",
    description: "No coding or design expertise needed. Launch in minutes.",
  },
  {
    icon: HiHandRaised,
    title: "Small Business Focused",
    description:
      "Built for entrepreneurs and small businesses to compete with larger brands.",
  },
  {
    icon: MdPalette,
    title: "Brand Customization",
    description: "Add logos, colors, and layouts to match your brand identity.",
  },
];

const facts = [
  { number: "India", label: "Based in Kerala" },
  { number: "Now", label: "Just launching" },
  { number: "Free", label: "To get started" },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <section className="max-w-3xl pt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            About
          </p>
          <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
            Product Share
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Product Share is an India-based catalog builder. We are just getting
            started — building a simple way for local shops, restaurants, and
            WhatsApp sellers to publish products online without a website.
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
              Starting in India
            </h2>
          </div>
          <div className="space-y-5 text-sm leading-relaxed text-neutral-600 md:text-[15px]">
            <p>
              Product Share is built in Kerala, India by Duoph Technologies. Many
              local businesses still share products as scattered WhatsApp photos.
              A full website is often too costly and too complex.
            </p>
            <p>
              We are launching now. The platform is new — we are inviting shops,
              restaurants, and independent sellers in India to create their first
              catalog with us.
            </p>
            <p>
              As a sub-brand of{" "}
              <span className="font-semibold text-primary">Duoph Technologies</span>,
              we are focused on a simple Indian-first product: photos, prices, and a
              link you can share on WhatsApp.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Platform
          </p>
          <h2 className="mt-3 text-[22px] font-bold uppercase tracking-tight text-slate-900">
            Tools to help you succeed
          </h2>
          <p className="mt-3 max-w-xl text-sm text-neutral-600">
            Built for Indian small businesses, home sellers, and local stores.
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
            Help Indian businesses go digital
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-[15px]">
            Make product sharing simple and affordable for shops across India. We are
            at the beginning — join early, share feedback, and grow with us.
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
