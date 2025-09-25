"use client";

import React, { useState } from "react";
import {
  Rocket,
  Globe,
  PieChart,
  Shield,
  ArrowRight,
  Quote,
  MessageCircle,
  Cog,
  Star,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  Award
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import HeroSection from "./HeroSection";
import PricingSection from "./PricingSection";
import FaqSection from "./FaqSection";

const Home = () => {
  const primaryColor = "#6c64cb";

  const features = [
    {
      icon: <Rocket className="w-10 h-10" style={{ color: primaryColor }} />,
      title: "Rapid Catalog Creation",
      description:
        "Streamline your product showcase with intelligent design tools and automated workflows",
      gradient: "from-purple-100 to-purple-50"
    },
    {
      icon: <Globe className="w-10 h-10 text-green-600" />,
      title: "Global Reach",
      description: "Expand your market presence across multiple platforms and reach customers worldwide",
      gradient: "from-green-100 to-green-50"
    },
    {
      icon: <PieChart className="w-10 h-10 text-blue-600" />,
      title: "Smart Analytics",
      description: "Data-driven insights to optimize your business strategy and maximize growth",
      gradient: "from-blue-100 to-blue-50"
    },
    {
      icon: <Shield className="w-10 h-10 text-teal-600" />,
      title: "Secure Platform",
      description: "Enterprise-grade security and data protection for your business",
      gradient: "from-teal-100 to-teal-50"
    },
    {
      icon: <Cog className="w-10 h-10 text-orange-600" />,
      title: "Customizable Solutions",
      description: "Tailor-made features to fit your unique business needs and requirements",
      gradient: "from-orange-100 to-orange-50"
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-red-600" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for uninterrupted operations and peace of mind",
      gradient: "from-red-100 to-red-50"
    },
  ];

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "500+", label: "Happy Customers" },
    { icon: <TrendingUp className="w-8 h-8" />, value: "500%", label: "Average Growth" },
    { icon: <Award className="w-8 h-8" />, value: "99.9%", label: "Uptime" },
    { icon: <Zap className="w-8 h-8" />, value: "2 min", label: "Setup Time" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "E-commerce Entrepreneur",
      quote:
        "This platform completely revolutionized the way we showcase and market our products. Our sales increased by 300% in just 3 months!",
      location: "Mumbai",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=100&h=100&fit=crop&crop=face",
      company: "Fashion Hub"
    },
    {
      name: "Rahul Gupta",
      role: "Small Business Owner",
      quote:
        "An incredibly intuitive and powerful marketing solution that helped boost my sales dramatically. The support team is amazing!",
      location: "Delhi",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      company: "Tech Solutions"
    },
    {
      name: "Anita Patel",
      role: "Digital Marketer",
      quote:
        "The analytics and insights provided are game-changing. I can now make data-driven decisions that actually impact my bottom line.",
      location: "Bangalore",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      company: "Growth Co"
    }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <HeroSection />

      {/* Enhanced Marquee Section */}
      <div className="w-full flex flex-col gap-4 bg-gradient-to-r from-gray-50 via-purple-50 to-gray-50 py-8">
        <Marquee
          loop={0}
          speed={60}
          gradient={false}
          className="flex items-center"
        >
          {marqueeMessages1.map((message, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 mx-2 py-3 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="text-gray-700 font-medium text-sm text-center whitespace-nowrap">
                {message}
              </span>
            </motion.div>
          ))}
        </Marquee>

        <Marquee loop={0} speed={60} direction="right" gradient={false}>
          {marqueeMessages2.map((message, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-6 mx-2 py-3 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <span className="text-gray-700 font-medium text-sm text-center whitespace-nowrap">
                {message}
              </span>
            </motion.div>
          ))}
        </Marquee>

        {/* Enhanced CTA Message */}
        <motion.div 
          className="flex items-center justify-center mt-6 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-base font-medium mb-2">
              Join thousands of successful businesses
            </p>
            <p className="text-sm text-gray-500">
              Let us help you grow your business with a powerful, easy-to-use catalog builder.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center text-white"
                variants={itemVariants}
              >
                <div className="flex justify-center mb-3" style={{ color: primaryColor }}>
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the features that make us the preferred choice for businesses worldwide
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className={`relative p-8 bg-gradient-to-br ${feature.gradient} rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-center group-hover:text-gray-900 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed text-center">
                {feature.description}
              </p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <FaqSection />

      {/* Enhanced Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 bg-gray-50">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600">
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
              className="bg-white shadow-xl rounded-2xl p-8 relative hover:shadow-2xl transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div 
                className="absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <Quote className="text-white w-4 h-4" />
              </div>
              
              <div className="flex items-center mb-4 pt-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  <p className="text-gray-400 text-xs">{testimonial.company} • {testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-base text-gray-700 leading-relaxed font-light italic">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;