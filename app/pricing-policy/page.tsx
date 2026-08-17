import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import React from 'react';

export const metadata: Metadata = {
  title: "Pricing Policy — Product Share India",
  description:
    "Product Share India pricing policy: Free plan with 3 listings. Monthly plan at ₹699 and Yearly plan at ₹6,990. 14-day refund window. Read our full pricing terms.",
  keywords: ["Product Share pricing policy", "catalog builder payment terms India", "₹699 monthly plan", "₹6990 yearly plan"],
  alternates: { canonical: "https://productshare.in/pricing-policy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pricing Policy — Product Share India",
    description: "Monthly ₹699 or Yearly ₹6,990 — 14-day refund window, no hidden fees.",
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
            Choose the plan that best fits your catalog. A free plan is available, with paid monthly and yearly options for growing stores.
          </p>
          <ul className="list-disc pl-6 space-y-3 text-gray-600">
            <li>
              <strong className="text-gray-900">Free Plan:</strong> <span className="font-semibold text-green-600">Free</span>. Up to 3 product listings, basic analytics, and a public sharing link.
            </li>
            <li>
              <strong className="text-gray-900">Monthly Plan:</strong> <span className="font-semibold text-green-600">₹699 / month</span>. Up to 50 product listings, customer behavior analytics, theme customization, priority support, custom alert banners, sales charts, product videos, performance graphs, AI insights, and bulk product editing.
            </li>
            <li>
              <strong className="text-gray-900">Yearly Plan:</strong> <span className="font-semibold text-green-600">₹6,990 / year</span>. Up to 150 product listings, advanced analytics, everything in the monthly plan, plus team access and bulk CSV/Excel upload. This is equivalent to 10 months billed yearly (2 months free).
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
            <li>Phone: <a href={`tel:${siteConfig.supportPhoneHref}`} className="text-blue-600 underline">{siteConfig.supportPhone}</a></li>
            <li>WhatsApp: <a href={`https://wa.me/${siteConfig.supportWhatsAppNumber}`} className="text-blue-600 underline" target="_blank" rel="noreferrer">{siteConfig.supportPhone}</a></li>
            <li>Email: <a href={`mailto:${siteConfig.supportEmail}`} className="text-blue-600 underline">{siteConfig.supportEmail}</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PricingPolicy;
