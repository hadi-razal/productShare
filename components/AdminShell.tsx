"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiLogOut,
  FiMail,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";
import { onAuthChange, signOutUser } from "@/lib/auth";
import { isSuperAdminEmail } from "@/lib/super-admin";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      if (!isSuperAdminEmail(user.email)) {
        router.replace("/store");
        return;
      }
      setEmail(user.email || "");
      setReady(true);
    });
    return () => unsub();
  }, [router]);

  const handleSignOut = async () => {
    await signOutUser();
    window.location.href = "/login";
  };

  const contactsActive = pathname.startsWith("/admin/contacts");
  const messagesActive = pathname.startsWith("/admin/messages");
  const storesActive =
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && !contactsActive && !messagesActive);
  const pageTitle = contactsActive
    ? "Contacts"
    : messagesActive
      ? "Store messages"
      : storesActive && pathname === "/admin"
        ? "Stores"
        : "Store details";

  if (!ready) {
    return (
      <div className="ds-root">
        <div className="ds-main">
          <main className="ds-content">
            <div className="ds-content-inner">
              <p className="text-sm text-gray-500">Checking admin access...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-root">
      <aside className="ds-sidebar" aria-label="Super admin navigation">
        <div className="ds-brand-block">
          <Link href="/admin" className="ds-store-identity" aria-label="Super admin">
            <span className="ds-avatar">SA</span>
            <div className="ds-store-identity-copy">
              <strong>Super Admin</strong>
              <span>All stores</span>
            </div>
          </Link>
        </div>

        <nav className="ds-nav">
          <Link href="/admin" className={`ds-nav-link ${storesActive ? "active" : ""}`} aria-current={storesActive ? "page" : undefined}>
            <span className="ds-nav-icon-wrap"><FiGrid className="w-[19px] h-[19px]" /></span>
            <span>Stores</span>
          </Link>
          <Link href="/admin/contacts" className={`ds-nav-link ${contactsActive ? "active" : ""}`} aria-current={contactsActive ? "page" : undefined}>
            <span className="ds-nav-icon-wrap"><FiMail className="w-[19px] h-[19px]" /></span>
            <span>Contacts</span>
          </Link>
          <Link href="/admin/messages" className={`ds-nav-link ${messagesActive ? "active" : ""}`} aria-current={messagesActive ? "page" : undefined}>
            <span className="ds-nav-icon-wrap"><FiMessageCircle className="w-[19px] h-[19px]" /></span>
            <span>Store messages</span>
          </Link>
        </nav>

        <div className="ds-sidebar-bottom">
          <button type="button" className="ds-sidebar-utility" onClick={handleSignOut}>
            <FiLogOut />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="ds-main">
        <header className="ds-topbar">
          <div className="ds-mobile-heading">
            <strong>{pageTitle}</strong>
            <span>{email || "Super admin"}</span>
          </div>
        </header>

        <main className="ds-content">
          <div className="ds-content-inner">{children}</div>
        </main>
      </div>

      <nav className="ds-bottombar" aria-label="Admin navigation">
        <Link href="/admin" className={`ds-tab ${storesActive ? "active" : ""}`}>
          <FiShield className="ds-tab-icon" />
          <span className="ds-tab-label">Admin</span>
        </Link>
        <Link href="/admin/contacts" className={`ds-tab ${contactsActive ? "active" : ""}`}>
          <FiMail className="ds-tab-icon" />
          <span className="ds-tab-label">Contacts</span>
        </Link>
        <Link href="/admin/messages" className={`ds-tab ${messagesActive ? "active" : ""}`}>
          <FiMessageCircle className="ds-tab-icon" />
          <span className="ds-tab-label">Messages</span>
        </Link>
      </nav>
    </div>
  );
}
