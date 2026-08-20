"use client";

import { useEffect, useState } from "react";
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
    title: "Create a catalog fast",
    description: "Add photos, prices, and details in minutes — no website to build.",
  },
  {
    icon: FiGlobe,
    title: "Share on WhatsApp",
    description: "Send one link to customers across India on WhatsApp and Instagram.",
  },
  {
    icon: FiPieChart,
    title: "See what works",
    description: "Track visits and product views as your catalog starts to grow.",
  },
  {
    icon: FiShield,
    title: "Simple and secure",
    description: "Your store data stays on a reliable platform built for small shops.",
  },
  {
    icon: FiSettings,
    title: "Match your brand",
    description: "Set colors, logo, and layout so the catalog looks like your shop.",
  },
  {
    icon: FiMessageCircle,
    title: "Support from India",
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
    description: "Post your catalog on WhatsApp, Instagram, or anywhere customers are.",
  },
];

const facts = [
  { value: "India", label: "Based in Kerala" },
  { value: "Now", label: "Just launching" },
  { value: "WhatsApp", label: "Ready to share" },
  { value: "Free", label: "Plan to start" },
];

const Home = () => {
  const router = useRouter();
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.replace(signedInHomePath(user.email));
        return;
      }

      setIsAuthResolved(true);
    });

    return () => unsubscribe();
  }, [router]);

  if (!isAuthResolved) {
    return <div className="min-h-screen bg-white" />;
  }

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
          Built for Indian shops, restaurants, and WhatsApp sellers.
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
        </div>
      </section>

      <FaqSection />

      <PricingSection />

      <section className="bg-primary">
        <div className="mx-auto max-w-[1440px] px-3 py-16 sm:px-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
            Launching in India
          </p>
          <h2 className="mt-3 max-w-xl text-[26px] font-bold uppercase tracking-tight text-white md:text-[32px]">
            Be among the first
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/80">
            Create your catalog today and grow with Product Share from day one.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-white px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-primary hover:bg-white/90"
            >
              Start for free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center border border-white px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-white hover:text-primary"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
