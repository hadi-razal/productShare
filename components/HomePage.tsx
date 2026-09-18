"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiSend,
  FiGlobe,
  FiPieChart,
  FiShield,
  FiMessageCircle,
  FiSettings,
} from "react-icons/fi";
import { onAuthChange } from "@/lib/auth";
import { signedInHomePath } from "@/lib/super-admin";
import HeroSection from "./HeroSection";
import PricingSection from "./PricingSection";
import FaqSection from "./FaqSection";

const features = [
  {
    icon: FiSend,
    title: "Publish a catalog fast",
    description: "Add photos, prices, and details in minutes — no website to build.",
  },
  {
    icon: FiGlobe,
    title: "Share on WhatsApp and the web",
    description: "One link for WhatsApp, Instagram, QR codes, and any browser worldwide.",
  },
  {
    icon: FiPieChart,
    title: "See what people open",
    description: "Track visits and product views as your catalogue starts to grow.",
  },
  {
    icon: FiShield,
    title: "Simple and secure",
    description: "Hosted catalog software so you can focus on products, not servers.",
  },
  {
    icon: FiSettings,
    title: "Match your brand",
    description: "Set colors, logo, and layout so the catalog looks like your shop.",
  },
  {
    icon: FiMessageCircle,
    title: "Human support",
    description: "Reach the team by phone, email, or WhatsApp during business hours.",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign up free",
    description: "Create your account in seconds. No credit card required.",
  },
  {
    step: "02",
    title: "Add products",
    description: "Upload photos, set prices, and write short descriptions.",
  },
  {
    step: "03",
    title: "Share the link",
    description: "Post your catalog on WhatsApp, Instagram, QR codes, or anywhere customers are.",
  },
];

const facts = [
  { value: "Global", label: "Catalogs, anywhere" },
  { value: "Minutes", label: "To go live" },
  { value: "WhatsApp", label: "Ready to share" },
  { value: "Free", label: "Plan to start" },
];

const useCases = [
  {
    href: "/solutions/whatsapp-catalog",
    eyebrow: "Chat commerce",
    title: "WhatsApp catalog",
    description: "Replace scattered photos with a branded catalog link.",
  },
  {
    href: "/solutions/digital-menu",
    eyebrow: "Hospitality",
    title: "Digital restaurant menu",
    description: "QR code menus with photos and live prices.",
  },
  {
    href: "/solutions/online-catalogue",
    eyebrow: "Retail & wholesale",
    title: "Online product catalogue",
    description: "A living catalog instead of PDFs and weak websites.",
  },
];

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.replace(signedInHomePath(user.email));
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroSection />

      <section className="border-y border-primary/15">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 px-3 py-10 sm:px-5 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <p className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                {fact.value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                {fact.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1440px] scroll-mt-24 px-3 py-20 sm:px-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          Why Product Share
        </p>
        <h2 className="mt-3 max-w-xl text-[26px] font-bold uppercase tracking-tight text-slate-900 md:text-[32px]">
          Everything you need to share products
        </h2>
        <p className="mt-3 max-w-xl text-sm text-neutral-600">
          Digital catalog software for shops, restaurants, and sellers worldwide.
        </p>

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="border-y border-primary/15 bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.08),_transparent_50%)]">
        <div className="mx-auto max-w-[1440px] px-3 py-20 sm:px-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Solutions
          </p>
          <h2 className="mt-3 max-w-xl text-[26px] font-bold uppercase tracking-tight text-slate-900 md:text-[32px]">
            Built for how you already sell
          </h2>
          <p className="mt-3 max-w-xl text-sm text-neutral-600">
            One platform for WhatsApp catalogs, QR menus, and online catalogues.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {useCases.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-t border-primary/20 pt-6 hover:text-primary"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                  {item.eyebrow}
                </p>
                <h3 className="mt-3 text-[15px] font-semibold uppercase tracking-tight text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-3 py-20 sm:px-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          How it works
        </p>
        <h2 className="mt-3 max-w-xl text-[26px] font-bold uppercase tracking-tight text-slate-900 md:text-[32px]">
          Live in three steps
        </h2>
        <p className="mt-3 max-w-xl text-sm text-neutral-600">
          No tech skills needed. Get your catalog online in minutes.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="border-t border-primary/20 pt-6">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-primary">
                {item.step}
              </p>
              <h3 className="mt-3 text-[15px] font-semibold uppercase tracking-tight text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/guides/create-a-digital-catalog"
          className="mt-10 inline-flex text-[12px] font-medium uppercase tracking-[0.16em] text-primary hover:underline"
        >
          Read the full guide
        </Link>
      </section>

      <FaqSection />

      <PricingSection />

      <section className="bg-primary">
        <div className="mx-auto max-w-[1440px] px-3 py-16 sm:px-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
            Global catalogs, from India
          </p>
          <h2 className="mt-3 max-w-xl text-[26px] font-bold uppercase tracking-tight text-white md:text-[32px]">
            Publish your catalogue today
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/80">
            Create a branded digital catalog and share it with customers anywhere.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-white px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-primary hover:bg-white/90"
            >
              Start for free
            </Link>
            <Link
              href="/what-is-product-share"
              className="inline-flex items-center justify-center border border-white px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-white hover:text-primary"
            >
              What is Product Share?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
