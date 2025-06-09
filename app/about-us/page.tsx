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
  <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-primary/20 overflow-hidden">
    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="bg-primary w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const StatsCard = ({ number, label, icon: Icon }: any) => (
  <div className="text-center group">
    <div className="bg-primary/10 rounded-2xl p-6 mb-4 transform group-hover:scale-105 transition-all duration-300">
      <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
        {number}
      </div>
      <div className="text-gray-600 text-sm uppercase tracking-wide">
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
        "Build stunning product showcases with photos, descriptions, and prices in minutes. Our intuitive interface makes catalog creation effortless.",
    },
    {
      icon: Globe,
      title: "Instant Web Sharing",
      description:
        "Get a unique, professional link for your catalog to share across WhatsApp, Instagram, Facebook, or any platform where your customers are.",
    },
    {
      icon: MonitorSmartphone,
      title: "Mobile-Optimized Design",
      description:
        "Your catalogs look flawless on every device, with special attention to smartphone experiences where most customers browse.",
    },
    {
      icon: Wrench,
      title: "Zero Technical Skills",
      description:
        "No coding, no design expertise needed. Our platform is built for business owners, not developers. Set up and launch in minutes.",
    },
    {
      icon: Handshake,
      title: "Small Business Focused",
      description:
        "Purpose-built for entrepreneurs, homepreneurs, and small businesses with features that help you compete with larger companies.",
    },
    {
      icon: Palette,
      title: "Brand Customization",
      description:
        "Add your logo, choose brand colors, customize layouts, and create a cohesive brand experience that reflects your business identity.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Businesses", icon: Users },
    { number: "500K+", label: "Products", icon: ShoppingBag },
    { number: "50+", label: "Countries", icon: Globe },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative container mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-8 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">
                Empowering Small Businesses Worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Product Share
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-4xl mx-auto">
              We believe every business—no matter how small—deserves a powerful,
              affordable way to showcase their products online.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-20">
        {/* Story Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Built for the{" "}
                <span className="text-primary">Everyday Entrepreneur</span>
              </h2>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-primary/20">
              <div className="text-gray-700 leading-relaxed space-y-6">
                <p>
                  Product Share was born from a simple observation: traditional
                  websites are expensive, complex, and often overkill for small
                  business owners who just want to showcase their products
                  beautifully and share them easily.
                </p>
                <p>
                  We created a platform that strips away the complexity while
                  amplifying the power. No coding required, no design skills
                  needed, no monthly hosting fees to worry about. Just pure,
                  simple product sharing that works.
                </p>
                <p>
                  As a proud sub-brand of{" "}
                  <strong className="text-primary">Duoph Technologies</strong>,
                  Product Share combines enterprise-grade reliability with
                  small-business simplicity, designed and developed by our
                  passionate team to support the next generation of
                  entrepreneurs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">
                Platform Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{" "}
              <span className="text-primary">Succeed Online</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed specifically for small businesses,
              entrepreneurs, and anyone looking to share their products
              professionally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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

        {/* Mission Section */}
        <section className="py-20">
          <div className="relative">
            <div className="relative bg-white rounded-3xl p-12 md:p-16 text-center shadow-2xl border border-primary/20">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-8 border border-primary/20">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-primary font-semibold">Our Mission</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
                  Democratizing Digital Commerce
                </h2>

                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-8">
                  To make online product sharing simple, accessible, and
                  affordable for everyone. We're here to help your business
                  shine—whether you're selling handmade crafts, clothing, food,
                  or anything your heart creates.
                </p>

                <div className="inline-flex items-center gap-3 bg-primary/10 px-8 py-4 rounded-full border border-primary/20">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-primary font-medium">
                    Empowering businesses in 50+ countries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
