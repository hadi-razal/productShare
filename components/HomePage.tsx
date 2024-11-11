"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Star, ShoppingCart, Router } from 'lucide-react';
import heroAnimation from "@/public/hero.json";
import Image from 'next/image';
import { FaUserFriends, FaChartLine } from 'react-icons/fa';
import { userType } from '@/type';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

interface TestimonialCardProps {
  content: string;
  author: string;
  authorRole: string;
  authorImage: string;
}

const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => (
  <motion.div
    className={`flex flex-col items-center p-6 rounded-2xl shadow-lg ${gradient} border border-white/10`}
  >
    <div className="p-3 bg-white/80 rounded-xl shadow-inner">{icon}</div>
    <h3 className="mt-4 text-xl font-semibold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-600 text-center">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ content, author, authorRole, authorImage }: TestimonialCardProps) => (
  <motion.div
    className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-between"
  >
    <div className='flex flex-1 '>

      <p className="text-lg text-gray-700 italic mb-6 flex-1">"{content}"</p>
    </div>
    <div className="flex items-center justify-center">
      <div className="w-16 h-16">
        <Image
          unoptimized={true}
          width={0}
          height={0}
          className="rounded-full w-14 h-14 object-cover"
          src={authorImage}
          alt={author}
        />
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-xl">{author}</p>
        <p className="text-sm text-gray-500 mt-1">{authorRole}</p>
      </div>
    </div>
  </motion.div>
);


const features = [
  {
    icon: <Star className="w-6 h-6 text-yellow-500" />,
    title: "Seamless Catalog Creation",
    description: "Build catalogs in minutes and keep them organized.",
    gradient: "bg-gradient-to-br from-yellow-100 to-orange-200"
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-blue-500" />,
    title: "Product Share Links",
    description: "Share product catalogs directly with customers.",
    gradient: "bg-gradient-to-br from-blue-100 to-indigo-200"
  },
  {
    icon: <FaUserFriends className="w-6 h-6 text-green-500" />,
    title: "Customer Engagement",
    description: "Stay connected with instant messaging and updates.",
    gradient: "bg-gradient-to-br from-green-100 to-teal-200"
  },
  {
    icon: <FaChartLine className="w-6 h-6 text-purple-500" />,
    title: "Advanced Analytics",
    description: "Track performance metrics to maximize sales.",
    gradient: "bg-gradient-to-br from-purple-100 to-pink-200"
  }
];





const HomePage = () => {

  const router = useRouter()

  useEffect(() => {
    const setCurrentUser = async () => {
      onAuthStateChanged(auth, async (userData: User | null) => {
        if (userData?.uid) {
          router.push("/store")
        }
      });
    };

    setCurrentUser();

  }, []);





  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pt-10">
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-white"
          >
            <div className="text-4xl font-bold">
              <h1>Build & Share Your <span className="text-blue-300">Product Catalog</span> with Ease</h1>
            </div>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
              Create captivating product catalogs, instantly share them with customers, and expand your reach with Product Share.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <motion.a
                // onClick={handleRazorpayPayment}
                href="/register"
                className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all"
              >
                Start Free Trial
              </motion.a>
              <motion.a
                href="/demo"
                className="px-6 py-3 border border-gray-300 text-white rounded-md hover:bg-white/10 transition-all"
              >
                Watch Demo
              </motion.a>
            </div>
          </motion.div>
          <div className="relative mt-3 flex items-center justify-center">
            <Lottie animationData={heroAnimation} className="w-full max-w-md mx-auto" loop />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Product Share?</h2>
          <p className="text-lg text-gray-500 mb-12">Empowering sellers with tools to showcase, share, and succeed.</p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-500 mb-12">Trusted by sellers worldwide to power their growth.</p>
          <div className="grid gap-8 lg:grid-cols-3 sm:grid-cols-2">
            {[
              {
                content: "Product Share is a game-changer! My customers love the easy access to my products.",
                author: "Alice Monroe",
                authorRole: "Owner of Trendy Boutique",
                authorImage: "/praveen.jpeg",
              },
              {
                content: "The catalog builder is so simple and fast. It saves me hours every week!",
                author: "David Lee",
                authorRole: "Founder of SmartMart",
                authorImage: "/arjun.jpg",
              },
              {
                content: "I've seen my sales grow by 50% since using this platform. A must-have for sellers!",
                author: "Sarah Kim",
                authorRole: "CEO of Luxe Shop",
                authorImage: "/praveen.jpeg",
              },
            ].map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
