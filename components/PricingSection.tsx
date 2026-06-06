"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiBarChart2,
  FiBell,
  FiCheckCircle,
  FiUploadCloud,
  FiGlobe,
  FiHeadphones,
  FiEdit3,
  FiPieChart,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const pricingDetails = {
    monthly: {
      price: 499,
      description: "Full access for 1 month with a single checkout",
    },
    yearly: {
      price: Math.round(499 * 12 * 0.8),
      description: "Full access for 1 year and save 20%",
    },
  } as const;

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-slate-900">Product Share Premium</h2>
        <p className="mt-4 text-lg text-slate-600">
          Unlock the complete toolkit for publishing, managing, and sharing your
          store catalog.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="inline-flex rounded-md bg-slate-100 p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${billingCycle === "monthly"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${billingCycle === "yearly"
              ? "bg-primary text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-200"
              }`}
          >
            Yearly
            <span className="ml-2 rounded-md bg-red-600 px-2 py-1 text-[11px] text-white">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="text-2xl font-semibold text-primary">
            Product Share Premium
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-6 text-slate-600">
            {pricingDetails[billingCycle].description}
          </p>

          <div className="mt-6 text-4xl font-bold text-slate-950">
            &#8377;{pricingDetails[billingCycle].price}
            <span className="ml-2 text-lg font-medium text-slate-500">
              {billingCycle === "monthly" ? "/ month access" : "/ year access"}
            </span>
          </div>

          <ul className="mx-auto mt-8 w-full max-w-4xl space-y-3 text-left text-base text-slate-600">
            <li className="flex text-start md:justify-center">
              <FiCheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Unlimited product listings
            </li>
            <li className="flex text-start md:justify-center">
              <FiBarChart2 className="mr-2 h-5 w-5 text-blue-500" />
              Advanced analytics with customer insights
            </li>
            <li className="flex text-start md:justify-center">
              <FiEdit3 className="mr-2 h-5 w-5 text-yellow-500" />
              Custom branding and catalog design tools
            </li>
            <li className="flex text-start md:justify-center">
              <FiHeadphones className="mr-2 h-5 w-5 text-purple-500" />
              Priority customer support
            </li>
            <li className="flex text-start md:justify-center">
              <FiBell className="mr-2 h-5 w-5 text-orange-500" />
              Smart notification banners
            </li>
            <li className="flex text-start md:justify-center">
              <FiPieChart className="mr-2 h-5 w-5 text-pink-500" />
              Sales and revenue analytics
            </li>
            <li className="flex text-start md:justify-center">
              <FiGlobe className="mr-2 h-5 w-5 text-teal-500" />
              Multi-language and multi-currency support
            </li>
            <li className="flex text-start md:justify-center">
              <FiUploadCloud className="mr-2 h-5 w-5 text-indigo-500" />
              Bulk product upload via CSV or Excel
            </li>
            <li className="flex text-start md:justify-center">
              <FiShield className="mr-2 h-5 w-5 text-red-500" />
              Secure data protection and backups
            </li>
            <li className="flex text-start md:justify-center">
              <FiUsers className="mr-2 h-5 w-5 text-cyan-500" />
              Team access with role-based permissions
            </li>
          </ul>

          <Link
            href="/register"
            className="mx-auto mt-8 block w-full max-w-sm rounded-md bg-primary px-8 py-3.5 text-center font-semibold text-white shadow-lg transition hover:bg-primary/90 hover:shadow-xl"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
