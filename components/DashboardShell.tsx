"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiCreditCard,
  FiGrid,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMessageCircle,
  FiPlus,
  FiSettings,
  FiShield,
  FiStar,
  FiTag,
} from "react-icons/fi";
import { getStoreById } from "@/lib/db";
import { getCurrentUser, onAuthChange, signOutUser } from "@/lib/auth";
import { isSuperAdminEmail } from "@/lib/super-admin";
import {
  isStoreProfileComplete,
  STORE_SETTINGS_PATH,
  storeProfileIncompleteMessage,
} from "@/lib/store-profile";
import {
  DASHBOARD_THEME_EVENT,
  DASHBOARD_THEME_STORAGE_KEY,
  dashboardThemeCssVars,
  normalizeStoreTheme,
  STORE_THEME_MAP,
  type StoreThemeId,
} from "@/lib/store-themes";

const navigation: {
  name: string;
  shortName: string;
  href: string;
  icon: IconType;
  exact?: boolean;
  aliases?: string[];
  hideFromTabs?: boolean;
}[] = [
  { name: "Home", shortName: "Home", href: "/store", icon: FiHome, exact: true },
  { name: "Products", shortName: "Products", href: "/store/products", icon: FiTag, aliases: ["/store/add-product", "/store/edit/"] },
  { name: "Categories", shortName: "Categories", href: "/store/categories", icon: FiGrid },
  { name: "Reviews", shortName: "Reviews", href: "/store/reviews", icon: FiStar },
  { name: "Message ProductShare", shortName: "Message", href: "/store/message", icon: FiMessageCircle, hideFromTabs: true },
  { name: "Store settings", shortName: "Settings", href: "/store/settings", icon: FiSettings },
];

const pageTitles: Record<string, string> = {
  "/store/add-product": "Add a product",
  "/store/edit": "Edit product",
  "/store/products": "Products",
  "/store/categories": "Categories",
  "/store/reviews": "Customer reviews",
  "/store/message": "Message ProductShare",
  "/store/settings": "Store settings",
};

const getPageTitle = (pathname: string) => {
  if (pathname === "/store/edit" || pathname.startsWith("/store/edit/")) return "Edit product";
  const match = Object.entries(pageTitles).find(([path]) => pathname.startsWith(path));
  return match?.[1] ?? "Dashboard";
};

const isNavActive = (
  item: (typeof navigation)[number],
  pathname: string,
) => {
  if (item.exact) return pathname === item.href;
  if (pathname.startsWith(item.href)) return true;
  return (item.aliases ?? []).some((alias) => pathname.startsWith(alias));
};

const formatStoreName = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [storeName, setStoreName] = useState("My Store");
  const [profileComplete, setProfileComplete] = useState(true);
  const [profileMessage, setProfileMessage] = useState("");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const [storeOffline, setStoreOffline] = useState(false);
  const [storeTheme, setStoreTheme] = useState<StoreThemeId>("minimal");
  const [isAdmin, setIsAdmin] = useState(false);
  const mobileAccountRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const localPreview =
      window.location.hostname === "localhost" &&
      new URLSearchParams(window.location.search).get("preview") === "dashboard";
    if (localPreview) {
      setStoreName("Nira Home");
      return;
    }

    const unsub = onAuthChange(async (user) => {
      if (!user) return;
      if (isSuperAdminEmail(user.email)) {
        setIsAdmin(true);
        router.replace("/admin");
        return;
      }
      setIsAdmin(false);
      const fallback = formatStoreName(user.displayName || user.email?.split("@")[0] || "My Store");
      try {
        const store = await getStoreById(user.uid);
        const name = String(store?.name || "").trim();
        const complete = isStoreProfileComplete(store);
        setStoreName(name || formatStoreName(store?.username || fallback));
        setStoreLogo(store?.logoImage || store?.image || null);
        setStoreOffline(Boolean(store?.isOffline));
        setProfileComplete(complete);
        setProfileMessage(complete ? "" : storeProfileIncompleteMessage(store));
        const themeId = normalizeStoreTheme(store?.storeTheme);
        setStoreTheme(themeId);
        try {
          localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, themeId);
        } catch {
          /* ignore */
        }
      } catch {
        setStoreName(fallback);
        setStoreLogo(null);
        setStoreOffline(false);
        setProfileComplete(false);
        setProfileMessage(storeProfileIncompleteMessage(null));
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY);
      if (cached) setStoreTheme(normalizeStoreTheme(cached));
    } catch {
      /* ignore */
    }

    const onTheme = (event: Event) => {
      setStoreTheme(normalizeStoreTheme((event as CustomEvent<string>).detail));
    };
    window.addEventListener(DASHBOARD_THEME_EVENT, onTheme);
    return () => window.removeEventListener(DASHBOARD_THEME_EVENT, onTheme);
  }, []);

  useEffect(() => {
    setMobileAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    const refreshVisibility = async () => {
      const user = await getCurrentUser();
      if (!user || cancelled) return;
      try {
        const store = await getStoreById(user.uid);
        if (cancelled) return;
        setStoreOffline(Boolean(store?.isOffline));
        const complete = isStoreProfileComplete(store);
        setProfileComplete(complete);
        setProfileMessage(complete ? "" : storeProfileIncompleteMessage(store));
        if (pathname !== "/store/settings") {
          setStoreTheme(normalizeStoreTheme(store?.storeTheme));
        }
      } catch {
        if (!cancelled) setStoreOffline(false);
      }
    };
    void refreshVisibility();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    const closeAccountMenus = (event: MouseEvent) => {
      if (mobileAccountRef.current && !mobileAccountRef.current.contains(event.target as Node)) {
        setMobileAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", closeAccountMenus);
    return () => document.removeEventListener("mousedown", closeAccountMenus);
  }, []);

  const initials = useMemo(
    () =>
      storeName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    [storeName],
  );

  const handleSignOut = async () => {
    await signOutUser();
    window.location.href = "/login";
  };

  const pageTitle = getPageTitle(pathname);
  const isHome = pathname === "/store";
  const isSettings = pathname === STORE_SETTINGS_PATH;
  const addProductHref = profileComplete ? "/store/add-product" : STORE_SETTINGS_PATH;
  const themeTokens = STORE_THEME_MAP[storeTheme];
  const themeVars = dashboardThemeCssVars(themeTokens);

  const navItems = () =>
    navigation.map((item) => {
      const active = isNavActive(item, pathname);
      return (
        <Link
          key={item.name}
          href={item.href}
          className={`ds-nav-link ${active ? "active" : ""}`}
          aria-current={active ? "page" : undefined}
        >
          <span className="ds-nav-icon-wrap">
            <item.icon className="w-[19px] h-[19px]" />
          </span>
          <span>{item.name}</span>
        </Link>
      );
    });

  return (
    <div
      className="ds-root"
      data-ds-theme={storeTheme}
      data-ds-theme-mode={themeTokens.dark ? "dark" : "light"}
      style={themeVars as React.CSSProperties}
    >
      <aside className="ds-sidebar" aria-label="Dashboard navigation">
        <div className="ds-brand-block">
          <Link href="/store" className="ds-store-identity" aria-label={`${storeName} dashboard`}>
            {storeLogo ? (
              <Image
                src={storeLogo}
                alt={`${storeName} logo`}
                width={44}
                height={44}
                unoptimized={storeLogo.startsWith("http")}
                className="ds-store-logo"
              />
            ) : (
              <span className="ds-avatar">{initials || "PS"}</span>
            )}
            <div className="ds-store-identity-copy">
              <strong>{storeName}</strong>
              <span className={storeOffline ? "is-offline" : ""}>
                <i /> {storeOffline ? "Offline" : "Live"}
              </span>
            </div>
          </Link>
        </div>

        <nav className="ds-nav">{navItems()}</nav>

        <div className="ds-sidebar-bottom">
          {isAdmin ? (
            <Link href="/admin" className="ds-sidebar-utility">
              <FiShield />
              <span>Super admin</span>
            </Link>
          ) : null}
          <Link href="/pricing" className="ds-sidebar-utility">
            <FiCreditCard />
            <span>Plan</span>
          </Link>
          <Link href="/store/message" className="ds-sidebar-utility">
            <FiHelpCircle />
            <span>Help & support</span>
          </Link>
          <Link href="/store/settings" className="ds-sidebar-utility">
            <FiSettings />
            <span>Settings</span>
          </Link>
          <button type="button" className="ds-sidebar-utility" onClick={handleSignOut}>
            <FiLogOut />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="ds-main">
        <header className="ds-topbar">
          <div className="ds-mobile-account" ref={mobileAccountRef}>
            <button
              type="button"
              className="ds-mobile-avatar-button"
              onClick={() => setMobileAccountOpen((open) => !open)}
              aria-label="Open account menu"
              aria-expanded={mobileAccountOpen}
            >
              <span className="ds-avatar ds-avatar-small">{initials || "PS"}</span>
            </button>
            {mobileAccountOpen && (
              <div className="ds-mobile-account-menu">
                <div className="ds-mobile-account-summary">
                  <strong>{storeName}</strong>
                  <span className={storeOffline ? "is-offline" : ""}>
                    <i /> {storeOffline ? "Store is offline" : "Store is live"}
                  </span>
                </div>
                <Link href="/store/settings" onClick={() => setMobileAccountOpen(false)}>
                  <FiSettings /> Settings
                </Link>
                {isAdmin ? (
                  <Link href="/admin" onClick={() => setMobileAccountOpen(false)}>
                    <FiShield /> Super admin
                  </Link>
                ) : null}
                <Link href="/pricing" onClick={() => setMobileAccountOpen(false)}>
                  <FiCreditCard /> Plan
                </Link>
                <Link href="/store/message" onClick={() => setMobileAccountOpen(false)}>
                  <FiHelpCircle /> Help &amp; support
                </Link>
                <button type="button" onClick={handleSignOut}><FiLogOut /> Sign out</button>
              </div>
            )}
          </div>
          <div className="ds-mobile-heading">
            <strong>{isHome ? "Home" : pageTitle}</strong>
            <span>{storeName}</span>
          </div>
          <Link href={addProductHref} className="ds-mobile-add" aria-label="Add product"><FiPlus /></Link>
        </header>

        <main className="ds-content">
          <div className="ds-content-inner">
            {!profileComplete && !isSettings && profileMessage ? (
              <div className="ds-profile-banner" role="status">
                <p>
                  <strong>Complete your store profile.</strong> {profileMessage}
                </p>
                <Link href={STORE_SETTINGS_PATH}>Open settings</Link>
              </div>
            ) : null}
            {children}
          </div>
        </main>
      </div>

      <nav className="ds-bottombar" aria-label="Quick navigation">
        {navigation.filter((item) => !item.hideFromTabs).map((item) => {
          const active = isNavActive(item, pathname);
          return (
            <Link key={item.name} href={item.href} className={`ds-tab ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
              <item.icon className="ds-tab-icon" />
              <span className="ds-tab-label">{item.shortName}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
