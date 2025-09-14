import React from "react";
import {
  MonitorSmartphone,
  ShoppingBag,
  Wrench,
  Handshake,
  Globe,
  Palette,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
    <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-4 group-hover:scale-105 transition-transform">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const StatsCard = ({ number, label, icon: Icon }: any) => (
  <div className="text-center">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 mb-3">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="text-2xl font-bold text-blue-600">{number}</div>
      <div className="text-gray-600 text-xs uppercase tracking-wide">
        {label}
      </div>
    </div>
  </div>
);

const AboutUs = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: "Create Product Catalogs",
      description:
        "Build stunning product showcases with photos, descriptions, and prices in minutes.",
    },
    {
      icon: Globe,
      title: "Instant Web Sharing",
      description:
        "Get a unique, professional link for your catalog to share across platforms.",
    },
    {
      icon: MonitorSmartphone,
      title: "Mobile-Optimized",
      description:
        "Your catalogs look flawless on every device, especially smartphones.",
    },
    {
      icon: Wrench,
      title: "Zero Technical Skills",
      description:
        "No coding or design expertise needed. Launch in minutes.",
    },
    {
      icon: Handshake,
      title: "Small Business Focused",
      description:
        "Built for entrepreneurs and small businesses to compete with larger brands.",
    },
    {
      icon: Palette,
      title: "Brand Customization",
      description:
        "Add logos, colors, and layouts to match your brand identity.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Businesses", icon: Users },
    { number: "500K+", label: "Products", icon: ShoppingBag },
    { number: "50+", label: "Countries", icon: Globe },
  ];

  return (
    <div className="bg-white text-gray-900">
      {/* Hero */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-5 py-2 rounded-full text-sm text-blue-600 mb-6">
          <Sparkles className="w-4 h-4" />
          Empowering Small Businesses
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          About{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product Share
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          We believe every business deserves an affordable way to showcase their products online.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto">
          {stats.map((s, i) => (
            <StatsCard key={i} {...s} />
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-sm text-blue-600 mb-4">
            <Target className="w-4 h-4" /> Our Story
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Built for the{" "}
            <span className="text-blue-600">Everyday Entrepreneur</span>
          </h2>
        </div>
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto text-gray-700 space-y-5 leading-relaxed">
          <p>
            Product Share was born from a simple observation: traditional websites are expensive and complex for small business owners who just want to showcase products easily.
          </p>
          <p>
            We created a platform that strips away complexity while amplifying impact. No coding, no design skills, no hosting fees—just simple product sharing that works.
          </p>
          <p>
            As a sub-brand of <strong className="text-blue-600">Duoph Technologies</strong>, Product Share combines enterprise-grade reliability with small-business simplicity.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full text-sm text-blue-600 mb-4">
            <Sparkles className="w-4 h-4" /> Platform Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tools to Help You <span className="text-blue-600">Succeed Online</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed for small businesses, entrepreneurs, and creators.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-5 py-2 rounded-full text-sm text-blue-600 mb-6">
            <Target className="w-4 h-4" /> Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
            Democratizing Digital Commerce
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            Our mission is to make online product sharing simple, accessible, and affordable. From handmade crafts to clothing and food, we help your business shine.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-100 px-6 py-2 rounded-full text-blue-600 text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Empowering businesses in 50+ countries
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
