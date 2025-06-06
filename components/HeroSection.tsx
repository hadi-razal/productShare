import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  };

  return (
    <section className="relative bg-white min-h-[90vh] flex items-center overflow-hidden text-primary">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-primary mb-6 shadow-sm border border-primary/20"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Powering 25,000+ storefronts worldwide</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Showcase Your Products with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Style & Simplicity
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl text-primary/80 mb-8 max-w-2xl mx-auto"
          >
            Easily create and share beautiful product catalogs with your customers. Designed for store owners — no coding or tech skills needed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/register")}
              className="bg-primary text-white px-6 py-3 md:px-8 md:py-3 rounded-lg font-medium text-base md:text-lg shadow-md hover:shadow-lg transition-all"
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Decorative animation */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-20 left-10 w-6 h-6 bg-primary rounded-full opacity-10"
      />
      <motion.div
        animate={{
          y: [0, -20, 0],
          transition: { duration: 8, delay: 0.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-20 right-10 w-8 h-8 bg-primary rounded-full opacity-10"
      />
    </section>
  );
};

export default HeroSection;
