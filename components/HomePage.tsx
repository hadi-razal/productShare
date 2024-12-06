"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Globe,
  Target,
  PieChart,
  Shield,
  ArrowRight,
  Quote,
} from "lucide-react";
import Marquee from "react-fast-marquee";

const Home = () => {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      icon: <Rocket className="w-10 h-10 text-blue-600" />,
      title: "Rapid Catalog Creation",
      description:
        "Streamline your product showcase with intelligent design tools",
    },
    {
      icon: <Globe className="w-10 h-10 text-green-600" />,
      title: "Global Reach",
      description: "Expand your market presence across multiple platforms",
    },
    {
      icon: <PieChart className="w-10 h-10 text-purple-600" />,
      title: "Smart Analytics",
      description: "Data-driven insights to optimize your business strategy",
    },
    {
      icon: <Shield className="w-10 h-10 text-teal-600" />,
      title: "Secure Platform",
      description: "Enterprise-grade security and data protection",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "E-commerce Entrepreneur",
      quote:
        "This platform transformed our product marketing approach completely.",
      location: "Mumbai",
    },
    {
      name: "Rahul Gupta",
      role: "Small Business Owner",
      quote: "Incredibly intuitive and powerful marketing solution.",
      location: "Delhi",
    },
    {
      name: "Aisha Khan",
      role: "Digital Strategist",
      quote: "Unparalleled efficiency in catalog management and marketing.",
      location: "Bangalore",
    },
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">ProductShare</div>
        <div className="space-x-6">
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Features
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Testimonials
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Pricing
          </a>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2 rounded-md">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Elevate Your Product Catalog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Intelligent catalog creation and marketing solutions for modern
          businesses
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md flex items-center">
            Start Free Trial <ArrowRight className="ml-2" />
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md">
            Learn More
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 bg-gray-300 py-4">
        <Marquee
          loop={0}
          speed={50}
          gradient={false}
          className="flex items-center "
        >
          {[
            "TechNova",
            "Skyline Solutions",
            "Pixel Perfect",
            "CodeCraft",
            "CodeCraft",
            "CloudWorks",
            "CodeCraft",
            "BlueWave",
            "InnoSphere",
            "BrightPath",
            "CyberCore",
            "NextGen Soft",
          ].map((company, index) => (
            <div
              key={index}
              className="border b border-white shadow-md rounded-lg w-full px-5 mx-3 h-10 flex items-center justify-center"
            >
              <h1 className="text-white font-semibold text-lg text-center">
                {company}
              </h1>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <Quote className="text-blue-600 w-12 h-12 mx-auto mb-6" />
            <p className="text-xl text-center text-gray-700 mb-6">
              "{testimonials[activeTab].quote}"
            </p>
            <div className="text-center">
              <h4 className="text-lg font-semibold">
                {testimonials[activeTab].name}
              </h4>
              <p className="text-gray-500">{testimonials[activeTab].role}</p>
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`w-3 h-3 rounded-full ${
                  activeTab === index ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Start your journey with our AI-powered catalog solutions today
        </p>
        <button className="bg-blue-600 text-white px-10 py-4 rounded-md text-lg">
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default Home;
