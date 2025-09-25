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
          
        >
          <div className="bg-gradient-to-br from-slate-50 to-white border rounded-xl p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Featured Products</h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
         
            <div className="grid grid-cols-2 gap-4">
              {mockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                 
                >
                 
                  <div className="relative mb-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-16 sm:h-20 object-cover rounded"
                    />
                   
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {product.discount}
                    </span>
                  </div>
                  
                 
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-800 line-clamp-1">
                      {product.name}
                    </h4>
                    
                   
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-600">
                        &#8377;{product.salePrice}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        &#8377;{product.originalPrice}
                      </span>
                    </div>
                    
                  
                    <div className="flex items-center gap-[2px]">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">
                          ⭐
                        </span>
                      ))}
                      <span className="text-xs text-slate-500 ml-1">
                        (4.{Math.floor(Math.random() * 9) + 1})
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* View More Button */}
            <motion.button 
              className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-primary py-2 rounded-lg text-sm font-medium transition-colors"
            
             
            >
              View All Products →
            </motion.button>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Live Catalog
          </div>
          <div className="absolute -bottom-4 -left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Mobile Ready
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;