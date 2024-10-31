"use client";

import React, { ReactNode, useEffect } from 'react';
import { Star, Users, ShoppingBag, Globe, Zap, Shield, Box, Settings, BarChart, ArrowRight, 
         Clock, CreditCard, MessageSquare, TrendingUp, Award, Heart, Gift, Truck } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/fireabse';
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

interface PricingTierProps {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

const PricingCard: React.FC<PricingTierProps> = ({ name, price, features, popular }) => (
  <div className={`relative bg-gray-200 rounded-lg shadow-md overflow-hidden ${
    popular ? 'ring-2 ring-slate-950' : ''
  }`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-slate-950 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
      </div>
    )}
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-950 mb-2">{name}</h3>
        <div className="text-3xl font-bold text-slate-950 mb-6">{price}</div>
        <ul className="space-y-3 text-left mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-950" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <button className={`w-full py-2 rounded-md transition-all duration-300 ${
          popular ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-950'
        } hover:opacity-90`}>
          Get Started
        </button>
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

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$49/month',
      features: [
        'Up to 1,000 products',
        'Basic analytics',
        'Email support',
        '2% transaction fee',
        '2 team members'
      ]
    },
    {
      name: 'Professional',
      price: '$149/month',
      features: [
        'Up to 10,000 products',
        'Advanced analytics',
        'Priority support',
        '1% transaction fee',
        '5 team members',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Unlimited products',
        'Custom analytics',
        'Dedicated support',
        'Custom pricing',
        'Unlimited team members',
        'Full API access'
      ]
    }
  ];

  const testimonials = [
    {
      quote: "Product Share transformed our business. We've seen a 300% increase in sales since switching.",
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
            enterprise-grade security, and seamless scalability to help you grow your 
            business faster than ever before.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-32">
          <Link href="/login" className="flex items-center gap-2 px-8 py-4 rounded-md text-lg font-medium bg-slate-950 hover:bg-slate-800 text-white shadow-md transition-all duration-300">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/demo" className="flex items-center gap-2 px-8 py-4 rounded-md text-lg font-medium bg-gray-200 hover:bg-slate-50 text-slate-950 shadow-md transition-all duration-300">
            Watch Demo
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 b border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-950 mb-4">Enterprise-Grade Features</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Built for scale with the security, reliability, and flexibility your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-950 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Join thousands of successful businesses that trust Product Share.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-8">Ready to Scale Your Business?</h2>
          <p className="text-xl text-gray-300 mb-12">
            Join over 250,000 businesses that trust Product Share to power their growth.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 rounded-md text-lg font-medium bg-gray-200 text-slate-950 hover:bg-gray-100 transition-all duration-300">
              Start Free Trial
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-md text-lg font-medium border border-white hover:bg-gray-200/10 transition-all duration-300">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
