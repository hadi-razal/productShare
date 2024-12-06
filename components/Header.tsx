"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Menu, X, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { getUserId } from "@/helpers/getUserId";
import AlertMessageSlider from "./AlertSlider";
import Image from "next/image";

// Improved type definitions with more specificity
interface StoreDetails {
  name: string;
  themeColor: string;
  logoImage?: string;
}

interface NavigationLink {
  href: string;
  label: string;
}

const MAIN_NAVIGATION_LINKS: NavigationLink[] = [
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

const DEFAULT_STORE_DETAILS: StoreDetails = {
  name: "Product Share",
  themeColor: "#6e41e8",
};

const Header: React.FC = () => {
  // Consolidated state management
  const [headerState, setHeaderState] = useState({
    isMenuOpen: false,
    isAuthenticated: false,
    storeDetails: DEFAULT_STORE_DETAILS,
  });

  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const { storeId } = useParams();

  // Centralized error handling utility
  const handleError = useCallback((context: string, error: unknown) => {
    console.error(`${context} error:`, error);
    // Could add more robust error tracking or user notification
  }, []);

  // Optimized navigation handler
  const handleNavigation = useCallback(() => {
    try {
      if (headerState.isAuthenticated) {
        router.push("/store");
        return;
      }
      if (!headerState.isAuthenticated && pathname?.startsWith("/store/") && storeId) {
        router.push(`/store/${storeId}`);
      }

      if(!headerState.isAuthenticated && !storeId){
        router.push(`/`);
      }

    } catch (error) {
      handleError("Navigation", error);
    }
  }, [headerState.isAuthenticated, pathname, storeId, router, handleError]);

  // Refined store details fetching with improved error handling
  const fetchStoreDetails = useCallback(async () => {
    if (!storeId || !pathname.startsWith("/store")) return;

    try {
      const userId = await getUserId(storeId as string);
      const userRef = doc(db, "users", userId as string);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setHeaderState(prev => ({
          ...prev,
          storeDetails: {
            name: data.name || DEFAULT_STORE_DETAILS.name,
            themeColor: data.themeColor || DEFAULT_STORE_DETAILS.themeColor,
            logoImage: data.logoImage,
          },
        }));
      }
    } catch (error) {
      handleError("Store details fetch", error);
    }
  }, [storeId, pathname, handleError]);

  // Logout handler with centralized error management
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/login");
      setHeaderState(prev => ({ ...prev, isMenuOpen: false }));
    } catch (error) {
      handleError("Logout", error);
    }
  }, [router, handleError]);

  // Authentication effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setHeaderState(prev => ({ ...prev, isAuthenticated: !!user }));
    });

    return () => unsubscribe();
  }, []);

  // Store details effect
  useEffect(() => {
    fetchStoreDetails();
  }, [fetchStoreDetails]);

  // Responsive menu effect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setHeaderState(prev => ({ ...prev, isMenuOpen: false }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoized navigation links
  const navigationLinks = useMemo(() => 
    !headerState.isAuthenticated
      ? MAIN_NAVIGATION_LINKS.map((link) => ({
          ...link,
          href: link.href.startsWith("#")
            ? pathname === "/" ? link.href : `/${link.href}`
            : link.href,
        }))
      : [],
    [headerState.isAuthenticated, pathname]
  );

  // Toggle menu function
  const toggleMenu = useCallback(() => {
    setHeaderState(prev => ({ ...prev, isMenuOpen: !prev.isMenuOpen }));
  }, []);

  return (
    <motion.header
      className="fixed w-full top-0 z-50 transition-all duration-300 "
      style={{ backgroundColor: headerState.storeDetails.themeColor }}
    >
    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <motion.div
            onClick={handleNavigation}
            className="flex items-center cursor-pointer space-x-1"
          >
            {!headerState.storeDetails.logoImage && (
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md backdrop-blur-sm">
                <Share2 className="h-7 w-7 text-white" />
              </div>
            )}
            <div className="text-2xl font-bold tracking-tight text-white flex items-center">
              {/* {headerState.storeDetails.logoImage && (
                <Image
                  src={headerState.storeDetails.logoImage}
                  alt="Store logo"
                  width={40}
                  sizes="cover"
                  height={40}
                  className="mr-2 object-cover rounded"
                />
              )} */}
              <span>{headerState.storeDetails.name}</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {!headerState.isAuthenticated ? (
              <div className="flex gap-4 items-center justify-center">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:opacity-80 transition-opacity"
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-md border border-gray-300 text-white hover:shadow-lg transition-all duration-200 font-medium"
                >
                  Login
                </Link>
              </div>
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

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {headerState.isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation Drawer */}
        <motion.div
          initial={false}
          animate={{
            opacity: headerState.isMenuOpen ? 1 : 0,
            y: headerState.isMenuOpen ? 0 : -20,
          }}
          className={`md:hidden absolute inset-x-0 top-20 bg-gray-900/95 backdrop-blur-md transition-all duration-300 ${
            headerState.isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div className="p-4 space-y-4">
            {!headerState.isAuthenticated && (
              <div className="flex flex-col space-y-2">
                {navigationLinks.slice(3).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white"
                    onClick={() => setHeaderState(prev => ({ ...prev, isMenuOpen: false }))}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
            {!headerState.isAuthenticated ? (
              <Link
                href="/login"
                onClick={() => setHeaderState(prev => ({ ...prev, isMenuOpen: false }))}
                className="block w-full text-center px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-6 py-3 rounded-md bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      </nav>

      {pathname === "/store/123" && <AlertMessageSlider />}
    </motion.header>
  );
};

export default Header;