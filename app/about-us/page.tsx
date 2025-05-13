import React from "react";
import Head from "next/head";
import {
  MonitorSmartphone,
  ShoppingBag,
  Wrench,
  Handshake,
  Globe,
  Palette,
} from "lucide-react";
import Image from "next/image";

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
    <div className="bg-gradient-to-tr from-indigo-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-indigo-700" />
    </div>
    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
      {title}
    </h3>
    <p className="text-sm md:text-base text-gray-600">{description}</p>
  </div>
);

const AboutUs = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: "Create a Product Catalog",
      description: " Add photos, descriptions, and prices effortlessly",
    },
    {
      icon: Globe,
      title: " Share as a Website",
      description:
        "Get a unique link for your catalog to share via WhatsApp, Instagram, or anywhere.",
    },
    {
      icon: MonitorSmartphone,
      title: "Mobile-First Design",
      description:
        "Your catalog looks perfect on all devices, especially smartphones.",
    },
    {
      icon: Wrench,
      title: "Easy to Use",
      description: "No tech knowledge needed. Set up in minutes.",
    },
    {
      icon: Handshake,
      title: "Made for Small Businesses",
      description: "Tailored features to help you look professional and grow.",
    },
    {
      icon: Palette,
      title: "Customize Your Catalog",
      description:
        "Add your logo, choose colors, and make your catalog match your brand identity.",
    },
  ];

  return (
    <>
      <Head>
        <title>About Product Share - Revolutionizing Product Management</title>
        <meta
          name="description"
          content="Product Share is a revolutionary SaaS platform that simplifies product management and collaboration, enhancing team productivity and streamlining workflows."
        />
        <meta
          name="keywords"
          content="SaaS, product management, collaboration, product lifecycle, innovation, teamwork"
        />
        <meta name="author" content="Product Share" />
      </Head>

      <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen pb-16 pt-8">
        <div className="container mx-auto px-6">
          {/* Hero Section */}

          <div className="flex flex-col pl-[10px] pr-[10px] pt-[50px] sm:pl-[100px] sm:pr-[100px] md:flex-row">
            {/* image Section  */}
            <section>
              <Image
                src="/about-us.svg"
                alt="Online Store Illustration"
                width={100}
                height={100}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </section>

            {/* content Section  */}
            <section className="text-center mb-20">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                About Product Share
              </h1>
              <p className="max-w-3xl mx-auto text-base text-justify md:text-lg text-gray-700 leading-relaxed">
                At Product Share, we believe that every business—no matter how
                small—deserves an easy and affordable way to showcase their
                products online. That’s why we created Product Share: a simple,
                powerful platform designed to empower shop owners, homepreneurs,
                and small entrepreneurs who can’t afford a traditional website.{" "}
                <br /><br />
                With Product Share, you can create a beautiful, personalized
                product catalog and share it instantly as a link—no coding, no
                design skills, and absolutely no hassle.
                <br /><br /> Product Share is a sub-brand of Duoph Technologies and
                was thoughtfully designed and developed by the Duoph team to
                support the next generation of small business owners.
              </p>
            </section>
          </div>

          {/* Features Grid */}
          <section className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              What You Can Do With Product Share
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <section className="bg-white/80 backdrop-blur-md rounded-2xl px-6 py-12 shadow-md max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Visionary Mission
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              To make online product sharing simple, accessible, and affordable
              for everyone. We’re here to help your business shine—whether
              you're selling handmade crafts, clothing, food, or anything else.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
