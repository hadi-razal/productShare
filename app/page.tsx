"use client"

import React, { useEffect, useState } from 'react';
import {
  Store, BarChart2, Bot, ArrowRight, 
  ArrowUpRight, Award, Users, Globe, Zap, Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animated gradient background component
const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/20 to-violet-100/20 animate-gradient" />
  </div>
);


// Enhanced feature card with hover effects
const FeatureCard = ({ icon, title, description, delay }:any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group relative p-8 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300" />
    <div className="relative">
      <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white w-fit mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="flex items-center text-blue-600 font-medium mt-6 group-hover:text-indigo-600 transition-all">
        Learn more 
        <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
    </div>
  </motion.div>
);

// Premium store preview card
const StorePreview = ({ name, image, products, views, delay }:any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group relative p-6 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-6 overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700" 
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4">{name}</h3>
    <div className="flex justify-between items-center">
      <span className="flex items-center text-gray-700">
        <Store className="w-5 h-5 mr-2 text-blue-600" />
        {products} Products
      </span>
      <span className="flex items-center text-gray-700">
        <Users className="w-5 h-5 mr-2 text-blue-600" />
        {views} Views
      </span>
    </div>
  </motion.div>
);

const HomePage = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const stores = [
    { 
      name: 'LUXE Collection', 
      image: '/images/store1.jpg', 
      products: '2,500+', 
      views: '1.2M' 
    },
    { 
      name: 'TechVerse', 
      image: '/images/store2.jpg', 
      products: '5,000+', 
      views: '2.5M' 
    },
    { 
      name: 'Artisan Gallery', 
      image: '/images/store3.jpg', 
      products: '1,500+', 
      views: '800K' 
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
<section className="relative pt-32 pb-20 px-6">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center max-w-6xl mx-auto space-y-8"
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
        <Award className="w-8 h-8 text-blue-600" />
      </motion.div>
      <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Empowering 10,000+ Online Sellers Worldwide
      </p>
    </div>

    <h1 className="text-6xl md:text-7xl font-black text-gray-900">
      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Showcase Your Products
      </span>
      <br />
      <span className="relative">
        with a Stunning Online Catalog
        <motion.div
          className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </span>
    </h1>

    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Build a beautiful, fully customizable online catalog to display your products effortlessly, 
      reach more customers, and grow your business. No coding required.
    </p>

    <motion.div 
      className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Link href="/login">
        <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
          Start Your Catalog 
          <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
      <Link href="/demo">
        <button className="px-8 py-4 bg-white/80 backdrop-blur-lg text-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
          View Demo 
          <ArrowUpRight className="inline ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </Link>
    </motion.div>
  </motion.div>
</section>


      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-4"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Platform Features
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-center mb-16 max-w-2xl mx-auto"
          >
            Everything you need to build, scale, and optimize your enterprise commerce platform
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-4"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Success Stories
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-center mb-16 max-w-2xl mx-auto"
          >
            Join thousands of successful businesses powered by our platform
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store, idx) => (
              <StorePreview key={idx} {...store} delay={idx * 0.1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;