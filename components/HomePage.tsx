"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import Link from 'next/link';
import heroAnimation from '../public/hero.json';

const HeroSection = () => {
  return (
    <section className="relative flex flex-col md:flex-row max-w-7xl mx-auto items-center justify-between px-6 h-[calc(100vh-80px)] text-center md:text-left pt-24">
      
      {/* Text Content */}
      <motion.div
        className="z-10 w-full md:w-3/5 text-blue-950"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl font-extrabold mt-6 tracking-tight leading-tight">
          Simplify Your Sales with <span className="text-blue-900">Product Share</span>
        </h1>
        <h2 className="text-2xl font-medium text-gray-700 mt-2">
          The easiest way to showcase and sell your products online.
        </h2>
        <p className="mt-4 text-xl max-w-lg mx-auto md:mx-0">
          Easily create, share, and manage your online product catalog. Reach more customers and boost your brand presence with a simple, shareable link.
        </p>
        <ul className="mt-6 flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row text-blue-900">
          <li className="flex items-center">
            <span className="mr-2 text-2xl font-semibold">✓</span>Effortless Product Listings
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-2xl font-semibold">✓</span>Instant Sharing Links
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-2xl font-semibold">✓</span>Customizable Catalog Pages
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-2xl font-semibold">✓</span>Analytics & Insights
          </li>
        </ul>
        
        {/* Call-to-Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row items-center md:space-x-4">
          <Link
            href="/register"
            className="inline-block px-14 py-4 bg-blue-950 text-white font-semibold rounded-md shadow-lg transition duration-300 hover:bg-blue-900"
          >
            Create Your Store
          </Link>
          <Link
            href="/about-us"
            className="inline-block px-8 py-4 mt-4 md:mt-0 bg-gray-200 text-blue-950 font-semibold rounded-md shadow-lg transition duration-300 hover:bg-gray-300"
          >
            Learn More
          </Link>
        </div>
        
        {/* Trusted by Section */}
        <div className="mt-3 flex justify-center md:justify-start">
          <p className="text-gray-500 text-sm">Trusted by more than 1000+ sellers</p>
        </div>
      </motion.div>

      {/* Animation Content */}
      <motion.div
        className="w-full md:w-2/5 mt-10 md:mt-0 flex justify-center items-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <Lottie
          animationData={heroAnimation}
          loop={true}
          style={{ width: '100%', maxWidth: 600, height: 'auto' }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
