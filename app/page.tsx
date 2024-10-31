"use client";

import React, { ReactNode, useEffect } from 'react';
import { Star, Users, ShoppingBag, Globe, Zap, Shield, Box, Settings, BarChart, 
          CreditCard, Award, ArrowRight, ChevronRight } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/fireabase';
import Link from 'next/link';

interface StatProps {
  icon: ReactNode;
  value: string;
  label: string;
  subtext?: string;
}

const StatCard: React.FC<StatProps> = ({ icon, value, label, subtext }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 to-slate-800/10 rounded-xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
    <div className="relative bg-gray-200/80 backdrop-blur-sm rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-4">
        <div className="text-slate-900 bg-slate-100 p-3 rounded-lg">{icon}</div>
        <div>
          <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-sm font-medium text-slate-600">{label}</div>
          {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
        </div>
      </div>
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: ReactNode; title: string; description: string }> = ({ 
  icon, 
  title, 
  description 
}) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 to-slate-800/10 rounded-xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
    <div className="relative h-full p-8 bg-gray-200/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="flex flex-col gap-6">
        <div className="inline-flex text-slate-900 bg-gradient-to-br from-slate-50 to-gray-100 p-4 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-500 w-fit">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
          <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
        <div className="mt-auto flex items-center text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
          Learn more <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </div>
);

const TestimonialCard: React.FC<{ 
  quote: string; 
  author: string; 
  role: string; 
  company: string 
}> = ({ quote, author, role, company }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 to-slate-800/10 rounded-xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
    <div className="relative bg-gray-200/80 backdrop-blur-sm rounded-xl border border-gray-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="flex flex-col space-y-6">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p className="text-slate-700 text-lg leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
        <div className="pt-4 border-t border-gray-200">
          <p className="font-semibold text-slate-900">{author}</p>
          <p className="text-slate-600 text-sm">{role} at {company}</p>
        </div>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const router = useRouter();

  const stats = [
    { icon: <Users size={24} />, value: '250K+', label: 'Active Sellers', subtext: '32% YoY Growth' },
    { icon: <ShoppingBag size={24} />, value: '5M+', label: 'Products Listed', subtext: '200+ Categories' },
    { icon: <Star size={24} />, value: '4.9/5', label: 'Seller Rating', subtext: '50K+ Reviews' },
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
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent)] pointer-events-none" />
        <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
          <div className="flex justify-center mb-12">
            <div className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-200/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="p-1.5 bg-yellow-100 rounded-full">
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-slate-900">Rated #1 E-commerce Platform 2024</span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto mb-16 space-y-8">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              <span className="inline-block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Transform Your Business
              </span>
              <span className="block mt-2 text-4xl lg:text-5xl bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
                With Product Share
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              The all-in-one commerce platform that combines AI-powered insights, 
              enterprise-grade security, and seamless integration.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link href="/login">
                <button className="group px-8 py-4 bg-slate-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 flex items-center gap-3">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 bg-gray-200 text-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Integrated Stats */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_left,rgba(0,0,0,0.02),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-slate-600 text-lg">
              Everything you need to scale your business, all in one place
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_right,rgba(0,0,0,0.02),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Loved by Businesses
              </span>
            </h2>
            <p className="text-slate-600 text-lg">
              Join thousands of satisfied customers who trust Product Share
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;