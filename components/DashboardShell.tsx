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
              {!collapsed && <span className="ds-brand-name">{storeName}</span>}
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
          {/* Top bar */}
          <header className="ds-topbar">
            <button
              onClick={() => setSidebarOpen(true)}
              className="ds-hamburger"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="ds-mobile-brand">
              <div className="ds-brand-icon ds-brand-icon-sm">
                <Store className="w-4 h-4" />
              </div>
              <span className="ds-brand-name-sm">{storeName}</span>
            </Link>
          </header>

          {/* Content */}
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
              <span className="ds-brand-name">{storeName}</span>
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

      {/* ═══ STYLES ═══ */}
      <style jsx global>{`
        /* ── Reset for dashboard ── */
        .ds-root {
          display: flex;
          min-height: 100vh;
          background: #f0f2f5;
          font-family: var(--font-poppins), "Inter", system-ui, sans-serif;
          isolation: isolate;
        }

        /* ══════════════════════════════════
           DESKTOP SIDEBAR
           ══════════════════════════════════ */
        .ds-sidebar {
          display: none;
          flex-direction: column;
          width: 250px;
          background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
          color: #cbd5e1;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 20;
          flex-shrink: 0;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .ds-sidebar.ds-collapsed {
          width: 72px;
        }
        @media (min-width: 768px) {
          .ds-sidebar {
            display: flex;
          }
        }

        /* Brand */
        .ds-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 16px 18px;
        }
        .ds-brand-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #fff;
        }
        .ds-brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }
        .ds-brand-icon-sm {
          width: 32px;
          height: 32px;
          border-radius: 9px;
        }
        .ds-brand-name {
          font-weight: 700;
          font-size: 16px;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .ds-collapse-btn {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ds-collapse-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        /* Nav */
        .ds-nav {
          flex: 1;
          padding: 8px 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ds-nav-section {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #64748b;
          padding: 8px 12px 6px;
          margin-bottom: 2px;
        }
        .ds-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          white-space: nowrap;
        }
        .ds-nav-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
        }
        .ds-nav-link.active {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          font-weight: 600;
        }
        .ds-nav-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .ds-nav-link.active .ds-nav-icon-wrap {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }

        /* Sidebar Bottom */
        .ds-sidebar-bottom {
          padding: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ds-upgrade-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.12));
          border: 1px solid rgba(99, 102, 241, 0.2);
          margin-bottom: 12px;
        }
        .ds-upgrade-title {
          font-size: 12px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .ds-upgrade-sub {
          font-size: 10.5px;
          color: #64748b;
          margin-top: 1px;
        }
        .ds-signout-btn:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #fca5a5 !important;
        }

        /* ══════════════════════════════════
           MAIN CONTENT
           ══════════════════════════════════ */
        .ds-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 100vh;
        }

        /* Top bar — mobile only */
        .ds-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: linear-gradient(180deg, #0f172a, #1e1b4b);
          position: sticky;
          top: 0;
          z-index: 15;
        }
        @media (min-width: 768px) {
          .ds-topbar {
            display: none;
          }
        }
        .ds-hamburger {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #cbd5e1;
          transition: all 0.2s;
        }
        .ds-hamburger:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .ds-mobile-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .ds-brand-name-sm {
          font-weight: 700;
          font-size: 15px;
          color: #fff;
        }

        /* Content */
        .ds-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 80px;
        }
        @media (min-width: 768px) {
          .ds-content {
            padding-bottom: 0;
          }
        }
        .ds-content-inner {
          padding: 20px 16px;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .ds-content-inner {
            padding: 28px 32px;
          }
        }

        /* ══════════════════════════════════
           MOBILE OVERLAY + DRAWER
           ══════════════════════════════════ */
        .ds-overlay {
          position: fixed;
          inset: 0;
          background: transparent;
          z-index: 40;
          pointer-events: none;
          transition: background 0.3s;
        }
        .ds-overlay.open {
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          pointer-events: auto;
        }
        @media (min-width: 768px) {
          .ds-overlay {
            display: none;
          }
        }

        .ds-drawer {
          position: fixed;
          inset-block: 0;
          left: 0;
          width: 290px;
          max-width: 85vw;
          background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 8px 0 32px rgba(0, 0, 0, 0.25);
        }
        .ds-drawer.open {
          transform: translateX(0);
        }
        @media (min-width: 768px) {
          .ds-drawer {
            display: none;
          }
        }

        .ds-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ds-drawer-head .ds-brand-link {
          color: #fff;
        }
        .ds-drawer-close {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ds-drawer-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .ds-drawer-nav {
          flex: 1;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }
        .ds-drawer-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 14px;
          border-radius: 12px;
          text-decoration: none;
          color: #94a3b8;
          font-size: 14.5px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .ds-drawer-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
        }
        .ds-drawer-link.active {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          font-weight: 600;
        }
        .ds-drawer-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #64748b;
          transition: all 0.2s;
        }
        .ds-drawer-icon.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
        }

        .ds-drawer-foot {
          padding: 14px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ds-drawer-signout {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ds-drawer-signout:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        /* ══════════════════════════════════
           BOTTOM TAB BAR (mobile)
           ══════════════════════════════════ */
        .ds-bottombar {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-top: 1px solid #e5e7eb;
          z-index: 30;
          padding: 4px 6px;
          padding-bottom: max(4px, env(safe-area-inset-bottom));
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04);
        }
        @media (min-width: 768px) {
          .ds-bottombar {
            display: none;
          }
        }
        .ds-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 4px 6px;
          border-radius: 10px;
          text-decoration: none;
          color: #9ca3af;
          transition: color 0.2s;
          position: relative;
        }
        .ds-tab.active {
          color: #6366f1;
        }
        .ds-tab.active::after {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 0 0 4px 4px;
        }
        .ds-tab-icon {
          width: 22px;
          height: 22px;
        }
        .ds-tab-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
      `}</style>
    </>
  );
}
