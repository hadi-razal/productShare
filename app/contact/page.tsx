"use client"

import React, {  useState } from 'react';
import Head from 'next/head';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Head>
        <title>Contact Us - Product Share</title>
        <meta name="description" content="Get in touch with Product Share for inquiries, support, or feedback. We'd love to hear from you!" />
        <meta name="keywords" content="contact, inquiries, support, feedback, Product Share, product management, customer service" />
        <meta name="author" content="Hadi Razal" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden flex">
          {/* Contact Information Section */}
          <div className="w-1/2 hidden md:flex bg-blue-900 text-white p-12  flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6" />
                <span className="text-lg">hadhirasal22@gmail.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6" />
                <span className="text-lg">+91 9074063723</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6" />
                <span className="text-lg">Calicut , India</span>
              </div>
            </div>
            <div className="mt-12 text-sm opacity-75">
              <p>We're available Monday-Friday, 9am-5pm EST</p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="md:w-1/2 w-full p-12">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Get in Touch</h1>
            <p className="text-gray-600 mb-8">
              Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="How can we help you today?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform"
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