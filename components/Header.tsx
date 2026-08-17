"use client";
import { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { onAuthChange, signOutUser } from "@/lib/auth";
import { getStoreByUsername } from "@/lib/db";
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
      const store = await getStoreByUsername(username);
      const color = store?.themeColor || null;

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
  "/store/products",
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
  const supportsTransparentHeader = pathname === "/";
  const isTransparentHeader =
    supportsTransparentHeader && !isScrolled && !menuOpen;

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
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
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

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
    await signOutUser();
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
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${
          isTransparentHeader
            ? "bg-transparent"
            : "border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
        }`}
      >
        <div className="relative mx-auto flex h-20 max-w-screen-xl items-center justify-between px-5 sm:px-6">
          <Link
            href={isAuthenticated ? "/store" : "/"}
            className="inline-flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Image
              alt="Product Share"
              height={48}
              width={124}
              priority
              sizes="(max-width: 768px) 112px, 124px"
              className="h-10 w-auto sm:h-11"
              src={
                isTransparentHeader
                  ? "/white-logo.svg"
                  : "/productShareLV-cropped.svg"
              }
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isTransparentHeader
                    ? pathname === href
                      ? "bg-white/10 text-white font-semibold"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                    : pathname === href
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
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
                className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
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
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition md:hidden ${
                isTransparentHeader
                  ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                  : "border-slate-200 bg-slate-50 text-slate-800 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <FiMenu size={22} />
            </button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && links.length > 0 && (
          <motion.div
            key="mobile-navigation-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.aside
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-full w-[min(88vw,22rem)] flex-col bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
                <Link
                  href={isAuthenticated ? "/store" : "/"}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center"
                >
                  <Image
                    alt="Product Share"
                    height={44}
                    width={116}
                    className="h-10 w-auto"
                    src="/productShareLV-cropped.svg"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
                  aria-label="Close navigation menu"
                >
                  <FiX size={21} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6">
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Explore
                </p>
                <nav className="mt-3 space-y-1" aria-label="Mobile navigation links">
                  {links.map(({ href, label }) => {
                    const isActive = pathname === href;

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-medium transition ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                        }`}
                      >
                        <span>{label}</span>
                        <FiArrowRight
                          className={`h-4 w-4 ${isActive ? "text-indigo-500" : "text-slate-300"}`}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/80 p-4">
                {!isAuthenticated ? (
                  <div className="grid gap-3">
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      Create your store
                      <FiArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                    >
                      <FiLogIn className="h-4 w-4" />
                      Log in
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {!isStorePage && (
                      <Link
                        href="/pricing"
                        onClick={() => setMenuOpen(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm"
                      >
                        <HiSparkles className="h-4 w-4" />
                        Upgrade to Pro
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void handleLogout();
                        setMenuOpen(false);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
