import React, { useState } from "react";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const pricingDetails: any = {
    monthly: {
      price: 29,
      description: "Ideal for businesses looking for short-term flexibility",
    },
    yearly: {
      price: Math.round(29 * 12 * 0.83), // 17% discount
      description: "Best value - save 17% compared to monthly billing",
    },
  };

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Product Share Premium</h2>
        <p className="text-gray-600 text-lg leading-5">
          Choose the plan that works best for your store's catalog-building
          needs
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
            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Save 17%
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
            ${pricingDetails[billingCycle].price}
            <span className="text-lg text-gray-600">
              {billingCycle === "monthly" ? "/month" : "/year"}
            </span>
          </div>
          <ul className="text-gray-600 text-base mb-6 space-y-2">
            <li>✔ Create and manage catalogs</li>
            <li>✔ 50 product listings per month</li>
            <li>✔ Basic analytics</li>
            <li>✔ Email support</li>
          </ul>
          <button className="bg-primaryColor text-white px-6 py-3 rounded-md font-semibold hover:bg-primaryColor/90">
            Choose Plan
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
