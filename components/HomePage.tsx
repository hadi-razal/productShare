"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, 
  Globe, 
  Target, 
  Check, 
} from "lucide-react";

const AnimatedHomePage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: <Rocket className="w-12 h-12 text-blue-500" />,
      title: "Lightning-Fast Catalog Creation",
      description: "Transform your product showcase in seconds with AI-powered design",
      details: [
        "AI-Driven Template Generation",
        "Instant Brand Customization",
        "One-Click Publishing"
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Globe className="w-12 h-12 text-green-500" />,
      title: "Unlimited Market Reach",
      description: "Expand beyond boundaries with multi-platform integration",
      details: [
        "15+ Sharing Platforms",
        "Localized Language Support",
        "Global Visibility"
      ],
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Target className="w-12 h-12 text-purple-500" />,
      title: "Smart Analytics Engine",
      description: "Real-time insights that drive business growth",
      details: [
        "Predictive Trend Analysis",
        "Competitor Benchmarking",
        "Personalized Recommendations"
      ],
      color: "from-purple-500 to-pink-600"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "E-commerce Entrepreneur",
      quote: "Product Share revolutionized how I present my products online!",
      location: "Mumbai",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Rahul Gupta",
      role: "Small Business Owner",
      quote: "The AI-powered tools are game-changing for my marketing strategy.",
      location: "Delhi",
      avatar: "https://randomuser.me/api/portraits/men/79.jpg"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white overflow-hidden">
      {/* Hero Section with Enhanced Interactivity */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mx-auto max-w-7xl px-4 py-20 md:pl-10 min-h-screen flex items-center"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-6 leading-tight"
            >
              Revolutionize Your <span className="text-blue-300">Business Catalog</span>
            </motion.h1>
            <motion.p
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              AI-Powered Catalog Solutions for Modern Indian Entrepreneurs
            </motion.p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 rounded-lg hover:shadow-xl transition"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-800 transition"
              >
                Watch Demo
              </motion.button>
            </div>
          </div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map((item) => (
                  <motion.div 
                    key={item} 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: item * 0.1,
                      type: "spring"
                    }}
                    className="bg-white/30 rounded-md h-16 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section with Hover Effects */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                type: "spring"
              }}
              whileHover={{ 
                scale: 1.05,
                background: `linear-gradient(to right, ${feature.color})`
              }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl transition-all duration-300 hover:shadow-2xl"
            >
              {feature.icon}
              <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
              <p className="text-gray-300 mt-2">{feature.description}</p>
              <ul className="mt-4 space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-blue-200">
                    <Check className="mr-2 text-green-400" size={16} />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Testimonials Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Success Stories from Entrepreneurs
        </h2>
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg p-8 rounded-xl relative"
            >
              <p className="italic text-gray-300 mb-6 text-xl">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonials[activeTestimonial].avatar} 
                  alt={testimonials[activeTestimonial].name}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold text-lg">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-blue-200">
                    {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].location}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === activeTestimonial 
                        ? 'bg-blue-500' 
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default AnimatedHomePage;