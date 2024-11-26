"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Star, Zap, CheckCircle, Globe, TrendingUp } from "lucide-react";
import heroAnimation from "@/public/hero.json";
import Image from "next/image";
import { FaMobile } from "react-icons/fa";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// Enhanced interfaces
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  details?: string[];
}

interface TestimonialCardProps {
  content: string;
  author: string;
  authorRole: string;
  authorImage: string;
  rating: number;
}

interface PricingPlanProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  isMostPopular?: boolean;
}

// Enhanced Components
const FeatureCard = ({ icon, title, description, gradient, details }: FeatureCardProps) => (
  <motion.div
    className={`flex flex-col justify-between p-6 rounded-3xl shadow-xl ${gradient} border border-white/10 transform transition-all hover:scale-105`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div>
      <div className="p-4 bg-white/90 rounded-xl shadow-inner w-fit mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {details && (
        <ul className="space-y-2 text-sm text-gray-700">
          {details.map((detail, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  </motion.div>
);

const TestimonialCard = ({ content, author, authorRole, authorImage, rating }: TestimonialCardProps) => (
  <motion.div
    className="bg-white p-8 pt-10 rounded-3xl shadow-xl flex flex-col justify-between relative"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute top-4 right-4 flex">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-lg text-gray-700 italic mb-6 flex-grow">"{content}"</p>
    <div className="flex items-center">
      <Image
        unoptimized
        width={56}
        height={56}
        className="rounded-full w-16 h-16 object-cover border-2 border-blue-100"
        src={authorImage}
        alt={author}
      />
      <div className="ml-4">
        <p className="font-bold text-gray-900 text-xl">{author}</p>
        <p className="text-sm text-gray-500 mt-1">{authorRole}</p>
      </div>
    </div>
  </motion.div>
);

const PricingPlan = ({ title, price, description, features, isMostPopular }: PricingPlanProps) => (
  <div 
    className={`
      p-8 rounded-3xl shadow-xl relative overflow-hidden 
      ${isMostPopular 
        ? 'bg-blue-600 text-white border-4 border-blue-400' 
        : 'bg-white text-gray-800 border border-gray-200'}
    `}
  >
    {isMostPopular && (
      <div className="absolute top-0 right-0 bg-blue-400 text-white px-4 py-1 transform rotate-45 translate-x-1/4 -translate-y-1/2">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className={`mb-6 ${isMostPopular ? 'text-gray-100' : 'text-gray-500'}`}>{description}</p>
    <div className="flex items-baseline mb-6">
      <p className="text-4xl font-bold">₹{price}</p>
      <span className={`ml-2 ${isMostPopular ? 'text-gray-200' : 'text-gray-500'}`}>
        {title === 'Yearly Plan' ? 'per year' : 'per month'}
      </span>
    </div>
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <CheckCircle className={`w-5 h-5 ${isMostPopular ? 'text-blue-200' : 'text-green-500'}`} />
          {feature}
        </li>
      ))}
    </ul>
    <button 
      className={`
        w-full py-3 rounded-lg transition-all 
        ${isMostPopular 
          ? 'bg-white text-blue-600 hover:bg-gray-100' 
          : 'bg-blue-600 text-white hover:bg-blue-700'}
      `}
    >
      Choose Plan
    </button>
  </div>
);

const HomePage = () => {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData: User | null) => {
      if (userData?.uid) {
        router.push("/store");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const enhancedFeatures = [
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Rapid Catalog Creation",
      description: "Build stunning product catalogs in minutes",
      gradient: "bg-gradient-to-br from-blue-100 to-indigo-200",
      details: [
        "AI-powered template suggestions",
        "Bulk upload capabilities",
        "Real-time preview"
      ]
    },
    {
      icon: <Globe className="w-8 h-8 text-green-500" />,
      title: "Multi-Channel Sharing",
      description: "Distribute catalogs across multiple platforms",
      gradient: "bg-gradient-to-br from-green-100 to-teal-200",
      details: [
        "WhatsApp integration",
        "Direct email links",
        "Social media sharing"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      title: "Advanced Analytics",
      description: "Deep insights into catalog and sales performance",
      gradient: "bg-gradient-to-br from-purple-100 to-pink-200",
      details: [
        "Conversion tracking",
        "Customer engagement metrics",
        "Sales funnel visualization"
      ]
    },
    {
      icon: <FaMobile className="w-8 h-8 text-orange-500" />,
      title: "Mobile-First Design",
      description: "Optimized for mobile viewing and interaction",
      gradient: "bg-gradient-to-br from-orange-100 to-yellow-200",
      details: [
        "Responsive catalog layouts",
        "Touch-friendly interfaces",
        "Mobile performance optimization"
      ]
    }
  ];

  const enhancedTestimonials = [
    {
      content:
        "This platform transformed my e-commerce business! I can now manage marketing campaigns effortlessly and see results in real-time.",
      author: "Elena Rodriguez",
      authorRole: "E-commerce Entrepreneur",
      authorImage: "/praveen.jpeg",
      rating: 5,
    },
    {
      content:
        "As a small business owner, this tool has been a game-changer. It's intuitive, affordable, and delivers professional results every time.",
      author: "Michael Chen",
      authorRole: "Small Business Owner",
      authorImage: "/parker.webp",
      rating: 5,
    },
    {
      content:
        "With this platform, I've boosted customer engagement significantly. The email templates and automation features are top-notch!",
      author: "Sarah Johnson",
      authorRole: "Marketing Consultant",
      authorImage: "/arjun.jpg",
      rating: 5,
    },
    {
      content:
        "The built-in analytics helped me understand customer behavior and tailor my campaigns more effectively. Highly recommend it!",
      author: "David Thompson",
      authorRole: "Digital Strategist",
      authorImage: "/praveen.jpeg",
      rating: 4,
    }
  ];
  

  const pricingPlans = [
    {
      title: 'Monthly Plan',
      price: 499,
      description: 'Perfect for startups and small businesses',
      features: [
        'Unlimited Catalog Creation',
        'Basic Analytics',
        'WhatsApp Sharing',
        'Email Support'
      ]
    },
    {
      title: 'Yearly Plan',
      price: 4999,
      description: 'Best value with significant savings',
      features: [
        'Everything in Monthly Plan',
        'Advanced Analytics',
        'Priority Support',
        'Custom Branding',
        '17% Annual Discount'
      ],
      isMostPopular: true
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Enhanced Design */}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-extrabold mb-6">
              Transform Your <span className="text-blue-300">Catalog</span> Experience
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Share and track product catalogs with ease.
            </p>
            <div className="flex space-x-4">
              <motion.a href="/register" className="px-8 py-4 bg-blue-600 rounded-lg">
                Start Free Trial
              </motion.a>
              <motion.a href="/demo" className="px-8 py-4 border rounded-lg">
                Watch Demo
              </motion.a>
            </div>
          </motion.div>
          <motion.div>
            <Lottie animationData={heroAnimation} className="w-full max-w-md" />
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Supercharge Your Product Sharing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover powerful features designed to elevate your product catalog and drive business growth
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {enhancedFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Flexible Pricing for Every Business</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose a plan that scales with your business needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingPlan key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-blue-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real businesses, real growth, real transformation
            </p>
          </div>
          <div className="grid lg:grid-cols-2 sm:grid-cols-2 gap-8">
            {enhancedTestimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;