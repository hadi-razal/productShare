"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  BarChart,
  Paintbrush,
  Headphones,
  Bell,
  PieChart,
  Smile,
  Lock,
  Globe,
  Video,
  LineChart,
  WandSparkles,
  Rows3,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <CheckCircle className="text-green-500 w-5 h-5" />,
    text: "Unlimited product listings",
  },
  {
    icon: <BarChart className="text-blue-500 w-5 h-5" />,
    text: "Customer behavior analytics",
  },
  {
    icon: <Paintbrush className="text-yellow-500 w-5 h-5" />,
    text: "Theme customization tools",
  },
  {
    icon: <Headphones className="text-purple-500 w-5 h-5" />,
    text: "24/7 priority support",
  },
  {
    icon: <Bell className="text-orange-500 w-5 h-5" />,
    text: "Custom alert banners",
  },
  {
    icon: <PieChart className="text-pink-500 w-5 h-5" />,
    text: "Sales & engagement charts",
  },
  {
    icon: <Video className="text-red-500 w-5 h-5" />,
    text: "Add videos to product listings",
  },
  {
    icon: <LineChart className="text-sky-500 w-5 h-5" />,
    text: "Advanced performance graphs",
  },
  {
    icon: <WandSparkles className="text-indigo-500 w-5 h-5" />,
    text: "AI-generated customer insights",
  },
  {
    icon: <Rows3 className="text-gray-700 w-5 h-5" />,
    text: "Bulk edit tools for products",
  },
];

const freeFeatures = [
  {
    icon: <Smile className="text-green-500 w-5 h-5" />,
    text: "Up to 3 product listings",
  },
  {
    icon: <Lock className="text-blue-500 w-5 h-5" />,
    text: "Basic analytics dashboard",
  },
  {
    icon: <Globe className="text-purple-500 w-5 h-5" />,
    text: "Public sharing link",
  },
];

const pricingDetails: Record<string, { price: number; description: string }> = {
  free: {
    price: 0,
    description: "Start for free and explore our platform",
  },
  monthly: {
    price: 249,
    description: "Ideal for businesses looking for short-term flexibility",
  },
  yearly: {
    price: Math.round(249 * 12 * 0.83),
    description: "Best value – save 17% with yearly billing",
  },
};

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 md:px-16 py-8">
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 pb-2 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-600 bg-clip-text text-transparent">
          Pricing Plans
        </h1>
        <p className="text-gray-700 text-lg">
          Choose a plan that scales with your growth.
        </p>
      </section>

      {/* Mobile view */}
      <div className="md:hidden space-y-8">
        <PricingCard
          title="Free Plan"
          description={pricingDetails.free.description}
          price={pricingDetails.free.price}
          billingCycle="free"
          features={freeFeatures}
        />

        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-full transition-all ${
                billingCycle === "monthly"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-full transition-all ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Yearly
              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <PricingCard
          title="Product Share Premium"
          description={pricingDetails[billingCycle].description}
          price={pricingDetails[billingCycle].price}
          billingCycle={billingCycle}
          features={features}
        />
      </div>

      {/* Desktop view */}
      <div className="hidden md:grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        <PricingCard
          title="Free Plan"
          description={pricingDetails.free.description}
          price={pricingDetails.free.price}
          billingCycle="free"
          features={freeFeatures}
        />
        <PricingCard
          title="Monthly Plan"
          description={pricingDetails.monthly.description}
          price={pricingDetails.monthly.price}
          billingCycle="monthly"
          features={features}
        />
        <PricingCard
          title="Yearly Plan"
          description={pricingDetails.yearly.description}
          price={pricingDetails.yearly.price}
          billingCycle="yearly"
          badge="Best Value"
          features={features}
        />
      </div>
    </main>
  );
};

const PricingCard = ({
  title,
  description,
  price,
  billingCycle,
  features,
  badge,
}: {
  title: string;
  description: string;
  price: number;
  billingCycle: string;
  features: { icon: JSX.Element; text: string }[];
  badge?: string;
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-8 text-center relative">
      {badge && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {badge}
        </div>
      )}
      <h3 className="text-2xl font-bold text-indigo-700 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 text-sm">{description}</p>
      <div className="text-4xl font-bold text-gray-900 mb-6">
        {price === 0 ? "Free" : `₹${price}`}
        {price !== 0 && (
          <span className="text-lg text-gray-600 ml-1">
            {billingCycle === "monthly" ? "/month" : billingCycle === "yearly" ? "/year" : ""}
          </span>
        )}
      </div>

      <ul className="space-y-3 text-left mb-8">
        {features.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            {item.icon}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/register"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition"
      >
        {price === 0 ? "Try for Free →" : "Get Started →"}
      </Link>
    </div>
  );
};

export default PricingPage;
