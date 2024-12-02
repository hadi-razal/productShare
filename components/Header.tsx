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

// Type definitions
interface StoreDetails {
  name: string;
  themeColor?: string;
  logoImage?: string;
}

interface NavigationLink {
  href: string;
  label: string;
}

const MAIN_NAVIGATION_LINKS: NavigationLink[] = [
  { href: "#testimonials", label: "Testimonials" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Header: React.FC = () => {
  // State management with explicit typing
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [storeDetails, setStoreDetails] = useState<StoreDetails>({
    name: "Product Share",
    themeColor: "#172554",
  });

  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const { storeId } = useParams();

  // Memoized navigation handler to prevent unnecessary re-renders
  const handleLogoClick = useCallback(() => {
    try {
      if (isAuthenticated) {
        router.push("/store");
        return;
      }
      if (!isAuthenticated && pathname?.startsWith("/store/") && storeId) {
        router.push(`/store/${storeId}`);
        return;
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [isAuthenticated, pathname, storeId, router]);

  // Optimized store details fetching
  const fetchStoreDetails = useCallback(async () => {
    if (!storeId || !pathname.startsWith("/store")) return;

    try {
      const userId = await getUserId(storeId as string);
      const userRef = doc(db, "users", userId as string);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setStoreDetails({
          name: data.name || "Product Share",
          themeColor: data.themeColor || "#1e3a8a",
          logoImage: data.logoImage,
        });
      }
    } catch (error) {
      console.error("Store details fetch error:", error);
    }
  }, [storeId, pathname]);

  // Logout handler with error handling
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      router.push("/login");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally show user-friendly error toast/notification
    }
  }, [router]);

  // Authentication and resize effect hooks
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchStoreDetails();
  }, [fetchStoreDetails]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoized navigation links to adjust based on authentication
  const navigationLinks = useMemo(() => {
    return isAuthenticated
      ? []
      : MAIN_NAVIGATION_LINKS.map((link) => ({
          ...link,
          href: link.href.startsWith("#")
            ? pathname === "/"
              ? link.href
              : `/${link.href}`
            : link.href,
        }));
  }, [isAuthenticated, pathname]);

  return (
    <motion.header
      className="fixed w-full top-0 z-50 transition-all duration-300"
      style={{ backgroundColor: storeDetails.themeColor }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <motion.div
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer space-x-1"
          >
            {!storeDetails.logoImage && (
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md backdrop-blur-sm">
                <Share2 className="h-7 w-7 text-white" />
              </div>
            )}
            <div className="text-2xl font-bold tracking-tight text-white flex items-center">
              {storeDetails.logoImage && (
                <Image
                  src={storeDetails.logoImage}
                  alt="Store logo"
                  width={40}
                  height={40}
                  className="mr-2 object-cover rounded"
                />
              )}
              <span>{storeDetails.name}</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {!isAuthenticated ? (
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
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
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
            opacity: isMenuOpen ? 1 : 0,
            y: isMenuOpen ? 0 : -20,
          }}
          className={`md:hidden absolute inset-x-0 top-20 bg-gray-900/95 backdrop-blur-md transition-all duration-300 ${
            isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div className="p-4 space-y-4">
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2">
                {navigationLinks.slice(3).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
            {!isAuthenticated ? (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
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

      {pathname === "/store/123" && <AlertMessageSlider />}
    </motion.header>
  );
};

export default Header;
