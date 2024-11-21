import React from 'react';
import Head from 'next/head';

const ContactPage = () => {
  return (
    <>
      <Head>
        <title>Contact Us - Product Share</title>
        <meta name="description" content="Get in touch with Product Share for inquiries, support, or feedback. We’d love to hear from you!" />
        <meta name="keywords" content="contact, inquiries, support, feedback, Product Share, product management, customer service" />
        <meta name="author" content="Hadi Razal" />
      </Head>

      <section className="pt-40 pb-16 px-6 bg-gray-100 text-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            We’d love to hear from you! Whether you have questions, feedback, or need support, feel free to reach out. Our team is here to help you with anything you need regarding Product Share.
          </p>
          
          <div className="max-w-2xl mx-auto text-left">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Get in Touch</h2>
            <form action="#" method="POST" className="space-y-6">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-lg text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-lg text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="message" className="text-lg text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your message"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
