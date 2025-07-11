"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const links = [
    {
      href: isAuthenticated ? "/login" : "/",
      label: isAuthenticated ? "My Store" : "Home",
    },
    { href: "/pricing", label: "Pricing" },
    { href: "/about-us", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/70 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-5 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl max-h-32 font-extrabold bg-gradient-to-r pt-3 from-blue-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
           <Image alt="Product Share" height={85} width={85}  src={'/productShareLV-cropped.svg'}/>

          
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-all ${
                  pathname === href
                    ? "text-indigo-700 font-semibold"
                    : "text-gray-700 hover:text-indigo-700"
                }`}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 border border-red-300 px-4 py-1.5 rounded-md hover:bg-red-50 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-white bg-primary px-4 py-1.5 rounded-md hover:scale-105 transition-transform shadow"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Hamburger Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-800"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-[64px] right-0 h-[calc(100vh-64px)] w-[80%] max-w-xs bg-white shadow-xl z-40 flex flex-col px-6 py-6 gap-4"
          >
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium transition ${
                  pathname === href
                    ? "text-indigo-700 font-semibold"
                    : "text-gray-700 hover:text-indigo-700"
                }`}
              >
                {label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-red-600 border border-red-300 py-2 rounded-md hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-primary text-white py-2 rounded-md text-center font-medium hover:scale-105 transition"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offset to prevent content jump */}
      <div className="h-[65px]" />
    </>
  );
};

export default Header;