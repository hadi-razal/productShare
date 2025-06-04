import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Store,
  Zap,
  Globe,
  TrendingUp,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: any) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const IndiaFlag = () => (
    <svg width="24" height="16" viewBox="0 0 3 2" className="shadow-sm">
      <rect width="3" height="2" fill="#FF9933" />
      <rect y="0.67" width="3" height="0.66" fill="#FFFFFF" />
      <rect y="1.33" width="3" height="0.67" fill="#138808" />
      <circle cx="1.5" cy="1" r="0.25" fill="#000080" />
    </svg>
  );

  const FloatingCard = ({ children, delay = 0, className = "" }: any) => (
    <div
      className={`absolute animate-pulse ${className}`}
      style={{
        animation: `float 4s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.4);
          }
          50% {
            box-shadow: 0 0 60px rgba(147, 51, 234, 0.8);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .glow-animation {
          animation: glow 3s ease-in-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <section className="relative pt-5 min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"
            style={{
              left: `${mousePosition.x * 0.1}%`,
              top: `${mousePosition.y * 0.1}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-15"
            style={{
              right: `${mousePosition.x * 0.05}%`,
              bottom: `${mousePosition.y * 0.08}%`,
            }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 h-screen">
            {/* Text Section */}
            <div
              className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 text-sm text-purple-300 font-medium">
                <Sparkles className="w-4 h-4" />
                <span>India's #1 Store Builder</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>

              {/* Main Heading - Simplified */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tighter">
                <span className="block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Build Your
                </span>
                <span className="block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Empire
                </span>

                <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-purple-300 mt-2">
                  in minutes ⚡
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-xl sm:text-2xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Zero code. Maximum impact. Build stores that
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-semibold">
                  {" "}
                  convert like crazy
                </span>
                .
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Lightning Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span>Global Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Sales Optimized</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-8">
                <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 glow-animation overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    <Store className="w-5 h-5" />
                    Start Building
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button className="group text-white border-2 border-purple-500/50 backdrop-blur-sm px-12 py-5 rounded-2xl font-semibold text-lg hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    See Examples
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </span>
                </button>
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-6 text-sm text-gray-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-slate-900"
                    />
                  ))}
                </div>
                <span>Join 50K+ successful sellers</span>
              </div>
            </div>

            {/* Interactive Stats Display */}
            <div
              className={`lg:flex hidden justify-center lg:justify-end transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="relative w-full max-w-[500px] h-[500px]">
                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl glow-animation">
                  <ShoppingBag className="w-12 h-12 text-white" />
                </div>

                {/* Floating Success Cards */}
                <FloatingCard delay={0} className="top-0 left-1/4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl">
                    <div className="text-xs opacity-80">Monthly Sales</div>
                    <div className="text-2xl font-bold">₹2.5L+</div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={1} className="top-20 right-0">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-2xl shadow-xl">
                    <div className="text-xs opacity-80">Active Stores</div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      50K+ <Users className="w-4 h-4" />
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={2} className="bottom-20 left-0">
                  <div className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-2xl shadow-xl">
                    <div className="text-xs opacity-80">Avg Rating</div>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      4.9 <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={1.5} className="bottom-0 right-1/4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-xl">
                    <div className="text-xs opacity-80">Setup Time</div>
                    <div className="text-2xl font-bold">2 mins</div>
                  </div>
                </FloatingCard>

                <FloatingCard
                  delay={0.5}
                  className="top-1/2 left-0 transform -translate-y-1/2"
                >
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl shadow-xl">
                    <div className="text-xs opacity-80">Success Rate</div>
                    <div className="text-2xl font-bold">96%</div>
                  </div>
                </FloatingCard>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="50%"
                    y1="50%"
                    x2="25%"
                    y2="15%"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;10"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1="50%"
                    y1="50%"
                    x2="85%"
                    y2="25%"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;10"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1="50%"
                    y1="50%"
                    x2="15%"
                    y2="75%"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;10"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </line>
                </svg>

                {/* India badge */}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/50 to-transparent" />
      </section>
    </>
  );
};

export default HeroSection;
