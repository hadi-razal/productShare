"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themeColor, setThemeColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const isStorePage = pathname.startsWith("/store/");

  // Track auth & scroll
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fetch themeColor from Firestore
  useEffect(() => {
    const fetchThemeColor = async () => {
      if (!isStorePage) {
        setThemeColor(null);
        setLoading(false);
        return;
      }

      const username = pathname.split("/")[2];
      if (!username) return;

      setLoading(true);

      try {
        const q = query(collection(db, "users"), where("username", "==", username));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const color = snapshot.docs[0].data().themeColor || null;
          setThemeColor(color);
        } else {
          setThemeColor(null);
        }
      } catch (error) {
        console.error("Error fetching theme color:", error);
        setThemeColor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchThemeColor();
  }, [pathname, isStorePage]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const links = (() => {
    if (isStorePage) {
      return isAuthenticated ? [{ href: "/login", label: "My Store" }] : [];
    } else {
      return [
        { href: isAuthenticated ? "/login" : "/", label: isAuthenticated ? "My Store" : "Home" },
        { href: "/pricing", label: "Pricing" },
        { href: "/about-us", label: "About" },
        { href: "/contact", label: "Contact" },
      ];
    }
  })();

  // 🔹 Full-screen loading overlay
  if (isStorePage && loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-gray-700 text-lg font-medium">
        Loading the store...
      </div>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isStorePage && themeColor
            ? ""
            : isScrolled
            ? "bg-white shadow-md"
            : "bg-white/70 backdrop-blur-lg"
        }`}
        style={isStorePage && themeColor ? { backgroundColor: themeColor } : {}}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl max-h-32 font-extrabold bg-gradient-to-r pt-3 from-blue-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            <Image
              alt="Product Share"
              height={85}
              width={85}
              src={"/productShareLV-cropped.svg"}
            />
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

            {isStorePage && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 border border-red-300 px-4 py-1.5 rounded-md hover:bg-red-50 transition"
              >
                Logout
              </button>
            )}

            {!isStorePage && !isAuthenticated && (
              <Link
                href="/login"
                className="text-sm font-medium text-white bg-primary px-4 py-1.5 rounded-md hover:scale-105 transition-transform shadow"
              >
                Login
              </Link>
            )}

            {!isStorePage && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-white bg-red-600 border border-red-300 px-4 py-1.5 rounded-md hover:bg-red-400 transition"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Hamburger Icon */}
          {links.length > 0 && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-800"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && links.length > 0 && (
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
            {isStorePage && isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-white bg-red-600 border  py-2 rounded-md hover:bg-red-50 font-medium"
              >
                Logout
              </button>
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
