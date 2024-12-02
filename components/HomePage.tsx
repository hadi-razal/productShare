"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Lottie from "lottie-react";
import {
  Star,
  Zap,
  CheckCircle,
  Globe,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import heroAnimation from "@/public/hero.json";
import { FaMobile } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const HomePage = () => {
  const router = useRouter();

  const plan = {
    title: "Subscription Plan",
    monthlyPrice: 499,
    yearlyPrice: 4999,
    description: "Perfect for small businesses and entrepreneurs",
    features: [
      "Unlimited Catalog Creation",
      "Basic Analytics",
      "WhatsApp Sharing",
      "Email Support",
      "Custom Branding",
      "Priority Support",
      "Advanced Analytics",
      "Custom Domains",
      "Integration with Social Platforms",
      "Free Updates and Upgrades",
    ],
  };

  useEffect(() => {
    // Add structured data for improved SEO
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Product Share",
      description: "Advanced Catalog Builder for Indian Businesses",
      applicationCategory: "Business Productivity",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "499",
        priceCurrency: "INR",
      },
      keywords: [
        "catalog builder india",
        "product catalog software",
        "e-commerce tool",
        "business marketing platform",
      ],
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/store");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  return (
    <>
      <Head>
        {/* Enhanced Meta Tags for SEO */}
        <title>
          Product Share | #1 Catalog Builder in India | Boost Your Business
        </title>
        <meta
          name="description"
          content="Product Share: The ultimate catalog builder for Indian businesses. Create, share, and track product catalogs effortlessly. Boost sales with AI-powered tools."
        />
        <meta
          name="keywords"
          content="catalog builder india, product share, catalog maker, business marketing, e-commerce tools, product catalog software"
        />
        <meta name="author" content="Hadi Razal" />

        {/* Open Graph for Social Media */}
        <meta
          property="og:title"
          content="Product Share - Revolutionary Catalog Builder"
        />
        <meta
          property="og:description"
          content="Transform your business with our AI-powered catalog creation and sharing platform"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.productshare.in" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Product Share - Catalog Builder for Indian Businesses"
        />
        <meta
          name="twitter:description"
          content="Create stunning product catalogs in minutes. Designed for Indian entrepreneurs."
        />
      </Head>

      {/* Hero Section with Localized Optimization */}
      <main className="bg-gray-50">
        <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white min-h-screen flex flex-col justify-center items-center">
          <div className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 items-center gap-16">
            {/* Content Section */}
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                India's <span className="text-blue-300">Smartest</span> Catalog
                Builder
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                Empower Your Business with AI-Driven Catalog Solutions
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/demo"
                  className="px-6 py-3 md:px-8 md:py-4 border-2 border-white rounded-lg hover:bg-white hover:text-blue-700 transition shadow-md"
                >
                  Watch Demo
                </Link>
              </div>
              {/* Trust Signals */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm md:text-base">
                  Trusted by 500+ Indian Businesses
                </span>
              </div>
            </div>
            {/* Animation Section */}
            <div className="flex justify-center">
              <Lottie
                animationData={heroAnimation}
                className="w-full max-w-lg"
              />
            </div>
          </div>
        </section>

        {/* Localized Features Section */}
        <section className="py-20 bg-white px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Designed for{" "}
              <span className="text-blue-600">Indian Businesses</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-blue-500" />,
                  title: "Rapid Catalog Creation",
                  description:
                    "Build professional catalogs in minutes with local language support",
                },
                {
                  icon: <Globe className="w-8 h-8 text-green-500" />,
                  title: "Multi-Platform Sharing",
                  description:
                    "WhatsApp, Telegram, and local social media integrations",
                },
                {
                  icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
                  title: "Local Market Analytics",
                  description:
                    "Insights tailored to Indian e-commerce and retail trends",
                },
                {
                  icon: <FaMobile className="w-8 h-8 text-orange-500" />,
                  title: "Mobile-First Design",
                  description:
                    "Optimized for low-bandwidth and mobile-dominant markets",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-xl hover:shadow-lg transition"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section with Local Context */}

        <section className=" py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Unlock Your Potential
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose a plan that grows with your business and provides the
                tools you need to succeed.
              </p>
            </div>

            <div className="">
              <div className="p-8 border-b">
                <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
                  {plan.title}
                </h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Monthly Plan */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative">
                  <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    Flexible
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">
                      Monthly Plan
                    </h4>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{plan.monthlyPrice}
                      </span>
                      <span className="text-gray-500 ml-2">/ month</span>
                    </div>
                    <div className="text-green-600 opacity-0 font-medium mb-3">
                      Save ₹588 annually
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group">
                      Upgrade{" "}
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Yearly Plan */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 relative">
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">
                      Yearly Plan
                    </h4>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{plan.yearlyPrice}
                      </span>
                      <span className="text-gray-500 ml-2">/ year</span>
                    </div>
                    <div className="text-green-600 font-medium mb-3">
                      Save ₹588 annually
                    </div>
                    <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group">
                      Upgrade
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-8 rounded-md">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">
                  What's Included
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Localized Testimonials */}
        <section className="py-20 bg-blue-50 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Success Stories from{" "}
              <span className="text-blue-600">Indian Entrepreneurs</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  content:
                    "Product Share helped me scale my local handicraft business across India!",
                  author: "Priya Sharma",
                  authorRole: "Handicraft Entrepreneur, Mumbai",
                  rating: 5,
                },
                {
                  content:
                    "As a small restaurant owner, this tool transformed my menu marketing strategy.",
                  author: "Rajesh Kumar",
                  authorRole: "Restaurant Owner, Bangalore",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="italic text-gray-700 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-gray-500">{testimonial.authorRole}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Localized Call to Action */}
        <section className="bg-blue-700 text-white py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl mb-8">
            Join 500+ Indian businesses transforming their product marketing
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="px-10 py-4 bg-white text-blue-700 rounded-lg hover:bg-gray-100 transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="px-10 py-4 border-2 border-white rounded-lg hover:bg-blue-800 transition"
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;
