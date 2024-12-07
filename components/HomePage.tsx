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
  Layers,
  Activity,
  Sparkles,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import HeroSection from "./HeroSection";
import PricingSection from "./PricingSection";

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

  const pricingPlans = [
    {
      name: "Basic",
      monthlyPrice: "19",
      yearlyPrice: "199",
      description: "Ideal for individuals just starting out.",
      features: ["1 User", "Basic Support", "Up to 100 Products"],
      popular: false,
    },
    {
      name: "Pro",
      monthlyPrice: "49",
      yearlyPrice: "499",
      description: "Perfect for growing teams and businesses.",
      features: [
        "5 Users",
        "Priority Support",
        "Up to 500 Products",
        "Advanced Analytics",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: "99",
      yearlyPrice: "999",
      description: "Tailored for large-scale operations.",
      features: [
        "Unlimited Users",
        "24/7 Support",
        "Unlimited Products",
        "Custom Integrations",
        "Dedicated Account Manager",
      ],
      popular: false,
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
    }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen pt-20">
      <HeroSection />
      <div className="w-full flex flex-col gap-3 bg-gray-50 py-6">
        {/* First Marquee: Benefits/Features */}
        <Marquee
          loop={0}
          speed={50}
          gradient={false}
          className="flex items-center"
        >
          {[
            "Boost Your Sales with Ease",
            "Create Stunning E-Store Websites",
            "Effortless Catalog Management",
            "Marketing Made Simple",
            "Sell Smarter, Not Harder",
            "Your Online Store, Our Priority",
            "Seamless Product Organization",
            "AI-Powered Marketing Tools",
            "Your Growth, Our Mission",
            "Build Your Catalog in Minutes",
          ].map((message, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-md px-6 mx-[3px] py-1 flex items-center justify-center "
            >
              <span className="text-gray-400 font-[100px] text-base text-center ">
                {message}
              </span>
            </div>
          ))}
        </Marquee>

        {/* Second Marquee: More Benefits/Features */}
        <Marquee loop={0} speed={50} direction="right" gradient={false}>
          {[
            "Maximize Your Revenue Potential",
            "Effortless Product Uploads",
            "Your Catalog, Your Brand",
            "Customize Your Online Store",
            "Unlock the Power of Digital Marketing",
            "Transform How You Sell Online",
            "Optimize Your Product Listings",
            "Sell Anywhere, Anytime",
            "Reach More Customers Faster",
            "Increase Visibility and Engagement",
          ].map((message, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-md px-6 mx-[3px] py-1 flex items-center justify-center "
            >
              <span className="text-gray-400 font-[100px] text-base text-center ">
                {message}
              </span>
            </div>
          ))}
        </Marquee>

        {/* Decorative Elements */}
        <div className="flex items-center justify-center mt-4 px-3">
          <p className="text-gray-500 text-sm text-center">
            Let us help you grow your business with a powerful, easy-to-use
            catalog builder.
          </p>
        </div>
      </div>
      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid  md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-base leading-4">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid gap-8  grid-cols-1  md:grid-cols-2 ">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow-lg  rounded-lg p-6 flex flex-col items-center text-center"
            >
              <Quote className="text-primaryColor w-12 h-12 mb-4" />
              <p className="text-base text-gray-700 mb-4 leading-5 font-extralight">
                "{testimonial.quote}"
              </p>
              <div>
                <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                <p className="text-gray-500 ">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Call to Action */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-6 leading-10">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-5">
          Start your journey with our AI-powered catalog solutions today
        </p>
        <button className="bg-primaryColor text-white px-10 py-4 rounded-md text-lg">
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default Home;
