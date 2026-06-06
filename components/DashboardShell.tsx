"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusSquare,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  Store,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getUsername } from "@/helpers/getUsername";

const navigation = [
  { name: "Dashboard", href: "/store", icon: LayoutDashboard, exact: true },
  { name: "Add Product", href: "/store/add-product", icon: PlusSquare },
  { name: "Reviews", href: "/store/reviews", icon: MessageSquare },
  { name: "Settings", href: "/store/settings", icon: Settings },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/store": { title: "Dashboard", subtitle: "Overview of your store performance" },
  "/store/add-product": { title: "Add Product", subtitle: "Create a new listing for your catalog" },
  "/store/reviews": { title: "Reviews", subtitle: "See what customers are saying" },
  "/store/settings": { title: "Settings", subtitle: "Manage your store profile and branding" },
};

const getPageMeta = (pathname: string) => {
  if (pageMeta[pathname]) return pageMeta[pathname];
  const match = Object.entries(pageMeta).find(
    ([path]) => path !== "/store" && pathname.startsWith(path)
  );
  return match?.[1] ?? { title: "Dashboard", subtitle: "Manage your store" };
};

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [storeName, setStoreName] = useState<string>("My Store");
  const pathname = usePathname();

  // Fetch the store name
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const name = await getUsername(user.uid);
        if (name) setStoreName(name);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const { title: pageTitle, subtitle: pageSubtitle } = getPageMeta(pathname);
  const showDesktopHeader = pathname !== "/store";

  return (
    <>
      <div className="ds-root">
        {/* ── DESKTOP SIDEBAR ── */}
        <aside className={`ds-sidebar ${collapsed ? "ds-collapsed" : ""}`}>
          {/* Brand */}
          <div className="ds-brand">
            <Link href="/" className="ds-brand-link">
              <div className="ds-brand-icon">
                <Store className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div className="ds-brand-text">
                  <span className="ds-brand-name">{storeName}</span>
                  <span className="ds-brand-tag">Store dashboard</span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="ds-collapse-btn"
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="ds-nav">
            {!collapsed && (
              <span className="ds-nav-section">Main Menu</span>
            )}
            {navigation.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`ds-nav-link ${isActive ? "active" : ""}`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className="ds-nav-icon-wrap">
                    <item.icon className="w-[18px] h-[18px]" />
                  </span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="ds-sidebar-bottom">
            {!collapsed && (
              <div className="ds-upgrade-card">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <div>
                  <p className="ds-upgrade-title">Go Premium</p>
                  <p className="ds-upgrade-sub">Unlock advanced analytics</p>
                </div>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="ds-nav-link ds-signout-btn"
              title={collapsed ? "Sign Out" : undefined}
            >
              <span className="ds-nav-icon-wrap">
                <LogOut className="w-[18px] h-[18px]" />
              </span>
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* ── MAIN AREA ── */}
        <div className="ds-main">
          <header className="ds-topbar">
            <button
              onClick={() => setSidebarOpen(true)}
              className="ds-hamburger"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/store" className="ds-mobile-brand">
              <div className="ds-brand-icon ds-brand-icon-sm">
                <Store className="w-4 h-4" />
              </div>
              <span className="ds-brand-name-sm">{pageTitle}</span>
            </Link>
          </header>

          {showDesktopHeader && (
            <div className="ds-desktop-header">
              <div>
                <h1 className="ds-page-title">{pageTitle}</h1>
                <p className="ds-page-subtitle">{pageSubtitle}</p>
              </div>
            </div>
          )}

          <main className="ds-content">
            <div className="ds-content-inner">{children}</div>
          </main>
        </div>

        {/* ── MOBILE OVERLAY ── */}
        <div
          className={`ds-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── MOBILE DRAWER ── */}
        <div className={`ds-drawer ${sidebarOpen ? "open" : ""}`}>
          <div className="ds-drawer-head">
            <Link
              href="/"
              className="ds-brand-link"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="ds-brand-icon">
                <Store className="w-5 h-5" />
              </div>
              <div className="ds-brand-text">
                <span className="ds-brand-name">{storeName}</span>
                <span className="ds-brand-tag">Store dashboard</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ds-drawer-close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="ds-drawer-nav">
            {navigation.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`ds-drawer-link ${isActive ? "active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span
                    className={`ds-drawer-icon ${isActive ? "active" : ""}`}
                  >
                    <item.icon className="w-5 h-5" />
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ds-drawer-foot">
            <button
              onClick={() => {
                handleSignOut();
                setSidebarOpen(false);
              }}
              className="ds-drawer-signout"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* ── MOBILE BOTTOM BAR ── */}
        <nav className="ds-bottombar">
          {navigation.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`ds-tab ${isActive ? "active" : ""}`}
              >
                <item.icon className="ds-tab-icon" />
                <span className="ds-tab-label">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
