import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();

  const IndiaFlag = () => (
    <svg width="20" height="14" viewBox="0 0 3 2" className="rounded-sm">
      <rect width="3" height="2" fill="#FF9933" />
      <rect y="0.67" width="3" height="0.66" fill="#FFFFFF" />
      <rect y="1.33" width="3" height="0.67" fill="#138808" />
      <circle cx="1.5" cy="1" r="0.2" fill="#000080" />
    </svg>
  );

  return (
    <section className="relative bg-white overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-100/25 to-purple-100/15 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center items-center py-4 sm:py-12 min-h-0 flex flex-col justify-center w-full">
          
          {/* Badge */}
          <div className="inline-flex max-w-[200px] items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-purple-700 mb-6 sm:mb-6">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse" />
            <IndiaFlag />
            <span className="hidden xs:inline">India's #1 Product Catalogue Builder</span>
            <span className="xs:hidden">#1 in India</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight mb-6 sm:mb-6">
            <span className="block text-gray-900">Launch Your</span>
            <span className="block bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Storefront
            </span>
            <span className="block text-gray-900">in Minutes</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-lg lg:text-xl text-gray-600 leading-relaxed font-light max-w-2xl mx-auto mb-8 sm:mb-8 px-2">
            Create a sleek, shareable online store for your local business. 
            No coding required—just add products and start selling.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 mb-8 sm:mb-12 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => router.push("/register")}
              className="group relative bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-8 py-4 sm:px-8 sm:py-4 rounded-xl font-semibold text-lg sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <span className="relative z-10">Create Your Store</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button
              onClick={() => router.push("/learn-more")}
              className="group text-gray-700 border-2 border-gray-200 px-8 py-4 sm:px-8 sm:py-4 rounded-xl font-medium text-lg sm:text-base lg:text-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform duration-300 sm:w-4 sm:h-4">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1 sm:-space-x-2">
                <div className="w-6 h-6 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full border-2 border-white" />
                <div className="w-6 h-6 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-2 border-white" />
                <div className="w-6 h-6 sm:w-6 sm:h-6 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full border-2 border-white" />
              </div>
              <span className="font-medium">1000+ stores created</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <span>⭐ 4.9/5 rating</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
    </section>
  );
};

export default HeroSection;