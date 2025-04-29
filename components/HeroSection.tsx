import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-purple-100 min-h-[90vh] overflow-hidden">
      {/* Background flare */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200 via-blue-100 to-transparent opacity-40 blur-3xl" />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 overflow-hidden">
        {/* Text section */}
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
            AI-Powered Catalogs for the Modern Seller
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
            Create stunning product catalogs in seconds and reach your audience with smart, automated marketing strategies.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-transform shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push("/learn-more")}
              className="text-blue-600 border border-blue-300 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px]">
            <Image
              src="/Online shopping-bro.svg"
              alt="AI Catalog Illustration"
              width={600}
              height={600}
              className="w-full h-auto drop-shadow-xl"
              priority
            />
            <div className="absolute bottom-0 right-0 bg-white/70 backdrop-blur-md px-4 py-2 rounded-lg text-xs text-gray-700 shadow-lg">
              AI-generated visual content
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
