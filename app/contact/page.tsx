"use client";

import React, { useState } from "react";
import Head from "next/head";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form logic here
  };

  return (
    <>
      <Head>
        <title>Contact Us - Product Share</title>
        <meta
          name="description"
          content="Get in touch with Product Share for inquiries, support, or feedback. We'd love to hear from you!"
        />
        <meta
          name="keywords"
          content="contact, inquiries, support, feedback, Product Share, product management, customer service"
        />
        <meta name="author" content="Duoph Technologies" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-6xl bg-white/80 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Contact Info */}
          <div className="md:w-1/2 bg-gradient-to-br from-[#5c84c8] to-[#849fd3] text-white p-10 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="w-5 h-5" />
                <span className="text-sm md:text-base">productshareindia@gmail.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5" />
                <span className="text-sm md:text-base">+91 8589920409</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-5 h-5" />
                <span className="text-sm md:text-base">Kerala, India</span>
              </div>
            </div>
            <p className="mt-10 text-xs opacity-80">Available Mon–Fri, 9am–5pm IST</p>
          </div>

          {/* Contact Form */}
          <div className="md:w-1/2 w-full p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2D3436] mb-4">
              Get in Touch
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Have a question or feedback? Fill out the form below and we'll get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="How can we help you today?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#5c84c8] hover:bg-[#4a70b0] text-white font-semibold rounded-xl transition duration-300 ease-in-out"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
