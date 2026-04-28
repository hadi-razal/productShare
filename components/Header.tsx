"use client";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
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
      const q = query(collection(db, "users"), where("username", "==", username));
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

const DASHBOARD_ROUTES = ["/store", "/store/add-product", "/store/reviews", "/store/settings"];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themeColor, setThemeColor] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const isStorePage = pathname.startsWith("/store/");
  const isDashboardPage = DASHBOARD_ROUTES.includes(pathname);

  // Hide Header completely on dashboard pages
  if (isDashboardPage) return null;

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
      { href: isAuthenticated ? "/store" : "/", label: isAuthenticated ? "My Store" : "Home" },
      { href: "/pricing", label: "Pricing" },
      { href: "/about-us", label: "About" },
      { href: "/contact", label: "Contact" },
    ];
  })();

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isStorePage && themeColor
            ? ""
            : isScrolled
            ? "bg-white shadow-md"
            : "bg-white backdrop-blur-lg"
        }`}
        style={isStorePage && themeColor ? { backgroundColor: themeColor } : {}}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href={isAuthenticated ? "/store" : "/"}
            className="text-2xl max-h-32 font-extrabold bg-gradient-to-r pt-3 from-blue-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            <Image
              alt="Product Share"
              height={85}
              width={85}
              src={"/productShareLV-cropped.svg"}
            />
          </Link>

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
              <Link
                href="/pricing"
                className="text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 rounded-md hover:scale-105 transition-transform shadow flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
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
              className="md:hidden text-gray-800"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
            {!isStorePage && isAuthenticated && (
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="text-white bg-gradient-to-r from-amber-500 to-orange-500 py-2 rounded-md hover:opacity-90 font-medium flex items-center justify-center gap-1.5 shadow"
              >
                <Sparkles className="w-4 h-4" />
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

      <div className="h-[65px]" />
    </>
  );
};

export default Header;
