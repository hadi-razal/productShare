import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen overflow-hidden">
      {/* Background flare */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-200 via-blue-100 to-transparent opacity-40 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
        {/* Text Section */}
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Launch Your Storefront in Minutes
          </h1>
          <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed tracking-wide">
            Empower your local business by creating a sleek, shareable online store. No coding required. Just add your products, customize your layout, and start selling anywhere.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-6">
            <button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-8 py-3 rounded-md font-semibold text-base shadow-xl  hover:shadow-2xl transition-all duration-300"
            >
              Create Your Store
            </button>
            <button
              onClick={() => router.push("/learn-more")}
              className="text-indigo-700 border border-indigo-300 px-8 py-3 rounded-md font-medium text-base hover:bg-indigo-50/50 transition-all duration-300"
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
              alt="Online Store Illustration"
              width={600}
              height={600}
              className="w-full h-auto drop-shadow-2xl"
              priority
            />
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-md text-xs text-gray-600 shadow-md">
              AI-generated visual content
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
