import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/4 right-1/6 w-72 h-72 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl"
        />
        
        {/* Secondary gradient orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 2.5, delay: 0.5 }}
          className="absolute bottom-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-3xl"
        />

        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-20 left-20 w-32 h-32 border border-slate-300 rotate-45"></div>
          <div className="absolute bottom-40 right-32 w-24 h-24 border border-slate-300 rotate-12"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-slate-300 -rotate-45"></div>
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
          className={`absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`}
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 15}%`,
          }}
        />
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Trust Badge */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full text-sm font-semibold text-slate-700 mb-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
              Trusted by 25,000+ merchants globally
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-[1.1] tracking-tight"
          >
            <span className="block text-slate-900 mb-2">Transform Your</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
              Product Catalog
            </span>
            <span className="block text-slate-800 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-4 font-medium">
              into Premium Showcases
            </span>
          </motion.h1>

          {/* Enhanced Subtitle */}
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Create stunning, shareable product catalogs that convert browsers into buyers. 
            <span className="block mt-2 text-slate-500">
              No design skills required — professional results guaranteed.
            </span>
          </motion.p>

          {/* Enhanced CTA Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/register")}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-semibold text-base md:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden min-w-[200px] sm:min-w-[220px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                Start Creating Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 text-slate-700 font-semibold text-base md:text-lg hover:text-slate-900 transition-colors duration-200 px-6 py-4"
            >
              <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={4}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: "⚡", title: "Lightning Fast", desc: "Setup in minutes" },
              { icon: "📱", title: "Mobile First", desc: "Perfect on any device" },
              { icon: "🎨", title: "Beautiful Design", desc: "Professional templates" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 left-8 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 hidden sm:block"
      />
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, -15, 0],
        }}
        transition={{ duration: 10, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-8 w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-20 hidden sm:block"
      />
      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{ duration: 12, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-16 w-4 h-4 bg-gradient-to-r from-purple-500 to-emerald-500 rotate-45 opacity-20 hidden md:block"
      />
    </section>
  );
};

export default HeroSection;