"use client";

import { useEffect, useState, useCallback } from "react";
import { Menu, X, Share2, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Link from "next/link";

const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Header: React.FC = () => {
  const [headerState, setHeaderState] = useState({
    isMenuOpen: false,
    isAuthenticated: false,
    isScrolled: false,
    themeColor: "#6e41e8",
  });

  const router = useRouter();
  const pathname = usePathname();
  const { storeId } = useParams();

  const handleNavigation = useCallback(() => {
    try {
      const destination = headerState.isAuthenticated
        ? "/store"
        : storeId
        ? `/store/${storeId}`
        : "/";
      router.push(destination);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [headerState.isAuthenticated, storeId, router]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/login");
      setHeaderState((prev) => ({ ...prev, isMenuOpen: false }));
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderState((prev) => ({
        ...prev,
        isScrolled: window.scrollY > 50
      }));
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setHeaderState((prev) => ({ ...prev, isAuthenticated: !!user }));
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribeAuth();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    setHeaderState((prev) => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        boxShadow: headerState.isScrolled 
          ? "0 10px 15px rgba(0,0,0,0.1)" 
          : "0 4px 6px rgba(0,0,0,0.05)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      className={`
        fixed z-50 lg:w-full max-w-5xl px-4 py-3 
        rounded-md top-3 mx-auto w-[calc(100vw-30px)]  left-0 right-0
         -translate-x-1/2 
        transition-all duration-300 ease-in-out
        ${headerState.isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : ''}
      `}
      style={{ 
        backgroundColor: headerState.isScrolled 
          ? 'rgba(255,255,255,0.9)' 
          : headerState.themeColor 
      }}
    >
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <motion.div
          onClick={handleNavigation}
          whileTap={{ scale: 0.95 }}
          className="flex items-center cursor-pointer space-x-3"
        >
          <div className={`
            p-2 rounded-md 
            ${headerState.isScrolled ? 'bg-purple-100/50' : 'bg-white/20'}
          `}>
            <Share2 className={`
              h-6 w-6 
              ${headerState.isScrolled ? 'text-purple-600' : 'text-white'}
            `} />
          </div>
          <span className={`
            text-xl font-bold tracking-tight
            ${headerState.isScrolled ? 'text-gray-800' : 'text-white'}
          `}>
            Product Share
          </span>
        </motion.div>

        {/* Centered Navigation */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                transition-colors 
                ${headerState.isScrolled 
                  ? 'text-gray-700 hover:text-purple-600' 
                  : 'text-white hover:opacity-75'}
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right-side Actions */}
        <div className="flex items-center space-x-4">
          {!headerState.isAuthenticated ? (
            <Link
              href="/login"
              className={`
                px-4 py-2 rounded-md 
                ${headerState.isScrolled 
                  ? 'border border-purple-300 text-purple-600 hover:bg-purple-50' 
                  : 'border border-white/30 text-white hover:bg-white/10'}
                transition-colors
              `}
            >
              Login
            </Link>
          ) : (
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md
                ${headerState.isScrolled 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-red-500/20 text-white hover:bg-red-500/30'}
                transition-colors
              `}
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
            className={`
              md:hidden 
              ${headerState.isScrolled ? 'text-gray-800' : 'text-white'}
            `}
          >
            {headerState.isMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {headerState.isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full w-full bg-white shadow-lg rounded-b-xl overflow-hidden mt-2"
            >
              <div className="flex flex-col p-4 space-y-3">
                {NAVIGATION_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={toggleMenu}
                    className="text-gray-700 py-2 border-b border-gray-200 hover:bg-gray-100"
                  >
                    {link.label}
                  </Link>
                ))}

                {!headerState.isAuthenticated ? (
                  <Link
                    href="/login"
                    onClick={toggleMenu}
                    className="w-full text-center py-3 bg-purple-600 text-white rounded-md"
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-600 text-white rounded-md"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;