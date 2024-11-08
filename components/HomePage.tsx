"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Star, ThumbsUp, Clock, Globe, Shield, TrendingUp, ShoppingCart, User, Check, ArrowRight, Sparkles } from 'lucide-react';
import heroAnimation from "@/public/hero.json";
import Image from 'next/image';

// Enhanced interface definitions
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

interface TestimonialCardProps {
  content: string;
  author: string;
  authorRole: string;
  authorImage: string;
}

const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`flex flex-col items-center p-8 rounded-2xl backdrop-blur-sm ${gradient} border border-white/20 shadow-xl`}
  >
    <div className="p-3 bg-white/90 rounded-xl shadow-inner">
      {icon}
    </div>
    <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
    <p className="mt-3 text-white/90 text-center">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ content, author, authorRole, authorImage }: TestimonialCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white/90 p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-100"
  >
    <div className="flex items-center mb-6">
      <div className="w-2 h-12 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4" />
      <p className="text-xl text-gray-800 font-medium">{content}</p>
    </div>
    <div className="flex items-center">
      <Image
        unoptimized={true}
        width={48}
        height={48}
        className="rounded-full object-cover mr-4 border-2 border-blue-500"
        src={authorImage}
        alt={author}
      />
      <div>
        <p className="font-bold text-gray-900">{author}</p>
        <p className="text-blue-600">{authorRole}</p>
      </div>
    </div>
  </motion.div>
);

const features = [
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: "Premium Support",
    description: "24/7 dedicated assistance from our expert team",
    gradient: "bg-gradient-to-br from-yellow-500/90 to-orange-600/90"
  },
  {
    icon: <User className="w-8 h-8 text-blue-500" />,
    title: "User-Centric Design",
    description: "Intuitive interface with stunning customization options",
    gradient: "bg-gradient-to-br from-blue-500/90 to-indigo-600/90"
  },
  {
    icon: <Globe className="w-8 h-8 text-emerald-500" />,
    title: "Global Reach",
    description: "Connect with customers worldwide instantly",
    gradient: "bg-gradient-to-br from-emerald-500/90 to-teal-600/90"
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
    title: "Smart Analytics",
    description: "Data-driven insights to boost your business",
    gradient: "bg-gradient-to-br from-purple-500/90 to-pink-600/90"
  }
];

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section with Geometric Patterns */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated background patterns */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              {/* Trust badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-5 h-5" />
                <span>Trusted by 1000+ Global Sellers</span>
              </motion.div>

              {/* Main heading with gradient text */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Transform Your
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Digital Store
                </span>
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl">
                Create stunning product catalogs, share instantly, and grow your business with our powerful platform.
              </p>

              {/* Feature badges */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                {['AI-Powered Analytics', 'Smart Catalog', 'Global Reach', 'Premium Support'].map((feature) => (
                  <motion.div
                    key={feature}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="mt-12 flex flex-col sm:flex-row gap-6">
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.a>
                <motion.a
                  href="/demo"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border-2 border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                >
                  Watch Demo
                </motion.a>
              </div>
            </motion.div>

            {/* Hero animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl" />
                <Lottie
                  animationData={heroAnimation}
                  loop={true}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-white mb-6"
            >
              Why Choose Product Share?
            </motion.h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of product management with our cutting-edge features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Plan Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Start Growing Today</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Try all premium features free for 3 days. No credit card required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-2xl shadow-xl"
          >
            <div className="bg-white p-8 rounded-xl">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-semibold text-gray-900">Premium Plan</span>
                  </div>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-gray-900">₹99</span>
                    <span className="text-xl text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {[
                      'Unlimited Products',
                      'Advanced Analytics',
                      'Priority Support',
                      'Custom Branding',
                      'API Access'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1 w-full">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Your Free Trial</h3>
                    <p className="text-gray-600 mb-6">
                      Get full access to all premium features for 3 days. No credit card required.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg"
                    >
                      Start Free Trial
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;