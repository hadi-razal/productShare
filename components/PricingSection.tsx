"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import {
  PLAN_LIST,
  YEARLY_DISCOUNT_PERCENT,
  inrLabel,
  planPriceInr,
  yearlyEffectiveMonthlyInr,
  yearlyFullPriceInr,
  type BillingCycle,
} from "@/lib/pricing";

const PricingSection = () => {
  const [cycle, setCycle] = useState<BillingCycle>("yearly");

  return (
    <section id="pricing" className="mx-auto max-w-[1440px] px-3 py-20 sm:px-5">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-[26px] font-bold uppercase tracking-tight text-slate-900 md:text-[32px]">
            Plus and Pro
          </h2>
          <p className="mt-3 text-sm text-neutral-600">
            Two paid plans. Yearly billing is {YEARLY_DISCOUNT_PERCENT}% off, paid upfront.
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

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {PLAN_LIST.map((plan) => {
          const highlight = plan.id === "pro";
          const price = planPriceInr(plan, cycle);
          const yearlyFull = yearlyFullPriceInr(plan.monthlyPriceInr);
          const yearlyMonthly = yearlyEffectiveMonthlyInr(plan.monthlyPriceInr);

          return (
            <div
              key={plan.id}
              className={`flex h-full flex-col border bg-white p-8 ${
                highlight ? "border-primary" : "border-primary/15"
              }`}
            >
              {highlight && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  Most popular
                </p>
              )}
              <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
              <div className="mt-5 text-4xl font-bold text-slate-950">
                {inrLabel(price)}
                <span className="ml-1 text-lg font-medium text-slate-500">
                  {cycle === "yearly" ? "/ year" : "/ month"}
                </span>
              </div>
              {cycle === "yearly" ? (
                <p className="mt-1 text-sm text-slate-500">
                  <span className="mr-2 line-through">{inrLabel(yearlyFull)}</span>
                  {inrLabel(yearlyMonthly)} / month, billed annually
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">
                  Or save {YEARLY_DISCOUNT_PERCENT}% when billed annually
                </p>
              )}
              <ul className="mt-6 flex-1 space-y-3 text-left text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <FiCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 block w-full px-6 py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.16em] transition ${
                  highlight
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                Get {plan.name}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingSection;
