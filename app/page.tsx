"use client";

import React, { useEffect, useState } from 'react';
import {
  Store, BarChart2, Bot, ArrowRight,
  ArrowUpRight, Award, Users, Globe, Zap, Lock,
  ArrowBigDown,
  ArrowBigDownDash,
  ArrowDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdOutlineKeyboardDoubleArrowDown } from 'react-icons/md';

// Animated gradient background component
const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-800 to-transparent animate-gradient" />
  </div>
);

// Enhanced feature card with hover effects
const FeatureCard = ({ icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group relative p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-900/0 to-purple-900/0 group-hover:from-indigo-900/5 group-hover:to-purple-900/5 transition-all duration-300" />
    <div className="relative">
      <div className="p-4 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl text-white w-fit mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="flex items-center text-indigo-600 font-medium mt-6 group-hover:text-purple-600 transition-all">
        Learn more
        <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
    </div>
  </motion.div>
);



// Header component
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-r from-indigo-900 to-purple-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-white">My Catalog</h1>
        <nav className="space-x-4">
          <Link href="/login" className="text-gray-200 hover:text-indigo-300">Login</Link>
          <Link href="/demo" className="text-gray-200 hover:text-indigo-300">Demo</Link>
        </nav>
      </div>
    </header>
  );
};

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
      <section className="relative flex gap-5 flex-col items-center justify-center py-20 px-6 min-h-[calc(100vh-90px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl mx-auto space-y-6 md:space-y-8 md:mb-32 mb-16"
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
              <Award className="w-5 h-5 text-white" />
            </motion.div>
            <p className="text-base md:text-lg font-semibold text-white">
              Empowering 10,000+ Online Sellers Worldwide
            </p>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Showcase Your Products
            </span>
            <br />
            <span className="relative">
              with a Stunning Online Catalog
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-200">
            Seamlessly create, manage, and promote your catalog with our powerful tools.
          </p>
          <Link href="/login" className="inline-block mt-6 px-6 py-3 text-white border-white border rounded-md transition duration-300">
            Create Your Store
          </Link>
        </motion.div>
        <motion.div
          className="absolute bottom-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <MdOutlineKeyboardDoubleArrowDown size={40} className="animate-bounce text-white" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-4xl text-center font-bold mb-10">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.2} />
          ))}
        </div>
      </section>


    </div>
  );
};

export default HomePage;
