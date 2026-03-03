import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();

  const mockProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      originalPrice: "299",
      salePrice: "199",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop&crop=center",
      discount: "33% OFF"
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      originalPrice: "449",
      salePrice: "349",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop&crop=center",
      discount: "22% OFF"
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      originalPrice: "159",
      salePrice: "99",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop&crop=center",
      discount: "38% OFF"
    },
    {
      id: 4,
      name: "Laptop Stand",
      originalPrice: "89",
      salePrice: "59",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop&crop=center",
      discount: "34% OFF"
    }
  ];

  return (
    <section className="relative min-h-[80vh] flex items-center px-6 lg:px-12 py-10 bg-white">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        
        
        <motion.div
          className="md:space-y-6 sm:space-y-4 space-y-2"
        >
    
          <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-2xl text-sm text-slate-600">
            Trusted by 500+ sellers
          </div>
         
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Transform Your{" "}
            <span className="text-primary">Product Catalog</span> into
            Premium Showcases
          </h1>
         
          <p className="text-lg text-slate-600">
            Create clean, shareable catalogs that turn browsers into buyers.
          </p>
        
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/register")}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/80    transition"
            >
              Start Free
            </button>
            <button className="flex items-center justify-center text-center gap-2 text-slate-700 hover:text-slate-900 transition">
              ▶ Watch Demo
            </button>
          </div>
        </motion.div>

       
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Featured Products</h3>
                <p className="text-xs text-slate-500">Best deals of the week</p>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {mockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group bg-white border border-slate-200 rounded-xl p-3 md:p-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Product Image */}
                  <div className="relative mb-3 overflow-hidden rounded-lg bg-slate-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-24 md:h-28 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Discount Badge */}
                    <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] md:text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                      {product.discount}
                    </span>
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-2">
                    <h4 className="text-xs md:text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm md:text-base font-bold text-green-600">
                        ₹{product.salePrice}
                      </span>
                      <span className="text-[10px] md:text-xs text-slate-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        (4.{Math.floor(Math.random() * 9) + 1})
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* View More Button */}
            <motion.button 
              className="w-full mt-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Products
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.button>
          </div>
          
          {/* Floating Elements */}
          <motion.div 
            className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl z-10"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔴 Live Catalog
          </motion.div>
          <motion.div 
            className="absolute -bottom-3 -left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl z-10"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            📱 Mobile Ready
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;