import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 py-10 text-center bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Background Image */}
      <Image
        src="/hero_bg.jpg"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        className="z-10 opacity-10"
        priority
      />

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full text-sm font-medium text-slate-700 mb-8 shadow"
      >
        <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        </div>
        Trusted by 1000+ sellers
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
      >
        Transform Your <br />
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent z-10">
          Product Catalog
        </span>
        <br />
        into Premium Showcases
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="text-sm sm:text-base md:text-lg text-slate-600 mb-8 max-w-xl mx-auto"
      >
        Create stunning, shareable product catalogs that convert browsers into buyers.
        <span className="block mt-1 text-slate-500">Professional results, no design skills required.</span>
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
      >
        <button
          onClick={() => router.push("/register")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition cursor-pointer"
        >
          Start Creating Free
        </button>

        <button className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer hover:text-slate-900 transition">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          Watch Demo
        </button>
      </motion.div>

     
      
    </section>
  );
};

export default HeroSection;
