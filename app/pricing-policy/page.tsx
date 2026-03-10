import type { Metadata } from "next";
import React from 'react';

export const metadata: Metadata = {
  title: "Pricing Policy — Product Share India",
  description:
    "Product Share India pricing policy: Monthly plan at ₹499 and Yearly plan at ₹4,790 — both one-time payments with no auto-renewals. 14-day refund window. Read our full pricing terms.",
  keywords: ["Product Share pricing policy", "catalog builder payment terms India", "₹499 monthly plan", "₹4790 yearly plan"],
  alternates: { canonical: "https://productshare.in/pricing-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pricing Policy — Product Share India",
    description: "Monthly ₹499 or Yearly ₹4,790 — one-time payments, no hidden fees, 14-day refund window.",
    url: "https://productshare.in/pricing-policy",
    type: "website",
  },
};

const PricingPolicy = () => {
  return (
    <div className="bg-white min-h-screen pt-24 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto space-y-8 pb-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Pricing Policy</h1>
      <div className="space-y-8 text-left max-w-7xl mx-auto">
        <section>
          <p className="text-gray-600">
            At Product Share, we offer affordable and flexible pricing options to suit your needs. Our pricing structure is designed to provide access to our online catalogue builder through two straightforward plans.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pricing Plans</h2>
          <p className="text-gray-600 mb-4">
            Choose the plan that best fits your needs, with both monthly and yearly options available. Both plans are single-time purchases with no auto-pay or recurring billing.
          </p>
          <ul className="list-disc pl-6 space-y-3 text-gray-600">
            <li>
              <strong className="text-gray-900">Monthly Plan:</strong> <span className="font-semibold text-green-600">₹499</span> for a one-time payment. This plan gives you access to all features of our online catalogue builder for one month. You can renew the plan if you wish to continue using the service after the month ends.
            </li>
            <li>
              <strong className="text-gray-900">Yearly Plan:</strong> <span className="font-semibold text-green-600">₹4,790</span> for a one-time payment. This plan provides access to all features for an entire year, offering better value for long-term users. You can renew or switch plans at the end of the year.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Details</h2>
          <p className="text-gray-600">
            All payments for our plans are processed securely. Once your payment is complete, you will have immediate access to the catalogue builder service for the selected duration. We do not store any payment details, as these plans are one-time payments without recurring billing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Plan Modifications and Upgrades</h2>
          <p className="text-gray-600">
            If you wish to change your plan (e.g., switching from a monthly to a yearly plan), please reach out to our support team for assistance. Any change in plans will require a new payment for the selected plan.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Policy</h2>
          <p className="text-gray-600 mb-4">
            As our plans are based on one-time payments for a set period (monthly or yearly), we generally do not offer refunds once the purchase is completed. We strongly encourage you to review your selected plan carefully before proceeding with the purchase.
          </p>
          <p className="text-gray-600 mb-4">
            However, in compliance with mandatory consumer protection regulations, customers are eligible to request a refund within <strong>14 days</strong> of the purchase date, provided that the service has not been significantly used or abused during this period. Refund requests made after 14 days from the purchase date will not be accepted.
          </p>
          <p className="text-gray-600">
            To request a refund within the eligible period, please contact our support team with your order details. Approved refunds will be processed using the original payment method within a reasonable processing time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Customer Support</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions or need assistance regarding our pricing or plans, please don't hesitate to contact our support team. We're here to help!
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Phone: <a href="tel:9074063723" className="text-blue-600 underline">+91 9074063723</a></li>
            <li>Email: <a href="mailto:hadhirasal22@gmail.com" className="text-blue-600 underline">hadhirasal22@gmail.com</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PricingPolicy;
