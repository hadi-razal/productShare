"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PLAN_LIST,
  PLANS,
  YEARLY_DISCOUNT_PERCENT,
  inrLabel,
  planPriceInr,
  yearlyEffectiveMonthlyInr,
  yearlyFullPriceInr,
  type BillingCycle,
  type PlanId,
} from "@/lib/pricing";

const rows: { label: string; plus: string; pro: string }[] = [
  { label: "Product listings", plus: `Up to ${PLANS.plus.productLimit}`, pro: `Up to ${PLANS.pro.productLimit}` },
  { label: "Storefront themes", plus: "3", pro: "10+" },
  { label: "Public catalog link", plus: "Yes", pro: "Yes" },
  { label: "Theme customization", plus: "Yes", pro: "Yes" },
  { label: "Catalog analytics", plus: "Standard", pro: "Advanced" },
  { label: "WhatsApp sharing", plus: "Yes", pro: "Yes" },
  { label: "Product videos", plus: "—", pro: "Yes" },
  { label: "Custom alert banners", plus: "—", pro: "Yes" },
  { label: "Sales and engagement charts", plus: "—", pro: "Yes" },
  { label: "AI customer insights", plus: "—", pro: "Yes" },
  { label: "Bulk product editing", plus: "—", pro: "Yes" },
  { label: "Bulk CSV/Excel upload", plus: "—", pro: "Yes" },
  { label: "Team access", plus: "—", pro: "Yes" },
  { label: "Priority support", plus: "—", pro: "Yes" },
];

const PricingPage = () => {
  const [cycle, setCycle] = useState<BillingCycle>("yearly");

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(108,100,203,0.12),_transparent_42%)] pb-20 pt-24">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              Pricing
            </p>
            <h1 className="mt-3 text-[28px] font-bold uppercase leading-tight tracking-tight text-slate-900 md:text-[36px]">
              Plus and Pro
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Plus at {inrLabel(PLANS.plus.monthlyPriceInr)} / month with 30 products and 3 themes.
              Pro at {inrLabel(PLANS.pro.monthlyPriceInr)} / month with 120 products, 10+ themes, and extra catalog tools.
              Yearly billing is {YEARLY_DISCOUNT_PERCENT}% off, paid upfront.
            </p>
          </div>

          <div className="inline-flex border border-primary/20 p-1">
            {(["monthly", "yearly"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCycle(option)}
                className={`px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] ${
                  cycle === option
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                {option === "yearly"
                  ? `Yearly · ${YEARLY_DISCOUNT_PERCENT}% off`
                  : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="w-[28%] py-4 pr-4 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                  Feature
                </th>
                {PLAN_LIST.map((plan) => {
                  const highlight = plan.id === "pro";
                  const price = planPriceInr(plan, cycle);
                  return (
                    <th key={plan.id} className="py-4 pr-4 align-bottom">
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                        {plan.name}
                        {highlight ? " · Most popular" : ""}
                      </p>
                      <p
                        className={`mt-2 text-2xl font-bold tracking-tight ${
                          highlight ? "text-primary" : "text-slate-900"
                        }`}
                      >
                        {inrLabel(price)}
                        <span className="ml-1 text-sm font-normal text-neutral-500">
                          {cycle === "yearly" ? "/ year" : "/ month"}
                        </span>
                      </p>
                      {cycle === "yearly" ? (
                        <p className="mt-1 text-xs font-medium text-neutral-500">
                          <span className="mr-1 line-through">
                            {inrLabel(yearlyFullPriceInr(plan.monthlyPriceInr))}
                          </span>
                          {inrLabel(yearlyEffectiveMonthlyInr(plan.monthlyPriceInr))}/month billed annually
                        </p>
                      ) : (
                        <p className="mt-1 text-xs font-medium text-neutral-500">
                          Save {YEARLY_DISCOUNT_PERCENT}% billed annually
                        </p>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-neutral-200">
                  <td className="py-4 pr-4 text-[13px] text-neutral-600">{row.label}</td>
                  {PLAN_LIST.map((plan) => {
                    const value = row[plan.id as PlanId];
                    return (
                      <td
                        key={plan.id}
                        className={`py-4 pr-4 text-[13px] ${
                          value === "—" ? "text-neutral-300" : "text-black"
                        }`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="pt-8" />
                {PLAN_LIST.map((plan) => (
                  <td key={plan.id} className="pt-8 pr-4">
                    <Link
                      href="/register"
                      className={`inline-flex min-w-[140px] items-center justify-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] ${
                        plan.id === "pro"
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "border border-primary text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      Get {plan.name}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 space-y-10 md:hidden">
          {PLAN_LIST.map((plan) => {
            const price = planPriceInr(plan, cycle);
            const highlight = plan.id === "pro";
            return (
              <div key={plan.id} className="border-t border-primary/15 pt-8">
                <p className="text-[11px] uppercase tracking-[0.16em] text-primary">
                  {plan.name}
                  {highlight ? " · Most popular" : ""}
                </p>
                <p
                  className={`mt-2 text-3xl font-bold tracking-tight ${
                    highlight ? "text-primary" : "text-slate-900"
                  }`}
                >
                  {inrLabel(price)}
                  <span className="ml-1 text-sm font-normal text-neutral-500">
                    {cycle === "yearly" ? "/ year" : "/ month"}
                  </span>
                </p>
                {cycle === "yearly" ? (
                  <p className="mt-1 text-xs font-medium text-neutral-500">
                    <span className="mr-1 line-through">
                      {inrLabel(yearlyFullPriceInr(plan.monthlyPriceInr))}
                    </span>
                    {inrLabel(yearlyEffectiveMonthlyInr(plan.monthlyPriceInr))}/month billed annually
                  </p>
                ) : null}
                <ul className="mt-6 space-y-3">
                  {rows.map((row) => {
                    const value = row[plan.id as PlanId];
                    return (
                      <li
                        key={row.label}
                        className="flex items-baseline justify-between gap-4 text-[13px]"
                      >
                        <span className="text-neutral-500">{row.label}</span>
                        <span className={value === "—" ? "text-neutral-300" : "text-black"}>
                          {value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 inline-flex w-full items-center justify-center py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] ${
                    highlight
                      ? "bg-primary text-white"
                      : "border border-primary text-primary"
                  }`}
                >
                  Get {plan.name}
                </Link>
              </div>
            );
          })}
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
