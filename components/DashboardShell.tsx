"use client";

import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiStar,
  FiTag,
} from "react-icons/fi";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUsername } from "@/helpers/getUsername";

const navigation: {
  name: string;
  shortName: string;
  href: string;
  icon: IconType;
  exact?: boolean;
}[] = [
  { name: "Home", shortName: "Home", href: "/store", icon: FiHome, exact: true },
  { name: "Products", shortName: "Products", href: "/store/add-product", icon: FiTag },
  { name: "Reviews", shortName: "Reviews", href: "/store/reviews", icon: FiStar },
  { name: "Store settings", shortName: "Settings", href: "/store/settings", icon: FiSettings },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/store/add-product": {
    title: "Add a product",
    subtitle: "Create a polished listing for your storefront.",
  },
  "/store/reviews": {
    title: "Customer reviews",
    subtitle: "See feedback and understand what customers value.",
  },
  "/store/settings": {
    title: "Store settings",
    subtitle: "Manage your identity, contact details, and storefront style.",
  },
};

const getPageMeta = (pathname: string) => {
  const match = Object.entries(pageMeta).find(([path]) => pathname.startsWith(path));
  return match?.[1] ?? { title: "Dashboard", subtitle: "Your store at a glance." };
};

const formatStoreName = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [storeName, setStoreName] = useState("My Store");
  const [dateLabel, setDateLabel] = useState("Today");
  const [greeting, setGreeting] = useState("Welcome back");
  const accountRef = useRef<HTMLDivElement>(null);
  const mobileAccountRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setDateLabel(
      new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    const localPreview =
      window.location.hostname === "localhost" &&
      new URLSearchParams(window.location.search).get("preview") === "dashboard";
    if (localPreview) {
      setStoreName("Nira Home");
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const username = await getUsername(user.uid);
      const fallback = user.displayName || user.email?.split("@")[0];
      setStoreName(formatStoreName(username || fallback || "My Store"));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setAccountOpen(false);
    setMobileAccountOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeAccountMenus = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
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
    await signOut(auth);
    window.location.href = "/login";
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("dashboard-search") as HTMLInputElement;
    if (input.value.trim()) window.location.href = "/store/add-product";
  };

  const { title: pageTitle, subtitle: pageSubtitle } = getPageMeta(pathname);
  const isHome = pathname === "/store";

  const navItems = () =>
    navigation.map((item) => {
      const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
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
    <div className="ds-root">
      <aside className="ds-sidebar" aria-label="Dashboard navigation">
        <div className="ds-brand-block">
          <Link href="/store" className="ds-brand-link" aria-label="ProductShare dashboard">
            <span className="ds-brand-icon"><FiTag /></span>
            <span className="ds-brand-wordmark">ProductShare</span>
          </Link>
          <div className="ds-store-identity">
            <span className="ds-avatar">{initials || "PS"}</span>
            <div className="ds-store-identity-copy">
              <strong>{storeName}</strong>
              <span><i /> Live</span>
            </div>
          </div>
        </div>

        <nav className="ds-nav">{navItems()}</nav>

        <div className="ds-sidebar-bottom">
          <Link href="/pricing" className="ds-sidebar-utility">
            <FiCreditCard />
            <span>Plan</span>
          </Link>
          <Link href="/contact" className="ds-sidebar-utility">
            <FiHelpCircle />
            <span>Help & support</span>
          </Link>
          <div className="ds-account" ref={accountRef}>
            {accountOpen && (
              <div className="ds-account-menu">
                <Link href="/store/settings"><FiSettings /> Account settings</Link>
                <button type="button" onClick={handleSignOut}><FiLogOut /> Sign out</button>
              </div>
            )}
            <button
              type="button"
              className="ds-account-trigger"
              onClick={() => setAccountOpen((open) => !open)}
              aria-expanded={accountOpen}
            >
              <span className="ds-avatar ds-avatar-small">{initials || "PS"}</span>
              <span className="ds-account-name">{storeName}</span>
              <FiChevronDown className={accountOpen ? "rotate-180" : ""} />
            </button>
          </div>
        </div>
      </aside>

      <div className="ds-main">
        <header className="ds-desktop-topbar">
          <div className="ds-topbar-heading">
            <h1>{isHome ? `${greeting}, ${storeName.split(" ")[0]}` : pageTitle}</h1>
            <p>{isHome ? dateLabel : pageSubtitle}</p>
          </div>
          <div className="ds-topbar-actions">
            <form className="ds-search" role="search" onSubmit={handleSearch}>
              <FiSearch />
              <input name="dashboard-search" aria-label="Search products" placeholder="Search products..." />
            </form>
            <div className="ds-notification-wrap">
              <button
                type="button"
                className="ds-icon-button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <FiBell />
                <span className="ds-notification-dot" />
              </button>
              {notificationsOpen && (
                <div className="ds-notification-popover">
                  <span className="ds-popover-icon"><FiCheckCircle /></span>
                  <div><strong>You’re all caught up</strong><p>New store activity will appear here.</p></div>
                </div>
              )}
            </div>
            <Link href="/store/add-product" className="ds-primary-action">
              <FiPlus /> Add product
            </Link>
          </div>
        </header>

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
                  <span><i /> Store is live</span>
                </div>
                <Link href="/pricing" onClick={() => setMobileAccountOpen(false)}>
                  <FiCreditCard /> Plan
                </Link>
                <Link href="/contact" onClick={() => setMobileAccountOpen(false)}>
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
          <Link href="/store/add-product" className="ds-mobile-add" aria-label="Add product"><FiPlus /></Link>
        </header>

        <main className="ds-content">
          <div className="ds-content-inner">{children}</div>
        </main>
      </div>

      <nav className="ds-bottombar" aria-label="Quick navigation">
        {navigation.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
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
