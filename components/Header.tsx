"use client";

import { useEffect, useState } from "react";
import { Menu, X, Share2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { getUserId } from "@/helpers/getUserId";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ href, children, onClick }: NavLinkProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="relative"
  >
    <Link
      href={href}
      onClick={onClick}
      className="group relative block px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transform origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </Link>
  </motion.div>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [storeName, setStoreName] = useState<string | null>(null);
  const router = useRouter();
  const path = usePathname();
  const { storeId } = useParams();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    try {
      if (isUser) {
        router.push("/store");
        return;
      }
      if (!isUser && path?.startsWith('/store/') && storeId) {
        router.push(`/store/${storeId}`);
        return;
      }
    } catch (error) {
      console.error("Error navigating to the store:", error);
    }
  };

  const fetchStoreName = async () => {
    if (!storeId || !path.startsWith("/store/")) return;
    try {
      const userId = await getUserId(storeId as string);
      const userRef = doc(db, "users", userId as string);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setStoreName(userDoc.data().name);
      }
    } catch (error) {
      console.error("Error fetching store name:", error);
    }
  };

  useEffect(() => {
    fetchStoreName();
  }, [storeId, path]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUser(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
      setIsOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isOpen ? "h-screen md:h-20" : "h-20"
        } ${isScrolled || path !== '/'
          ? "bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 relative">
        <div className="flex items-center justify-between h-full">
          <motion.div
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer space-x-3"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md backdrop-blur-sm">
              <Share2 className="h-7 w-7 text-white" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {isUser ? (
                <div className="flex flex-col items-start justify-center">
                  <span className="flex items-center gap-2">
                    Product Share
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </span>
                  <span className="text-xs text-gray-300">Your customers can see this as your store name</span>
                </div>
              ) : (
                <span>{storeName || "Product Share"}</span>
              )}
            </div>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            {!isUser ? (
              <>
                <NavLink href="/about-us">About</NavLink>
                <NavLink href="/contact">Contact</NavLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className="px-6 py-2.5 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium"
                  >
                    Login
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-md bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-medium"
              >
                Logout
              </motion.button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : -20,
          }}
          className={`md:hidden absolute inset-x-0 top-20 bg-gray-900/95 backdrop-blur-md transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
        >
          <div className="p-4 space-y-4">
            {!isUser && (
              <div className="flex flex-col space-y-4">
                
                <NavLink href="/about-us" onClick={() => setIsOpen(false)}>
                  About
                </NavLink>
                <NavLink href="/contact" onClick={() => setIsOpen(false)}>
                  Contact
                </NavLink>
              </div>
            )}
            {!isUser ? (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-6 py-3 rounded-md bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
};

export default Header;