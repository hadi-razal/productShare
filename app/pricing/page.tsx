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
import { motion } from "framer-motion";

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

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <main className="min-h-screen bg-white px-4 md:px-16 py-12">
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Simple, transparent pricing
        </h1>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Choose the perfect plan for your business needs. Scale up or down as you grow.
        </p>
      </motion.section>

      {/* Mobile view */}
      <div className="md:hidden space-y-8">
        <motion.div variants={fadeIn}>
          <PricingCard
            title="Free Plan"
            description={pricingDetails.free.description}
            price={pricingDetails.free.price}
            billingCycle="free"
            features={freeFeatures}
          />
        </motion.div>

        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-full transition-all ${
                billingCycle === "monthly"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-full transition-all ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              Yearly
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
          <PricingCard
            title="Product Share Premium"
            description={pricingDetails[billingCycle].description}
            price={pricingDetails[billingCycle].price}
            billingCycle={billingCycle}
            features={features}
            highlight={billingCycle === "yearly"}
          />
        </motion.div>
      </div>

      {/* Desktop view */}
      <motion.div 
        className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div variants={fadeIn}>
          <PricingCard
            title="Free Plan"
            description={pricingDetails.free.description}
            price={pricingDetails.free.price}
            billingCycle="free"
            features={freeFeatures}
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <PricingCard
            title="Monthly Plan"
            description={pricingDetails.monthly.description}
            price={pricingDetails.monthly.price}
            billingCycle="monthly"
            features={features}
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <PricingCard
            title="Yearly Plan"
            description={pricingDetails.yearly.description}
            price={pricingDetails.yearly.price}
            billingCycle="yearly"
            badge="Best Value"
            features={features}
            highlight
          />
        </motion.div>
      </motion.div>

      {/* Enterprise CTA */}
      <motion.div 
        className="max-w-4xl mx-auto mt-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 md:p-10 border border-indigo-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Need enterprise solutions?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Custom pricing and features for large businesses with unique requirements.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-indigo-600 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg border border-indigo-200 transition shadow-sm hover:shadow-md"
          >
            Contact Sales →
          </Link>
        </div>
      </motion.div>
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
  highlight = false,
}: {
  title: string;
  description: string;
  price: number;
  billingCycle: string;
  features: { icon: JSX.Element; text: string }[];
  badge?: string;
  highlight?: boolean;
}) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative h-full flex flex-col border rounded-xl overflow-hidden transition-all ${highlight ? "border-indigo-300 shadow-lg" : "border-gray-200 shadow-sm"}`}
    >
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
      )}
      <div className="p-8 flex-1">
        {badge && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </div>
        )}
        <h3 className={`text-2xl font-bold mb-3 ${highlight ? "text-indigo-700" : "text-gray-900"}`}>{title}</h3>
        <p className="text-gray-600 mb-6 text-sm">{description}</p>
        <div className={`text-5xl font-bold mb-6 ${highlight ? "text-indigo-600" : "text-gray-900"}`}>
          {price === 0 ? "Free" : `₹${price}`}
          {price !== 0 && (
            <span className="text-lg text-gray-600 ml-1">
              {billingCycle === "monthly" ? "/month" : billingCycle === "yearly" ? "/year" : ""}
            </span>
          )}
        </div>

        <ul className="space-y-3 text-left mb-8">
          {features.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-0.5">{item.icon}</span>
              <span className="text-gray-700">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-8 pb-8">
        <Link
          href="/register"
          className={`block w-full text-center font-medium px-6 py-3 rounded-lg transition ${highlight ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg" : "bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md"}`}
        >
          {price === 0 ? "Try for Free" : "Get Started"}
        </Link>
      </div>
    </motion.div>
  );
};

export default PricingPage;