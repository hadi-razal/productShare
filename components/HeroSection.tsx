import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="max-w-6xl mx-auto text-center py-20">
        
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/80 px-5 py-2 rounded-full text-sm font-medium text-slate-700 mb-8 shadow"
        >
          <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 
                8a1 1 0 01-1.414 0l-4-4a1 
                1 0 011.414-1.414L8 
                12.586l7.293-7.293a1 1 0 
                011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Trusted by 25,000+ merchants
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          <span className="block text-slate-900">Transform Your</span>
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
            Product Catalog
          </span>
          <span className="block text-slate-800 text-xl sm:text-2xl md:text-3xl font-medium mt-3">
            into Premium Showcases
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Create stunning, shareable product catalogs that convert browsers into buyers.  
          <span className="block mt-1 text-slate-500">
            Professional results, no design skills required.
          </span>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <button
            onClick={() => router.push("/register")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 rounded-xl font-semibold text-base sm:text-lg shadow hover:shadow-lg transition"
          >
            Start Creating Free
          </button>
          <button className="flex items-center gap-2 text-slate-700 font-medium hover:text-slate-900 transition">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Setup in minutes" },
            { icon: "📱", title: "Mobile First", desc: "Works on every device" },
            { icon: "🎨", title: "Beautiful Design", desc: "Professional templates" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/70 p-5 rounded-xl shadow border text-center hover:shadow-lg transition"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-slate-800">{f.title}</h3>
              <p className="text-slate-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
