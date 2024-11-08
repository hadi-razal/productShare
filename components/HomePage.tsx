"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Star, ThumbsUp, Clock, Globe, Shield, TrendingUp, ShoppingCart, User, Check, ArrowRight, Sparkles } from 'lucide-react';
import heroAnimation from "@/public/hero.json";
import Image from 'next/image';
import { AiOutlineBulb } from 'react-icons/ai';
import { FaGlobe, FaHandsHelping, FaRegChartBar } from 'react-icons/fa';

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
    className="bg-white/90 p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-100"
  >
    <div className="flex items-center mb-6">
      <div className="w-2 h-12 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4" />
      <p className="text-xl text-gray-800 font-medium">{content}</p>
    </div>
    <div className="flex items-center">
      <Image
        unoptimized={true}
        width={0}
        height={0}
        className="rounded-full h-16 w-16 object-cover mr-4 border-2 border-blue-500"
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
              <div className="mt-10 grid grid-cols-2 gap-4">
                {[
                  { label: "AI-Driven Insights", icon: AiOutlineBulb },
                  { label: "Catalog Optimization", icon: FaRegChartBar },
                  { label: "Global Connectivity", icon: FaGlobe },
                  { label: "Dedicated Support", icon: FaHandsHelping },
                ].map(({ label, icon: Icon }) => (
                  <motion.div
                    key={label}
                    className="flex items-center gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm shadow-md"
                  >
                    <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white font-medium">{label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="mt-12 flex flex-col sm:flex-row gap-6">
                <motion.a
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-200"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.a>
                <motion.a
                  href="/demo"
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
                <div className="absolute right-10 inset-0 bg-gradient-to-tr from-purple-400 to-blue-600 opacity-60 blur-2xl rounded-full" />
                <Lottie animationData={heroAnimation} className="w-full h-full relative" loop />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Choose Us</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Discover the reasons why our clients love us and why you will too.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-t from-blue-900 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">What Our Clients Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
            See how we've helped businesses grow and succeed with our innovative platform.
          </p>

          <div className="mt-16 grid gap-8 lg:grid-cols-3 sm:grid-cols-2">
            {[
              {
                content: "This platform revolutionized our business approach!",
                author: "Jane Doe",
                authorRole: "CEO of BestCo",
                authorImage: "/praveen.jpeg",
              },
              {
                content: "Exceptional customer service and functionality.",
                author: "John Smith",
                authorRole: "Manager at WestWare",
                authorImage: "/arjun.jpg",
              },
              {
                content: "An essential tool for growth and insights.",
                author: "Emily Lee",
                authorRole: "Director at GlobalLink",
                authorImage: "/arjun.jpg",
              },
            ].map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
