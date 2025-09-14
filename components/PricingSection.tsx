import React, { useState } from "react";
import {
  CheckCircle,
  BarChart,
  Paintbrush,
  Headphones,
  Bell,
  PieChart,
  Globe,
  Shield,
  CloudUpload,
  Users,
} from "lucide-react";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const pricingDetails: any = {
    monthly: {
      price: 499,
      description: "Perfect for businesses looking for flexibility with a one-time monthly purchase",
    },
    yearly: {
      price: Math.round(499 * 12 * 0.8), // 20% discount
      description: "Best value - one-time yearly purchase, save 20%",
    },
  };

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Product Share Premium</h2>
        <p className="text-gray-600 text-lg leading-5">
          Unlock all premium tools for building and managing your store’s catalog
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-full inline-flex">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-full transition-colors ${
              billingCycle === "monthly"
                ? "bg-primaryColor text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-full transition-colors ${
              billingCycle === "yearly"
                ? "bg-primaryColor text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Yearly
            <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="grid grid-cols-1 gap-8">
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-2xl font-semibold mb-3 text-primaryColor">
            Product Share Premium
          </h3>
          <p className="text-gray-600 text-base mb-6 leading-4">
            {pricingDetails[billingCycle].description}
          </p>
          <div className="text-4xl font-bold mb-6">
            &#8377;{pricingDetails[billingCycle].price}
            <span className="text-lg text-gray-600">
              {billingCycle === "monthly" ? " / one-time" : " / year (one-time)"}
            </span>
          </div>

          <ul className="text-gray-600 text-base mb-6 w-full max-w-7xl space-y-2">
            <li className="flex md:justify-center text-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Unlimited product listings
            </li>
            <li className="flex md:justify-center text-start">
              <BarChart className="w-5 h-5 text-blue-500 mr-2" />
              Advanced analytics with customer insights
            </li>
            <li className="flex md:justify-center text-start">
              <Paintbrush className="w-5 h-5 text-yellow-500 mr-2" />
              Custom branding and catalog design tools
            </li>
            <li className="flex md:justify-center text-start">
              <Headphones className="w-5 h-5 text-purple-500 mr-2" />
              Priority customer support (24/7 email + chat)
            </li>
            <li className="flex md:justify-center text-start">
              <Bell className="w-5 h-5 text-orange-500 mr-2" />
              Smart notification & alert system
            </li>
            <li className="flex md:justify-center text-start">
              <PieChart className="w-5 h-5 text-pink-500 mr-2" />
              Sales & revenue analytics dashboard
            </li>
            <li className="flex md:justify-center text-start">
              <Globe className="w-5 h-5 text-teal-500 mr-2" />
              Multi-language & multi-currency support
            </li>
            <li className="flex md:justify-center text-start">
              <CloudUpload className="w-5 h-5 text-indigo-500 mr-2" />
              Bulk product upload via Excel/CSV
            </li>
            <li className="flex md:justify-center text-start">
              <Shield className="w-5 h-5 text-red-500 mr-2" />
              Secure data protection & backups
            </li>
            <li className="flex md:justify-center text-start">
              <Users className="w-5 h-5 text-cyan-500 mr-2" />
              Team access with role-based permissions
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
