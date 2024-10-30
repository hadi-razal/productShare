"use client";

import React, { ReactNode, useEffect } from 'react';
import { Star, Users, ShoppingBag, Globe, Zap, Shield, Box, Settings, BarChart, ArrowRight } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/fireabse';
import Link from 'next/link';

interface StatProps {
  icon: ReactNode;
  value: string;
  label: string;
}

const Stat: React.FC<StatProps> = ({ icon, value, label }) => (
  <div className="text-center space-y-2 group hover:bg-gray-100 p-4 rounded-lg transition duration-300">
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="text-slate-950">{icon}</div>
      <div className="text-5xl font-bold text-slate-950">{value}</div>
    </div>
    <div className="text-gray-600 text-sm tracking-wide uppercase">{label}</div>
  </div>
);

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="space-y-4 text-center">
    <div className="w-full p-4 bg-slate-200 rounded-md shadow-lg flex items-center justify-center">
      <div className="text-slate-950">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-950 ml-3">{title}</h3>
    </div>
    <p className="text-gray-700 leading-relaxed">{description}</p>
  </div>
);

const HomePage: React.FC = () => {
  const router = useRouter();

  const stats = [
    { icon: <Users size={24} />, value: '100K+', label: 'Active Sellers' },
    { icon: <ShoppingBag size={24} />, value: '1M+', label: 'Products Listed' },
    { icon: <Globe size={24} />, value: '180+', label: 'Countries' },
    { icon: <Star size={24} />, value: '4.9/5', label: 'Seller Rating' }
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Setup',
      description: 'Launch your online store in minutes with our intuitive setup process.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Payments',
      description: 'Integrated payment processing with top-notch security and fraud prevention.'
    },
    {
      icon: <Box className="w-8 h-8" />,
      title: 'Inventory Management',
      description: 'Robust tools to efficiently manage your products, stock levels, and orders.'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Fully Customizable',
      description: 'Create a personalized storefront with professional themes and custom CSS.'
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: 'Analytics',
      description: 'Comprehensive insights and reports to drive your business growth.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Reach',
      description: 'Sell to customers worldwide with multi-currency and language support.'
    }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  return (
    <div className="bg-gray-300">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-md border border-slate-600 bg-white shadow-lg">
            <Star className="w-4 h-4 text-slate-950" />
            <span className="text-sm text-slate-950">Premium Seller Platform</span>
          </div>
        </div>

        <div className="text-center mb-16 space-y-8">
          <h1 className="text-6xl lg:text-8xl font-bold leading-tight text-slate-950">
            <span>Showcase Your Products,</span>
            <span className="block mt-2 text-slate-800">On Product Share</span>
          </h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Create a stunning online store, showcase your products, and reach customers worldwide.
            Join thousands of successful sellers on **Product Share**.
          </p>
        </div>

        <div className="flex justify-center mb-32">
          <Link href={'/login'} className="flex items-center gap-3 px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-slate-950 hover:bg-slate-800 text-white shadow-lg">
            Start Selling Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto border-t border-gray-300 pt-8">
          {stats.map((stat, i) => (
            <Stat key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-950 mb-4">How It Works</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Get started in minutes with our powerful e-commerce platform designed for modern businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, i) => (
              <Feature key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 border-t border-gray-300">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-950 mb-6">Ready to Start Selling?</h2>
          <p className="text-gray-700 mb-12">
            Join thousands of sellers who trust **Product Share** to grow their business.
          </p>
          <div className='flex items-center justify-center'>
            <button className="flex items-center gap-3 px-6 py-3 rounded-md text-base font-medium transition-all duration-300 bg-slate-950 hover:bg-slate-800 text-white shadow-lg">
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
