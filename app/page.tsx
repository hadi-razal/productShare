"use client";

import React, { ReactNode, useEffect } from 'react';
import { Star, Users, ShoppingBag, Globe, Zap, Shield, Box, Settings, BarChart, ArrowRight, 
          CreditCard, Award} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/fireabase'; // Make sure the path is correct
import Link from 'next/link';

interface StatProps {
  icon: ReactNode;
  value: string;
  label: string;
  subtext?: string;
}

const StatCard: React.FC<StatProps> = ({ icon, value, label, subtext }) => (
  <div className="bg-gray-200 rounded-lg shadow-md group hover:shadow-xl transition duration-300">
    <div className="p-6">
      <div className="flex flex-col items-center space-y-2">
        <div className="text-slate-950 bg-slate-100 p-3 rounded-full">{icon}</div>
        <div className="text-4xl font-bold text-slate-950">{value}</div>
        <div className="text-sm font-medium text-slate-950 uppercase tracking-wide">{label}</div>
        {subtext && <div className="text-xs text-gray-600">{subtext}</div>}
      </div>
    </div>
  </div>
);



const FeatureCard: React.FC<{ icon: ReactNode; title: string; description: string }> = ({ 
  icon, 
  title, 
  description 
}) => (
  <div className="space-y-4">
    <div className="w-full p-6 bg-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className="text-slate-950 bg-slate-100 p-3 rounded-lg">{icon}</div>
        <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      </div>
      <p className="mt-4 text-gray-700 leading-relaxed">{description}</p>
    </div>
  </div>
);

const TestimonialCard: React.FC<{ 
  quote: string; 
  author: string; 
  role: string; 
  company: string 
}> = ({ quote, author, role, company }) => (
  <div className="bg-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex flex-col space-y-4">
      <div className="text-slate-950">
        <Star className="w-6 h-6" />
      </div>
      <p className="text-gray-700 italic">"{quote}"</p>
      <div className="mt-4">
        <p className="font-semibold text-slate-950">{author}</p>
        <p className="text-gray-600 text-sm">{role} at {company}</p>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const router = useRouter();

  const stats = [
    { icon: <Users size={24} />, value: '250K+', label: 'Active Sellers', subtext: '32% YoY Growth' },
    { icon: <ShoppingBag size={24} />, value: '5M+', label: 'Products Listed', subtext: 'Across 200+ Categories' },
    { icon: <Star size={24} />, value: '4.9/5', label: 'Seller Rating', subtext: 'From 50K+ Reviews' },
    { icon: <Globe size={24} />, value: '180+', label: 'Countries', subtext: 'Global Reach' },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI-Powered Optimization',
      description: 'Smart pricing, inventory forecasting, and customer insights powered by advanced machine learning.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified with end-to-end encryption and advanced fraud prevention.'
    },
    {
      icon: <Box className="w-8 h-8" />,
      title: 'Unified Commerce',
      description: 'Manage all your sales channels, inventory, and fulfillment from a single dashboard.'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Flexible Payments',
      description: 'Accept 50+ payment methods with automated reconciliation and instant payouts.'
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Real-time metrics, custom reports, and predictive insights for data-driven decisions.'
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'API-First Platform',
      description: 'Extensible architecture with webhooks, SDKs, and comprehensive API documentation.'
    }
  ];

  
  const testimonials = [
    {
      quote: "Product Share transformed our business. We have seen a 300% increase in sales since switching.",
      author: "Sarah Johnson",
      role: "CEO",
      company: "Fashion Boutique Inc"
    },
    {
      quote: "The AI-powered insights have been game-changing for our inventory management.",
      author: "Michael Chen",
      role: "Operations Director",
      company: "Tech Retail Co"
    },
    {
      quote: "Best customer support I've experienced. They're always one step ahead.",
      author: "David Miller",
      role: "Founder",
      company: "Outdoor Gear Ltd"
    }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-600 bg-gray-200 shadow-md">
            <Award className="w-4 h-4 text-slate-950" />
            <span className="text-sm text-slate-950">Rated #1 E-commerce Platform 2024</span>
          </div>
        </div>

        <div className="text-center mb-10 space-y-8">
          <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-slate-950">
            <span>Transform Your Business</span>
            <span className="block mt-2 text-slate-800">With Product Share</span>
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            The all-in-one commerce platform that combines AI-powered insights, 
            enterprise-grade security, and seamless integration for maximum efficiency.
          </p>
          <Link href="/signup">
            <button className="mt-6 px-6 py-3 text-white bg-slate-950 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-slate-950 mb-12">Testimonials</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 ">
        <h2 className="text-3xl font-bold text-center text-slate-950 mb-12">Features</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-slate-950 mb-12">Testimonials</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

     
    </div>
  );
};

export default HomePage;
