"use client"

import React, { useState, useEffect } from "react";
import { Menu, X, Store, User, LogOut } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    isFullyScrolled: false,
    scrollProgress: 0
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollProgress = Math.min(scrollY / viewportHeight, 1);
      
      setScrollState({
        isScrolled: scrollY > 50, // Start transition early
        isFullyScrolled: scrollY >= viewportHeight, // At 100vh
        scrollProgress
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    console.log("Logout clicked");
    setMenuOpen(false);
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  // Calculate dynamic styles based on scroll progress
  const getHeaderStyles = () => {
    const { isScrolled, isFullyScrolled, scrollProgress } = scrollState;
    
    if (!isScrolled) {
      return {
        background: 'transparent',
        backdropFilter: 'none',
        borderBottom: 'none',
        boxShadow: 'none'
      };
    }
    
    if (isFullyScrolled) {
      return {
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(147, 51, 234, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      };
    }
    
    // Progressive transition
    const opacity = 0.4 + (scrollProgress * 0.55); // 0.4 to 0.95
    const blur = 8 + (scrollProgress * 12); // 8px to 20px
    const shadowOpacity = scrollProgress * 0.25;
    
    return {
      background: `rgba(15, 23, 42, ${opacity})`,
      backdropFilter: `blur(${blur}px)`,
      borderBottom: `1px solid rgba(147, 51, 234, ${0.05 + scrollProgress * 0.05})`,
      boxShadow: `0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`
    };
  };

  const getLogoStyles = () => {
    const { isScrolled, isFullyScrolled, scrollProgress } = scrollState;
    
    if (!isScrolled) {
      return {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(4px)',
        animation: 'none'
      };
    }
    
    if (isFullyScrolled) {
      return {
        background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(236, 72, 153))',
        backdropFilter: 'none',
        animation: 'glow 3s ease-in-out infinite'
      };
    }
    
    // Progressive transition
    const gradientOpacity = scrollProgress;
    const blurAmount = 4 - (scrollProgress * 4);
    
    return {
      background: `linear-gradient(135deg, rgba(147, 51, 234, ${gradientOpacity}), rgba(236, 72, 153, ${gradientOpacity})), rgba(255, 255, 255, ${0.1 - scrollProgress * 0.1})`,
      backdropFilter: `blur(${blurAmount}px)`,
      animation: scrollProgress > 0.7 ? 'glow 3s ease-in-out infinite' : 'none'
    };
  };

  const getButtonStyles = () => {
    const { isScrolled, isFullyScrolled, scrollProgress } = scrollState;
    
    if (!isScrolled) {
      return {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        animation: 'none'
      };
    }
    
    if (isFullyScrolled) {
      return {
        background: 'linear-gradient(90deg, rgb(147, 51, 234), rgb(236, 72, 153))',
        backdropFilter: 'none',
        border: 'none',
        animation: 'glow 3s ease-in-out infinite'
      };
    }
    
    // Progressive transition
    const gradientOpacity = scrollProgress;
    const blurAmount = 4 - (scrollProgress * 4);
    const borderOpacity = 0.2 - (scrollProgress * 0.2);
    
    return {
      background: `linear-gradient(90deg, rgba(147, 51, 234, ${gradientOpacity}), rgba(236, 72, 153, ${gradientOpacity})), rgba(255, 255, 255, ${0.1 - scrollProgress * 0.1})`,
      backdropFilter: `blur(${blurAmount}px)`,
      border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
      animation: scrollProgress > 0.7 ? 'glow 3s ease-in-out infinite' : 'none'
    };
  };

  return (
    <>
      <style jsx>{`
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.3), 0 0 40px rgba(147, 51, 234, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(147, 51, 234, 0.2);
          }
        }
        
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .header-transition {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .logo-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .button-transition {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -8px;
          right: -8px;
          bottom: 0;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          opacity: 0;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover::before {
          opacity: 1;
        }
        
        .mobile-menu-backdrop {
          backdrop-filter: blur(8px);
        }
      `}</style>

      <header
        className="fixed top-0 left-0 w-full z-50 header-transition"
        style={getHeaderStyles()}
      >
        {/* Animated background gradient overlay */}
        <div 
          className="absolute inset-0 header-transition"
          style={{
            background: scrollState.isScrolled 
              ? `linear-gradient(90deg, 
                  rgba(147, 51, 234, ${0.05 + scrollState.scrollProgress * 0.05}), 
                  rgba(15, 23, 42, ${0.1 + scrollState.scrollProgress * 0.05}), 
                  rgba(6, 182, 212, ${0.05 + scrollState.scrollProgress * 0.05}))` 
              : 'transparent',
            opacity: scrollState.isScrolled ? 1 : 0
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg logo-transition transform hover:scale-110"
              style={getLogoStyles()}
            >
              <Store className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              Empire
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="nav-link text-sm font-medium text-white/80 hover:text-white px-2 py-1 rounded-lg relative z-10"
              >
                {label}
                <div className="absolute -bottom-1 left-2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-[calc(100%-16px)] transition-all duration-300" />
              </a>
            ))}

            {/* User Actions */}
            <div className="ml-4 flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button className="text-sm font-medium text-white/80 hover:text-white transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5">
                    Login
                  </button>
                  <button 
                    className="group relative text-white px-6 py-2.5 rounded-xl font-medium text-sm button-transition hover:scale-105 overflow-hidden transform"
                    style={getButtonStyles()}
                  >
                    <span className="relative z-10">
                      Get Started
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 transform"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50 mobile-menu-backdrop"
          onClick={() => setMenuOpen(false)}
        />
        
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-l border-purple-500/10 shadow-2xl transition-all duration-500 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Mobile menu header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold tracking-tight">Empire</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 transform"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Mobile menu content */}
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              {links.map(({ href, label }, index) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-300 transform hover:translate-x-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: menuOpen ? 'slideInRight 0.5s ease-out forwards' : 'none'
                  }}
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">John Doe</div>
                      <div className="text-white/60 text-sm">john@example.com</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-white/80 hover:text-white border border-white/10 hover:bg-white/5 transition-all duration-300 hover:scale-105 transform"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full p-3 rounded-lg text-white/80 hover:text-white border border-white/10 hover:bg-white/5 transition-all duration-300 hover:scale-105 transform"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg font-medium shadow-lg hover:scale-105 transition-all duration-300 transform hover:shadow-2xl"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Header;