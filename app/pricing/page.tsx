"use client";

import React from "react";
import Link from "next/link";

const plans = [
  {
    key: "free",
    name: "Free",
    price: "Free",
    period: "",
    cta: "Try for Free",
    href: "/register",
    highlight: false,
  },
  {
    key: "starter",
    name: "Starter",
    price: "₹499",
    period: "/ month",
    cta: "Get Started",
    href: "/register",
    highlight: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹999",
    period: "/ month",
    cta: "Get Started",
    href: "/register",
    highlight: true,
  },
] as const;

const rows: { label: string; free: string; starter: string; pro: string }[] = [
  { label: "Product Listings", free: "Up to 3", starter: "Up to 25", pro: "Up to 150" },
  { label: "Prebuilt Themes", free: "—", starter: "5", pro: "12" },
  { label: "Analytics", free: "Basic", starter: "Customer behavior", pro: "Advanced" },
  { label: "Sharing", free: "Public link", starter: "Public link", pro: "Public link" },
  { label: "Theme Customization", free: "—", starter: "Yes", pro: "Yes" },
  { label: "Priority Support", free: "—", starter: "Yes", pro: "Yes" },
  { label: "Custom Alert Banners", free: "—", starter: "Yes", pro: "Yes" },
  { label: "Sales & Engagement Charts", free: "—", starter: "Yes", pro: "Yes" },
  { label: "Product Videos", free: "—", starter: "Yes", pro: "Yes" },
  { label: "Performance Graphs", free: "—", starter: "Yes", pro: "Yes" },
  { label: "AI Customer Insights", free: "—", starter: "Yes", pro: "Yes" },
  { label: "Bulk Product Editing", free: "—", starter: "Yes", pro: "Yes" },
  { label: "Team Access", free: "—", starter: "—", pro: "Yes" },
  { label: "Bulk CSV/Excel Upload", free: "—", starter: "—", pro: "Yes" },
];

const cellValue = (plan: (typeof plans)[number], row: (typeof rows)[number]) =>
  row[plan.key];

const PricingPage = () => {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Pricing
          </p>
          <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
            Simple plans
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Start free with 3 listings. Upgrade to Starter for 25 products and 5
            themes, or Pro for 150 products and 12 themes.
          </p>
        </div>

        <div className="mt-12 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="w-[28%] py-4 pr-4 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th key={plan.key} className="py-4 pr-4 align-bottom">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                      {plan.name}
                      {plan.highlight ? " · Best value" : ""}
                    </p>
                    <p
                      className={`mt-2 text-2xl font-bold tracking-tight ${
                        plan.highlight ? "text-primary" : "text-slate-900"
                      }`}
                    >
                      {plan.price}
                      {plan.period && (
                        <span className="ml-1 text-sm font-normal text-neutral-500">
                          {plan.period}
                        </span>
                      )}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-neutral-200">
                  <td className="py-4 pr-4 text-[13px] text-neutral-600">{row.label}</td>
                  {plans.map((plan) => (
                    <td
                      key={plan.key}
                      className={`py-4 pr-4 text-[13px] ${
                        cellValue(plan, row) === "—"
                          ? "text-neutral-300"
                          : "text-black"
                      }`}
                    >
                      {cellValue(plan, row)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="pt-8" />
                {plans.map((plan) => (
                  <td key={plan.key} className="pt-8 pr-4">
                    <Link
                      href={plan.href}
                      className={`inline-flex min-w-[140px] items-center justify-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] ${
                        plan.highlight
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "border border-primary text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 space-y-10 md:hidden">
          {plans.map((plan) => (
            <div key={plan.key} className="border-t border-primary/15 pt-8">
              <p className="text-[11px] uppercase tracking-[0.16em] text-primary">
                {plan.name}
                {plan.highlight ? " · Best value" : ""}
              </p>
              <p
                className={`mt-2 text-3xl font-bold tracking-tight ${
                  plan.highlight ? "text-primary" : "text-slate-900"
                }`}
              >
                {plan.price}
                {plan.period && (
                  <span className="ml-1 text-sm font-normal text-neutral-500">
                    {plan.period}
                  </span>
                )}
              </p>
              <ul className="mt-6 space-y-3">
                {rows.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 text-[13px]"
                  >
                    <span className="text-neutral-500">{row.label}</span>
                    <span
                      className={
                        cellValue(plan, row) === "—" ? "text-neutral-300" : "text-black"
                      }
                    >
                      {cellValue(plan, row)}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 inline-flex w-full items-center justify-center py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] ${
                  plan.highlight
                    ? "bg-primary text-white"
                    : "border border-primary text-primary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-primary/15 pt-10">
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary">
            Enterprise
          </p>
          <h2 className="mt-2 text-xl font-bold uppercase tracking-tight text-slate-900">
            Need a custom plan?
          </h2>
          <p className="mt-3 max-w-xl text-sm text-neutral-600">
            Larger catalogs and teams can get tailored limits and support.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center border-b border-primary pb-0.5 text-[12px] font-medium uppercase tracking-[0.16em] text-primary"
          >
            Contact sales
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
