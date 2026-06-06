"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";

const storeThemeCache = new Map<string, string | null>();
const storeThemePromiseCache = new Map<string, Promise<string | null>>();

const getStoreThemeColor = async (username: string) => {
  if (storeThemeCache.has(username)) {
    return storeThemeCache.get(username) ?? null;
  }

  const cachedPromise = storeThemePromiseCache.get(username);
  if (cachedPromise) {
    return cachedPromise;
  }

  const themePromise = (async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username),
      );
      const snapshot = await getDocs(q);
      const color = snapshot.empty
        ? null
        : (snapshot.docs[0].data().themeColor as string | null) || null;

      storeThemeCache.set(username, color);
      return color;
    } catch (error) {
      console.error("Error fetching theme color:", error);
      return null;
    } finally {
      storeThemePromiseCache.delete(username);
    }
  })();

  storeThemePromiseCache.set(username, themePromise);
  return themePromise;
};

const HIDDEN_HEADER_ROUTES = [
  "/store",
  "/store/add-product",
  "/store/reviews",
  "/store/settings",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themeColor, setThemeColor] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const isStorePage = pathname.startsWith("/store/");
  const hideHeader = HIDDEN_HEADER_ROUTES.includes(pathname);
  const isTransparentHeader = !isScrolled;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        (document.documentElement.scrollTop || window.scrollY) > 10,
      );
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    let isCancelled = false;

    if (!isStorePage) {
      setThemeColor(null);
      return () => {
        isCancelled = true;
      };
    }

    const username = pathname.split("/")[2];
    if (!username) {
      setThemeColor(null);
      return () => {
        isCancelled = true;
      };
    }

    void getStoreThemeColor(username).then((color) => {
      if (!isCancelled) {
        setThemeColor(color);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [pathname, isStorePage]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const links = (() => {
    if (isStorePage) {
      return isAuthenticated ? [{ href: "/store", label: "My Store" }] : [];
    }

    return [
      {
        href: isAuthenticated ? "/store" : "/",
        label: isAuthenticated ? "My Store" : "Home",
      },
      { href: "/pricing", label: "Pricing" },
      { href: "/about-us", label: "About" },
      { href: "/contact", label: "Contact" },
    ];
  })();

  if (hideHeader) return null;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-30">
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              key="header-bg"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-white shadow-sm"
            />
          )}
        </AnimatePresence>

        <div className="relative max-w-screen-xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href={isAuthenticated ? "/store" : "/"}
            className="text-2xl max-h-32 font-extrabold bg-gradient-to-r pt-3 from-blue-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            <Image
              alt="Product Share"
              height={85}
              width={85}
              src={
                isTransparentHeader
                  ? "/white-logo.svg"
                  : "/productShareLV-cropped.svg"
              }
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-all ${
                  isTransparentHeader
                    ? pathname === href
                      ? "text-white font-semibold"
                      : "text-white/90 hover:text-white"
                    : pathname === href
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
              <Link
                href="/pricing"
                className="text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 rounded-md hover:scale-105 transition-transform shadow flex items-center gap-1.5"
              >
                <HiSparkles className="w-4 h-4" />
                Upgrade to Pro
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

          {links.length > 0 && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden z-50 transition-colors ${
                isTransparentHeader ? "text-white" : "text-gray-800"
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && links.length > 0 && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed md:hidden right-0 h-full w-[80%] max-w-xs  bg-gray-50 shadow-xl z-30 flex flex-col px-6 py-6 gap-4 pt-[64px]"
          >
            {links.length > 0 && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden absolute right-10 top-[30px] text-gray-800 z-50"
                aria-label="Toggle menu"
              >
                {menuOpen && <FiX size={24} />}
              </button>
            )}
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
            {!isStorePage && isAuthenticated && (
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="text-white bg-gradient-to-r from-amber-500 to-orange-500 py-2 rounded-md hover:opacity-90 font-medium flex items-center justify-center gap-1.5 shadow"
              >
                <HiSparkles className="w-4 h-4" />
                Upgrade to Pro
              </Link>
            )}
            {isStorePage && isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-white bg-red-600 border py-2 rounded-md hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default Header;
