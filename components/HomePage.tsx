"use client";

import React from "react";
import {
  Rocket,
  Globe,
  PieChart,
  Shield,
  ArrowRight,
  Quote,
  MessageCircle,
  Cog,
} from "lucide-react";
import Marquee from "react-fast-marquee";

const Home = () => {
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
    {
      icon: <Cog className="w-10 h-10 text-orange-600" />,
      title: "Customizable Solutions",
      description: "Tailor-made features to fit your unique business needs",
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-red-600" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for uninterrupted operations",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "E-commerce Entrepreneur",
      quote:
        "This platform completely revolutionized the way we showcase and market our products. Highly recommended!",
      location: "Mumbai",
    },
    {
      name: "Rahul Gupta",
      role: "Small Business Owner",
      quote:
        "An incredibly intuitive and powerful marketing solution that helped boost my sales dramatically.",
      location: "Delhi",
    },
    // {
    //   name: "Aisha Khan",
    //   role: "Digital Strategist",
    //   quote:
    //     "With its efficiency in catalog management and marketing, it’s become an indispensable tool for our campaigns.",
    //   location: "Bangalore",
    // },
    // {
    //   name: "Arjun Mehta",
    //   role: "Startup Founder",
    //   quote:
    //     "A game-changer for startups like ours, simplifying marketing tasks and delivering outstanding results.",
    //   location: "Hyderabad",
    // },
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

      <div className="w-full flex flex-col gap-2 bg-gray-100 py-4">
        <Marquee
          loop={0}
          speed={50}
          gradient={false}
          className="flex items-center"
        >
          {[
            "TechNova",
            "Skyline Solutions",
            "Pixel Perfect",
            "CodeCraft",
            "CloudWorks",
            "BlueWave",
            "InnoSphere",
            "BrightPath",
            "CyberCore",
            "NextGen Soft",
          ].map((company, index) => (
            <div
              key={index}
              className="border border-gray-300 shadow-md rounded-lg px-5 mx-3 h-10 flex items-center justify-center"
            >
              <h1 className="text-gray-400 font-semibold text-lg text-center">
                {company}
              </h1>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid  md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
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
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid gap-8  grid-cols-1  md:grid-cols-2 ">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center"
            >
              <Quote className="text-blue-600 w-12 h-12 mb-4" />
              <p className="text-lg text-gray-700 mb-4">
                "{testimonial.quote}"
              </p>
              <div>
                <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
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
