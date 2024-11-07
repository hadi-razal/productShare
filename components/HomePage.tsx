"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Star, ThumbsUp, Clock, Globe, Shield, TrendingUp, ShoppingCart, User } from 'lucide-react';
import heroAnimation from "@/public/hero.json";
import Image from 'next/image';

// Types for props
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TestimonialCardProps {
  content: string;
  author: string;
  authorRole: string;
  authorImage: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
    {icon}
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600 text-sm">{description}</p>
  </div>
);



const TestimonialCard = ({ content, author, authorRole, authorImage }: TestimonialCardProps) => (
  <div className="bg-white p-8 cursor-pointer rounded-xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
    <p className="text-lg text-gray-700 italic mb-4">{content}</p>
    <div className="flex items-center justify-center">
      <Image
        unoptimized={true}
        width={0}
        height={0}
        className="w-12 h-12 rounded-full object-cover mr-4"
        src={authorImage}
        alt={author}
      />
      <div className="text-left">
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-gray-600">{authorRole}</p>
      </div>
    </div>
  </div>
);


const testimonials = [
  {
    content: '"Product Share has transformed our business!"',
    author: 'Praveen Prasad',
    authorRole: 'Retailer',
    authorImage: '/praveen.jpeg',
  },
  {
    content: '"A must-have for online sellers. So easy to use!"',
    author: 'Arjun K',
    authorRole: 'Small Business Owner',
    authorImage: '/arjun.jpg',
  },
  {
    content: '"Increased our reach and made sharing simple."',
    author: 'Shiyadh',
    authorRole: 'Online Reseller',
    authorImage: '/arjun.jpg',
  },
];





const premiumPlan = {
  name: "Premium Plan",
  price: "₹99",
  duration: "/month",
  features: [
    "Advanced Analytics & Reports",
    "Unlimited Products",
    "24/7 Premium Support",
    "Upto 100 Products",
    "Custom Logo",
    "Dedicated Account Manager",
    "Integration with External Platforms"
  ],
  buttonText: "Start Free Trial",
  trial: "3-day free trial",
  trialInfo: "No charges during the trial. After 3 days, ₹99/month for full access."
};

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen pb-10 flex flex-col md:flex-row max-w-7xl mx-auto items-center justify-between px-6 text-center md:text-left pt-24 space-y-12 md:space-y-0">
        <motion.div
          className="z-10 w-full md:w-3/5 text-blue-950"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-extrabold mt-6 tracking-tight leading-tight text-gray-900">
            Elevate Your Sales with <span className="text-blue-900">Product Share</span>
          </h1>
          <h2 className="text-2xl font-medium text-gray-700 mt-4">
            The premium platform for showcasing and selling your products online.
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
            Create, share, and manage your online product catalog with unparalleled ease and style. Reach more customers and boost your brand presence through a simple, customizable link.
          </p>
          <ul className="mt-6 flex flex-col space-y-3 md:space-y-0 md:space-x-6 md:flex-row text-blue-900">
            <li className="flex items-center">
              <span className="mr-2 text-2xl font-semibold">✓</span>Seamless Product Listings
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-2xl font-semibold">✓</span>Shareable Catalog Links
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-2xl font-semibold">✓</span>Personalized Branding
            </li>
            <li className="flex items-center">
              <span className="mr-2 text-2xl font-semibold">✓</span>Advanced Analytics
            </li>
          </ul>
          <div className="mt-8 flex flex-col md:flex-row items-center md:space-x-4">
            <a href="/register" className="inline-block px-14 py-4 bg-blue-950 text-white font-semibold rounded-md shadow-lg transition duration-300 hover:bg-blue-900 w-full md:w-auto">
              Create Your Store
            </a>
            <a href="/about-us" className="inline-block px-8 py-4 mt-4 md:mt-0 bg-gray-200 text-blue-950 font-semibold rounded-md shadow-lg transition duration-300 hover:bg-gray-300 w-full md:w-auto">
              Learn More
            </a>
          </div>
          <div className="mt-4 text-center md:text-left">
            <p className="text-gray-500 text-sm">Trusted by over 1000 sellers worldwide</p>
          </div>
        </motion.div>
        <motion.div
          className="w-full md:w-2/5 mt-10 md:mt-0 flex justify-center items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Lottie animationData={heroAnimation} loop={true} style={{ width: '100%', maxWidth: 600, height: 'auto' }} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-blue-950 mb-6">Why Choose Product Share?</h2>
          <p className="text-lg text-gray-600 mb-12">
            Discover the premium features that make us the best choice for growing your online presence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Star className="w-12 h-12 text-yellow-500" />} title="Top-Rated Support" description="Get help anytime from our dedicated support team." />
            <FeatureCard icon={<User className="w-12 h-12 text-blue-500" />} title="User Friendly" description="Stunning, fully customizable catalog pages." />
            <FeatureCard icon={<ThumbsUp className="w-12 h-12 text-green-500" />} title="Customer Satisfaction" description="Join thousands of satisfied users who trust us." />
            <FeatureCard icon={<Clock className="w-12 h-12 text-purple-500" />} title="24/7 Availability" description="Manage your catalog anytime, anywhere." />
            <FeatureCard icon={<Globe className="w-12 h-12 text-teal-500" />} title="Global Reach" description="Easily share your products with a worldwide audience." />
            <FeatureCard icon={<Shield className="w-12 h-12 text-gray-500" />} title="Secure Platform" description="Your data is safe with our advanced security features." />
            <FeatureCard icon={<TrendingUp className="w-12 h-12 text-indigo-500" />} title="Analytics Insights" description="Track sales and engagement with in-depth analytics." />
            <FeatureCard icon={<ShoppingCart className="w-12 h-12 text-red-500" />} title="E-commerce Ready" description="Easily set up your online shop and start selling." />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-gray-100 to-blue-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-blue-950 mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                content={testimonial.content}
                author={testimonial.author}
                authorRole={testimonial.authorRole}
                authorImage={testimonial.authorImage}
              />
            ))}
          </div>
        </div>
      </section>


      {/* Premium Plan Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-blue-950 mb-8">Premium Plan</h2>
          <p className="text-lg text-gray-600 mb-12">
            Experience all premium features for 3 days, absolutely free! After the trial, subscribe to continue enjoying exclusive tools and support.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Premium Plan Card */}
            <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-3xl font-semibold text-gray-900 mb-4">{premiumPlan.name}</h3>
              <div className="flex justify-center items-baseline my-4">
                <span className="text-5xl font-bold text-gray-900">{premiumPlan.price}</span>
                <span className="text-xl text-gray-500 ml-2">{premiumPlan.duration}</span>
              </div>

              <p className="text-sm text-gray-600 mb-6">{premiumPlan.trialInfo}</p>

              <h4 className="text-lg font-semibold text-gray-700 mb-4">Features Included:</h4>
              <ul className="text-gray-600 text-left space-y-2 mb-6">
                {premiumPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-6 h-6 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Start Free Trial Button */}
              <button
                className="mt-6 w-full px-6 py-3 bg-blue-950 text-white font-semibold rounded-md transition-transform transform hover:scale-105 shadow-md"
                onClick={() => alert("Free trial started successfully!")}
              >
                {premiumPlan.buttonText}
              </button>
            </div>

            {/* Trial Information */}
            <div className="bg-blue-50 p-8 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold text-blue-950 mb-4">How the Trial Works</h3>
              <p className="text-lg text-gray-700 mb-4">
                Start your 3-day free trial to unlock all premium features with no charges. After the trial period ends, you'll need to subscribe to continue using the features. You can cancel anytime before the trial ends without any cost.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">No hidden charges:</span> The free trial gives you access to the full range of premium features for 3 days. Afterward, ₹99/month will be charged for full access to all features.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-12 bg-white pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-blue-950 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6 text-left max-w-2xl mx-auto">
            <div className="bg-gray-100 p-6 rounded-md shadow-md">
              <h3 className="font-semibold text-lg text-gray-900">How does the free trial work?</h3>
              <p className="text-gray-600 mt-2">You can use all premium features for free for the first 3 days. After the trial, you will be charged ₹99/month unless you cancel.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-md shadow-md">
              <h3 className="font-semibold text-lg text-gray-900">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600 mt-2">Yes, you can cancel your subscription at any time from your account settings. There are no hidden fees.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-md shadow-md">
              <h3 className="font-semibold text-lg text-gray-900">Are there any setup fees?</h3>
              <p className="text-gray-600 mt-2">No, there are no setup fees. You can start using the platform right away.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
