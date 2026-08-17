"use client";

import React from "react";
import Link from "next/link";
import {
  FiBarChart2,
  FiBell,
  FiCheckCircle,
  FiEdit3,
  FiGlobe,
  FiHeadphones,
  FiPieChart,
  FiUploadCloud,
  FiUsers,
  FiVideo,
} from "react-icons/fi";

const plans = [
  {
    name: "Free Plan",
    price: "Free",
    period: "",
    description: "Start with a public catalog",
    features: [
      { icon: FiCheckCircle, text: "Up to 3 product listings" },
      { icon: FiBarChart2, text: "Basic analytics" },
      { icon: FiGlobe, text: "Public sharing link" },
    ],
    href: "/register",
    cta: "Try for Free",
    highlight: false,
  },
  {
    name: "Monthly Plan",
    price: "₹699",
    period: "/ month",
    description: "Grow with analytics and customization",
    features: [
      { icon: FiCheckCircle, text: "Up to 50 product listings" },
      { icon: FiBarChart2, text: "Customer behavior analytics" },
      { icon: FiGlobe, text: "Public sharing link" },
      { icon: FiEdit3, text: "Theme customization" },
      { icon: FiHeadphones, text: "Priority support" },
      { icon: FiBell, text: "Custom alert banners" },
      { icon: FiPieChart, text: "Sales & engagement charts" },
      { icon: FiVideo, text: "Product videos" },
    ],
    href: "/register",
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Yearly Plan",
    price: "₹6,990",
    period: "/ year",
    description: "Best value — 2 months free",
    features: [
      { icon: FiCheckCircle, text: "Up to 150 product listings" },
      { icon: FiBarChart2, text: "Advanced analytics" },
      { icon: FiGlobe, text: "Public sharing link" },
      { icon: FiEdit3, text: "Theme customization" },
      { icon: FiHeadphones, text: "Priority support" },
      { icon: FiUsers, text: "Team access" },
      { icon: FiUploadCloud, text: "Bulk CSV/Excel upload" },
    ],
    href: "/register",
    cta: "Get Started",
    highlight: true,
  },
] as const;

const PricingSection = () => {
  return (
    <section id="pricing" className="mx-auto max-w-[1440px] px-3 py-20 sm:px-5">
      <div className="max-w-xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
          Pricing
        </p>
        <h2 className="mt-3 text-[26px] font-bold uppercase tracking-tight text-slate-900 md:text-[32px]">
          Simple plans
        </h2>
        <p className="mt-3 text-sm text-neutral-600">
          Start free with 3 listings, then upgrade as your catalog grows.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex h-full flex-col border bg-white p-8 ${
              plan.highlight ? "border-primary" : "border-primary/15"
            }`}
          >
            {plan.highlight && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                Best value
              </p>
            )}
            <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
            <div className="mt-5 text-4xl font-bold text-slate-950">
              {plan.price}
              {plan.period && (
                <span className="ml-1 text-lg font-medium text-slate-500">
                  {plan.period}
                </span>
              )}
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-left text-sm text-slate-600">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-2">
                  <feature.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  {feature.text}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 block w-full px-6 py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.16em] transition ${
                plan.highlight
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "border border-primary text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
