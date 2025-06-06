import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const pulse = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  };

  const float = {
    y: [0, -15, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <section className="relative bg-gradient-to-b from-white to-purple-50 overflow-hidden min-h-[90vh] flex items-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient circles */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with icon */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-sm text-purple-800 mb-8 shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Trusted by 10,000+ businesses worldwide</span>
          </motion.div>

          {/* Heading with gradient text */}
          <motion.h1 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Build Your <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Digital Store</span> in Minutes
          </motion.h1>

          {/* Subtitle with animated underline */}
          <motion.p 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto relative"
          >
            Transform your local business into a thriving online presence. No technical knowledge required.
            <motion.span 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full"
              style={{ originX: 0 }}
            />
          </motion.p>

          {/* CTA Buttons with improved hover effects */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/register")}
              className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-lg font-medium text-lg shadow-md hover:shadow-lg transition-all group"
            >
              <span className="relative z-10">Start Building Free</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/demo")}
              className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-lg font-medium text-lg hover:border-purple-300 transition-all shadow-sm hover:shadow-md relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                View Live Demo
              </span>
              <span className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* Stats with animated counters */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            {[
              { value: 10000, label: "Active Stores", plus: true },
              { value: 4.9, label: "User Rating", suffix: "/5" },
              { value: 2.5, label: "Revenue Generated", prefix: "₹", suffix: "Cr+" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.prefix || ""}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.span>
                  {stat.suffix || ""}
                  {stat.plus && "+"}
                </p>
                <p className="text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={float}
        className="absolute bottom-20 left-10 w-8 h-8 bg-purple-200 rounded-full opacity-50"
      />
      <motion.div
        animate={{ ...float, rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-purple-100 rounded-full opacity-50"
      />
      <motion.div
        animate={pulse}
        transition={{ delay: 0.5 }}
        className="absolute top-20 right-10 w-12 h-12 bg-purple-100 rounded-full opacity-50"
      />
      
      {/* Floating product mockup */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="hidden lg:block absolute right-20 top-1/2 transform -translate-y-1/2 w-72 h-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="h-8 bg-gray-100 flex items-center px-3">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded mb-4 w-1/2"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-2">
                <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;