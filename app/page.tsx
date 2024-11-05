"use client";

import React, { useEffect, useState } from 'react';
import {
  Store, BarChart2, Bot,
  ArrowRight, ArrowUpRight,
  Award, Users, Globe, Zap, Lock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdOutlineKeyboardDoubleArrowDown } from 'react-icons/md';

// Enhanced feature card with hover effects
const FeatureCard = ({ icon, title, description, delay }:any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="group relative p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-950/0 to-blue-950/0 group-hover:from-blue-950/10 group-hover:to-blue-950/10 transition-all duration-300" />
    <div className="relative flex flex-col items-center text-center">
      <div className="p-4 bg-gradient-to-br from-blue-950 to-blue-700 rounded-lg text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="flex items-center text-blue-950 font-medium mt-4 group-hover:text-blue-600 transition-all">
        Learn more
        <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push('/store');
    });
    return () => unsubscribe();
  }, [router]);

  const features = [
    {
      icon: <Store className="w-8 h-8" />,
      title: 'AI-Powered Store Themes',
      description: 'Create unique, conversion-optimized storefronts with our AI theme generator.'
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: '24/7 AI Customer Support',
      description: 'Intelligent chatbots that learn from your business and delight customers.'
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: 'Predictive Analytics',
      description: 'Forecast trends and optimize inventory with machine learning insights.'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Military-grade encryption and advanced fraud prevention systems.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Commerce',
      description: 'Sell worldwide with automatic currency and language optimization.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Performance',
      description: 'Sub-second page loads and real-time inventory updates.'
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      <section className="relative flex flex-col items-center justify-center py-32 px-4 min-h-screen bg-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl mx-auto flex flex-col items-center space-y-6 md:space-y-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-8">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Award className="w-4 h-4 text-blue-950" />
            </motion.div>
            <p className="text-lg text-blue-950 md:text-xl font-semibold">
              Empowering 10,000+ Online Sellers Worldwide
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-950 leading-tight">
            <span className="text-blue-950">
              Showcase Your Products
            </span>
            <br />
            <span className="text-blue-950">
              with a Stunning Online Catalog
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-950 max-w-2xl mx-auto">
            Seamlessly create, manage, and promote your catalog with our powerful tools.
          </p>
          <Link href="/login" className="inline-block mt-6 px-8 py-4 bg-blue-950 text-white border border-blue-950 rounded-md transition duration-300 hover:bg-white hover:text-blue-950">
            Create Your Store
          </Link>
        </motion.div>
        <motion.div
          className="absolute bottom-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <MdOutlineKeyboardDoubleArrowDown size={40} className="animate-bounce text-blue-950" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-4xl text-center font-bold text-blue-950 mb-10">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.2} />
          ))}
        </div>
      </section>

      <footer className="py-10 bg-gray-800 text-gray-300">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} My Catalog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
