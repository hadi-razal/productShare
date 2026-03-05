import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Star, TrendingUp, Zap, ShoppingCart, Heart, Search, Share2 } from "lucide-react";

const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    originalPrice: "299",
    salePrice: "199",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop&crop=center",
    discount: "33% OFF",
    rating: "4.8",
    category: "Audio",
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    originalPrice: "449",
    salePrice: "349",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop&crop=center",
    discount: "22% OFF",
    rating: "4.9",
    category: "Wearables",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    originalPrice: "159",
    salePrice: "99",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop&crop=center",
    discount: "38% OFF",
    rating: "4.7",
    category: "Audio",
  },
  {
    id: 4,
    name: "Laptop Stand",
    originalPrice: "89",
    salePrice: "59",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop&crop=center",
    discount: "34% OFF",
    rating: "4.6",
    category: "Accessories",
  },
];

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex items-center px-6 lg:px-12 py-12 overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Background blobs */}
      <div className="absolute -top-28 -left-28 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-35 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#6c64cb 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center relative z-10">

        {/* ─── Left ─── */}
        <motion.div
          className="space-y-7"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm text-primary font-semibold tracking-wide">Trusted by 500+ Sellers</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-[4rem] font-extrabold leading-[1.1] tracking-tight text-slate-900"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            Transform Your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #6c64cb 0%, #a78bfa 60%, #818cf8 100%)" }}
            >
              Product Catalog
            </span>
            <br />
            into{" "}
            <span
              className="relative inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #7c3aed, #c084fc)" }}
            >
              Premium Showcases
              {/* underline accent */}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M2 6 Q75 2 150 5 Q225 8 298 4" stroke="url(#heroUnderline)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="heroUnderline" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-lg text-slate-500 leading-relaxed max-w-[440px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create clean, shareable catalogs that turn browsers into buyers.
            No website needed — just your products, beautifully presented.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => router.push("/register")}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #6c64cb, #7c3aed)" }}
            >
              Start Free Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-medium text-slate-700 border border-slate-200 bg-white hover:border-primary/40 hover:text-primary hover:shadow-md transition-all duration-300">
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <Play className="w-3 h-3 text-primary fill-primary ml-0.5" />
              </span>
              Watch Demo
            </button>
          </motion.div>

          {/* Stat pills */}
          <motion.div
            className="flex flex-wrap gap-3 pt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {[
              { icon: <TrendingUp className="w-3.5 h-3.5 text-primary" />, value: "500+", label: "Sellers" },
              { icon: <Zap className="w-3.5 h-3.5 text-yellow-500" />, value: "10k+", label: "Products" },
              { icon: <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />, value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-1.5"
              >
                {stat.icon}
                <span className="font-bold text-slate-900 text-sm">{stat.value}</span>
                <span className="text-slate-400 text-xs">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ─── Right — Product Showcase ─── */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          {/* Soft glow behind the card */}
          <div className="absolute inset-4 bg-gradient-to-br from-violet-300/30 to-indigo-300/30 rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative bg-white border border-slate-200/80 rounded-2xl p-6 md:p-7 shadow-[0_20px_60px_rgba(108,100,203,0.15)]">
            {/* Card header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-0.5">Featured Products</h3>
                <p className="text-xs text-slate-400">Best deals this week</p>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 gap-3">
              {mockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group bg-slate-50 border border-slate-100 rounded-xl p-3 hover:border-primary/30 hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer overflow-hidden"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + index * 0.08 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="relative mb-3 overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-24 md:h-28 object-cover group-hover:scale-110 transition-transform duration-400"
                    />
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                      {product.discount}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-green-600">₹{product.salePrice}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{product.originalPrice}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400">({product.rating})</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View all CTA */}
            <motion.button
              className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #6c64cb, #7c3aed)" }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Floating badge — Live */}
          <motion.div
            className="absolute -top-4 -right-4 flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_18px_rgba(124,58,237,0.4)] z-10"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live Catalog
          </motion.div>

          {/* Floating badge — Mobile Ready */}
          <motion.div
            className="absolute -bottom-4 -left-4 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-[0_4px_18px_rgba(16,185,129,0.35)] z-10"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            📱 Mobile Ready
          </motion.div>

          {/* Floating badge — Sales */}
          <motion.div
            className="absolute top-1/2 -left-5 -translate-y-1/2 flex items-center gap-1.5 bg-white border border-amber-200 text-amber-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg z-10"
            animate={{ x: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <TrendingUp className="w-3 h-3" />
            +300% Sales
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
