"use client";
import { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
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

  const navLinkClass = (href: string) => {
    const active = pathname === href;
    if (isTransparentHeader) {
      return active
        ? "text-white"
        : "text-white/75 hover:text-white";
    }
    return active
      ? "text-primary"
      : "text-slate-600 hover:text-primary";
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${
          isTransparentHeader
            ? "bg-transparent"
            : "border-b border-primary/10 bg-white/95 backdrop-blur-xl"
        }`}
      >
        <div className="relative mx-auto flex h-20 max-w-[1440px] items-center justify-between px-3 sm:px-5">
          <Link
            href={isAuthenticated ? "/store" : "/"}
            className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-[12px] font-medium uppercase tracking-[0.16em] transition-colors ${navLinkClass(href)}`}
              >
                {label}
              </Link>
            ))}

            {isStorePage && isAuthenticated && (
              <button
                onClick={handleLogout}
                className={`text-[12px] font-medium uppercase tracking-[0.16em] ${
                  isTransparentHeader
                    ? "text-white/80 hover:text-white"
                    : "text-slate-500 hover:text-primary"
                }`}
              >
                Logout
              </button>
            )}

            {!isStorePage && !isAuthenticated && (
              <Link
                href="/login"
                className="bg-primary px-4 py-2 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-primary/90"
              >
                Login
              </Link>
            )}

            {!isStorePage && isAuthenticated && (
              <>
                <Link
                  href="/pricing"
                  className="border border-primary px-4 py-2 text-[12px] font-medium uppercase tracking-[0.16em] text-primary hover:bg-primary hover:text-white"
                >
                  Upgrade
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[12px] font-medium uppercase tracking-[0.16em] text-slate-500 hover:text-primary"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          {links.length > 0 && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`inline-flex h-10 w-10 items-center justify-center md:hidden ${
                isTransparentHeader
                  ? "text-white"
                  : "text-slate-800 hover:text-primary"
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
            className="fixed inset-0 z-50 bg-slate-950/40 md:hidden"
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
              className="ml-auto flex h-full w-[min(88vw,22rem)] flex-col bg-white"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex h-20 items-center justify-between border-b border-primary/10 px-5">
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
                  className="inline-flex h-10 w-10 items-center justify-center text-slate-700 hover:text-primary"
                  aria-label="Close navigation menu"
                >
                  <FiX size={21} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                  Explore
                </p>
                <nav className="mt-5 space-y-1" aria-label="Mobile navigation links">
                  {links.map(({ href, label }) => {
                    const isActive = pathname === href;

                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between border-b border-primary/10 py-4 text-[13px] font-medium uppercase tracking-[0.14em] ${
                          isActive ? "text-primary" : "text-slate-700"
                        }`}
                      >
                        <span>{label}</span>
                        <FiArrowRight className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-primary/10 p-5">
                {!isAuthenticated ? (
                  <div className="grid gap-3">
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-primary/90"
                    >
                      Create your store
                      <FiArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 border border-primary px-4 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-primary"
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
                        className="inline-flex items-center justify-center bg-primary px-4 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-white"
                      >
                        Upgrade
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void handleLogout();
                        setMenuOpen(false);
                      }}
                      className="inline-flex items-center justify-center gap-2 border border-primary/20 px-4 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-slate-700"
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
