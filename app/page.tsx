"use client"

import React, { useEffect } from 'react';
import {
  Store, Users, ShoppingBag, BarChart2, Bot, Palette, Share2,
   ArrowRight, ChevronRight,
  Award, Sparkles
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, subtext }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
    <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-4">
        <div className="text-indigo-600 bg-blue-50 p-3 rounded-lg">{icon}</div>
        <div>
          <div className="text-3xl font-bold bg-indigo-700  bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-sm font-medium text-gray-600">{label}</div>
          {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
        </div>
      </div>
    </div>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
    <div className="relative h-full p-8 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="flex flex-col gap-6">
        <div className="inline-flex text-indigo-600 bg-blue-50 p-4 rounded-xl shadow-inner group-hover:scale-110 transition-transform duration-500 w-fit">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
        <div className="mt-auto flex items-center text-indigo-600 font-medium group-hover:text-blue-700 transition-colors">
          Learn more <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </div>
);

interface StorePreviewProps {
  name: string;
  image: string;
  products: string;
  views: string;
}

const StorePreview: React.FC<StorePreviewProps> = ({ name, image, products, views }) => (
  <div className="group relative w-full" >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
    <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{products} Products</span>
        <span>{views} Views</span>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const router = useRouter();

  const stats: StatCardProps[] = [
    { icon: <Store size={24} />, value: '100+', label: 'Active Stores', subtext: '45% YoY Growth' },
    { icon: <ShoppingBag size={24} />, value: '500+', label: 'Products Listed', subtext: '100+ Categories' },
    { icon: <Users size={24} />, value: '10k+', label: 'Monthly Visitors', subtext: 'Across all stores' },
    { icon: <BarChart2 size={24} />, value: '200%', label: 'Avg. Growth', subtext: 'For active stores' },
  ];

  const features: FeatureCardProps[] = [
    {
      icon: <Store className="w-8 h-8" />,
      title: 'Custom Store Themes',
      description: 'Create a unique brand identity with customizable themes, logos, and layouts.'
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'AI Chat Assistant',
      description: 'Engage customers 24/7 with an intelligent chatbot trained on your product catalog.'
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: 'Advanced Analytics',
      description: 'Track visitor behavior, sales performance, and customer engagement in real-time.'
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: 'Easy Sharing',
      description: 'Generate beautiful product catalogs and share them instantly with custom links.'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Brand Customization',
      description: 'Match your store’s look and feel to your brand with custom colors and fonts.'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Product Optimization',
      description: 'Auto-enhance product descriptions, tags, and SEO with AI assistance.'
    }
  ];

  const storeShowcases: StorePreviewProps[] = [
    {
      name: "Fashion Boutique",
      image: "/api/placeholder/400/300",
      products: "250+",
      views: "50K"
    },
    {
      name: "Tech Store",
      image: "/api/placeholder/400/300",
      products: "1000+",
      views: "100K"
    },
    {
      name: "Artisan Crafts",
      image: "/api/placeholder/400/300",
      products: "150+",
      views: "25K"
    },
    {
      name: "Duoph Store",
      image: "/api/placeholder/400/300",
      products: "50+",
      views: "10K"
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
    <div className="min-h-screen max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.04),transparent)]" />
        <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
          <div className="flex justify-center mb-12">
            <div className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="p-1.5 bg-blue-100 rounded-full">
                <Award className="w-4 h-4 text-indigo-700 " />
              </div>
              <span className="text-sm font-medium text-gray-900 cursor-pointer">#1 Premium Sellers Store</span>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto mb-16 space-y-8">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              <span className="inline-block bg-indigo-700  bg-clip-text text-transparent">
                Your Products,
              </span>
              <span className="block mt-2 text-4xl lg:text-5xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Beautifully Showcased
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create stunning product catalogs, engage customers with AI chat, 
              and track performance with powerful analytics.
            </p>

            <div className="flex items-center justify-center gap-4">

              <Link href="/login">
                <button className="group px-8 py-4 bg-indigo-700  hover:bg-indigo-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 flex items-center gap-3">
                  Start Selling Now 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
           
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_left,rgba(37,99,235,0.04),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-indigo-700  bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-gray-600 text-lg">
              Powerful features to showcase your products and grow your business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Store Showcase Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_right,rgba(37,99,235,0.04),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-indigo-700  bg-clip-text text-transparent">
                Successful Stores
              </span>
            </h2>
            <p className="text-gray-600 text-lg">
              Join thousands of businesses already thriving on our platform
            </p>
          </div>
          <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {storeShowcases.map((store, index) => (
              <StorePreview key={index} {...store} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;