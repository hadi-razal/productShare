import React from "react";
import {
  ArrowRight,
  Sparkles,
  ShoppingCart,
  Package,
  Receipt,
  Tag,
  Truck,
  Layers,
  Box,
  Briefcase,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

const AnimatedIcon = ({
  Icon,
  className = "",
  x,
  y,
  rotation = 0,
  scale = 1,
  animationType = "animate-float",
  color = "text-blue-200/40",
}: any) => {
  const animationStyles = {
    top: `${y}%`,
    left: `${x}%`,
    transform: `rotate(${rotation}deg) scale(${scale})`,
    animationDelay: `${Math.random() * 3}s`,
  };

  return (
    <div
      className={`absolute transform transition-all duration-[5000ms] ease-in-out 
        ${animationType} ${className} ${color} opacity-50 hover:opacity-70`}
      style={animationStyles}
    >
      <Icon className="w-12 h-12 md:w-16 md:h-16" />
    </div>
  );
};

const HeroSection = () => {
  const router = useRouter();

  const iconConfigurations = [
    {
      Icon: ShoppingCart,
      x: 10,
      y: 20,
      rotation: -15,
      scale: 1.2,
      animationType: "animate-bounce",
      color: "text-blue-300/100",
    },
    {
      Icon: Package,
      x: 80,
      y: 30,
      rotation: 20,
      scale: 0.9,
      animationType: "animate-spin",
      color: "text-purple-300/100",
    },
    {
      Icon: Receipt,
      x: 25,
      y: 70,
      rotation: -10,
      scale: 1,
      animationType: "animate-pulse",
      color: "text-green-300/100",
    },
    {
      Icon: Tag,
      x: 70,
      y: 60,
      rotation: 15,
      scale: 0.8,
      animationType: "animate-bounce",
      color: "text-red-300/100",
    },
    {
      Icon: Truck,
      x: 15,
      y: 50,
      rotation: -5,
      scale: 1.1,
      animationType: "animate-float",
      color: "text-indigo-300/100",
    },
    {
      Icon: Layers,
      x: 85,
      y: 75,
      rotation: 10,
      scale: 0.7,
      animationType: "animate-spin",
      color: "text-cyan-300/100",
    },
    {
      Icon: Box,
      x: 40,
      y: 15,
      rotation: -20,
      scale: 1,
      animationType: "animate-pulse",
      color: "text-orange-300/100",
    },
    {
      Icon: Briefcase,
      x: 60,
      y: 85,
      rotation: 25,
      scale: 0.9,
      animationType: "animate-float",
      color: "text-yellow-300/100",
    },
    {
      Icon: CreditCard,
      x: 30,
      y: 40,
      rotation: 5,
      scale: 0.8,
      animationType: "animate-bounce",
      color: "text-pink-300/100",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Animated Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {iconConfigurations.map((config, index) => (
          <AnimatedIcon key={index} {...config} />
        ))}
      </div>

      {/* Gradient Background Layers */}
      <div
        className="absolute inset-0 
        bg-gradient-to-br 
        from-blue-50/100 
        via-white/80 
        to-purple-100/100 
        opacity-50 
        animate-gradient-slow"
      ></div>

      {/* Decorative Blurred Shapes */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 
        bg-blue-200 
        rounded-full 
        mix-blend-multiply 
        filter blur-3xl 
        opacity-30 
        -z-10 
        animate-blob"
      ></div>
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 
        bg-purple-200 
        rounded-full 
        mix-blend-multiply 
        filter blur-3xl 
        opacity-30 
        -z-10 
        animate-blob-reverse"
      ></div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 
        bg-grid-slate-100/20 
        [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.4))]"
      ></div>

      <div className="container relative mx-auto px-6 py-24 text-center">
        <div className="relative z-10">
          {/* Headline */}
          <h1 className="text-5xl font-sans f md:text-6xl font-extrabold text-gray-900 leading-10 mb-6">
            Transform Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Product Catalog
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg  font-sans leading-5  md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Unlock the power of intelligent catalog creation and AI-driven
            marketing solutions tailored for modern businesses with cutting-edge
            technology.
          </p>

          {/* Buttons */}
          <div className="sm:flex items-center justify-center grid gap-2 grid-cols-2 px-5">
            <button
              onClick={() => router.push("/register")}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white 
              px-5 py-3 md:py-4 text-base flex items-center justify-center rounded-md"
            >
              Get Started
            </button>

            <button
              onClick={() => router.push("/learn-more")}
              className="border-2 border-gray-300 text-gray-700 
              px-5 py-3 md:py-4
              hover:bg-gray-100  text-base flex items-center justify-center rounded-md"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
