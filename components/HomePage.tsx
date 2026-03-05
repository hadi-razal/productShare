"use client";

import React from "react";
import {
  Rocket,
  Globe,
  PieChart,
  Shield,
  Quote,
  MessageCircle,
  Cog,
  Star,
  UserPlus,
  PackagePlus,
  Share2,
  ArrowRight,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import HeroSection from "./HeroSection";
import PricingSection from "./PricingSection";
import FaqSection from "./FaqSection";

const primaryColor = "#6c64cb";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  {
    icon: <Rocket className="w-6 h-6 text-white" />,
    iconBg: "from-purple-500 to-primary",
    title: "Rapid Catalog Creation",
    description: "Streamline your product showcase with intelligent design tools and automated workflows",
    num: "01",
  },
  {
    icon: <Globe className="w-6 h-6 text-white" />,
    iconBg: "from-green-400 to-green-600",
    title: "Global Reach",
    description: "Expand your market presence across multiple platforms and reach customers worldwide",
    num: "02",
  },
  {
    icon: <PieChart className="w-6 h-6 text-white" />,
    iconBg: "from-blue-400 to-blue-600",
    title: "Smart Analytics",
    description: "Data-driven insights to optimize your business strategy and maximize growth",
    num: "03",
  },
  {
    icon: <Shield className="w-6 h-6 text-white" />,
    iconBg: "from-teal-400 to-teal-600",
    title: "Secure Platform",
    description: "Enterprise-grade security and data protection for your business",
    num: "04",
  },
  {
    icon: <Cog className="w-6 h-6 text-white" />,
    iconBg: "from-orange-400 to-orange-600",
    title: "Customizable Solutions",
    description: "Tailor-made features to fit your unique business needs and requirements",
    num: "05",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-white" />,
    iconBg: "from-red-400 to-red-600",
    title: "24/7 Support",
    description: "Round-the-clock assistance for uninterrupted operations and peace of mind",
    num: "06",
  },
];

const steps = [
  {
    icon: <UserPlus className="w-7 h-7 text-white" />,
    title: "Sign Up Free",
    description: "Create your account in 30 seconds — no credit card required.",
  },
  {
    icon: <PackagePlus className="w-7 h-7 text-white" />,
    title: "Add Your Products",
    description: "Upload photos, set prices, and add descriptions in minutes.",
  },
  {
    icon: <Share2 className="w-7 h-7 text-white" />,
    title: "Share & Sell",
    description: "Share your catalog link on WhatsApp, Instagram, or anywhere your customers are.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    initials: "PS",
    avatarBg: "bg-purple-500",
    role: "E-commerce Entrepreneur",
    quote: "This platform completely revolutionized the way we showcase and market our products. Our sales increased by 300% in just 3 months!",
    location: "Mumbai",
    rating: 5,
    company: "Fashion Hub",
  },
  {
    name: "Rahul Gupta",
    initials: "RG",
    avatarBg: "bg-indigo-500",
    role: "Small Business Owner",
    quote: "An incredibly intuitive and powerful marketing solution that helped boost my sales dramatically. The support team is amazing!",
    location: "Delhi",
    rating: 5,
    company: "Tech Solutions",
  },
  {
    name: "Anita Patel",
    initials: "AP",
    avatarBg: "bg-teal-500",
    role: "Digital Marketer",
    quote: "The analytics and insights provided are game-changing. I can now make data-driven decisions that actually impact my bottom line.",
    location: "Bangalore",
    rating: 5,
    company: "Growth Co",
  },
];

const stats = [
  { value: "500+", label: "Active Sellers" },
  { value: "10,000+", label: "Products Listed" },
  { value: "₹2Cr+", label: "Revenue Generated" },
  { value: "4.9★", label: "Average Rating" },
];

const marqueeMessages1 = [
  "🚀 Boost Your Sales with Ease",
  "🌟 Create Stunning E-Store Websites",
  "⚡ Effortless Catalog Management",
  "📈 Marketing Made Simple",
  "💡 Sell Smarter, Not Harder",
  "🎯 Your Online Store, Our Priority",
  "🔥 Seamless Product Organization",
  "🤖 AI-Powered Marketing Tools",
  "📊 Your Growth, Our Mission",
  "⏱️ Build Your Catalog in Minutes",
];

const marqueeMessages2 = [
  "💰 Maximize Your Revenue Potential",
  "📱 Effortless Product Uploads",
  "🎨 Your Catalog, Your Brand",
  "✨ Customize Your Online Store",
  "🔓 Unlock Digital Marketing Power",
  "🌐 Transform How You Sell Online",
  "📋 Optimize Your Product Listings",
  "🕐 Sell Anywhere, Anytime",
  "🎪 Reach More Customers Faster",
  "👥 Increase Visibility & Engagement",
];

const Home = () => {
  const router = useRouter();

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <HeroSection />

      {/* Stats Strip */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants} className="space-y-1">
                <p className="text-3xl font-bold" style={{ color: primaryColor }}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="w-full flex flex-col gap-4 bg-gradient-to-r from-gray-50 via-purple-50 to-gray-50 py-8">
        <Marquee loop={0} speed={60} gradient={false} className="flex items-center">
          {marqueeMessages1.map((message, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-full px-6 mx-2 py-3 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                {message}
              </span>
            </motion.div>
          ))}
        </Marquee>

        <Marquee loop={0} speed={60} direction="right" gradient={false}>
          {marqueeMessages2.map((message, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-200 rounded-full px-6 mx-2 py-3 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                {message}
              </span>
            </motion.div>
          ))}
        </Marquee>
      </div>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
            Why Product Share
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
            Everything You Need to Sell Online
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Discover the features that make us the preferred choice for businesses worldwide
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative p-8 bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              {/* Number badge */}
              <span className="absolute top-6 right-6 text-2xl font-bold text-gray-200 group-hover:text-primary/20 transition-colors select-none">
                {feature.num}
              </span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
              Simple Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              From Sign-Up to Sales in 3 Steps
            </h2>
            <p className="text-lg text-gray-500">
              No tech skills needed. Get your catalog live in minutes.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-primary/20 z-0" style={{ left: "16.67%", right: "16.67%" }} />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center relative z-10"
                variants={itemVariants}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, #a78bfa)` }}
                >
                  {step.icon}
                </div>
                <div
                  className="absolute -top-3 -right-3 w-7 h-7 rounded-full hidden md:flex items-center justify-center text-xs font-bold text-white shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <FaqSection />

      <PricingSection />

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-500">
              Real stories from real businesses that transformed their success
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-8 relative hover:shadow-2xl transition-all duration-300 border border-gray-100"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div
                  className="absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Quote className="text-white w-4 h-4" />
                </div>

                <div className="flex items-center mb-4 pt-4">
                  <div className={`w-12 h-12 rounded-full ${testimonial.avatarBg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {testimonial.initials}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    <p className="text-gray-400 text-xs">{testimonial.company} · {testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA Band */}
      <section
        className="py-20 px-4 sm:px-6 text-white"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, #7c3aed, #4f46e5)` }}
      >
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg text-white/80">
            Join 500+ sellers already using Product Share to showcase and sell their products online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/register")}
              className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Free Today →
            </button>
            <button
              onClick={() => router.push("/pricing")}
              className="border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all"
            >
              View Pricing
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
