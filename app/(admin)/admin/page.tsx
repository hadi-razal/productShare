"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiCreditCard,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiPackage,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  deleteStore,
  listProductCountsByStore,
  listStores,
  updateStore,
  type StoreRecord,
} from "@/lib/db";
import { isLocalHost, storefrontInternalPath, storefrontPublicUrl } from "@/lib/storefront-url";
import { isStorePlanExpired, planStatusLabel, storePlanStatus } from "@/lib/subscription";
import { relativeTime } from "@/components/dashboard/StoreBehaviour";

type StatusFilter = "all" | "premium" | "free" | "expired" | "offline";
type SortOrder = "newest" | "oldest" | "active" | "name";

const timeOf = (value?: string | null) => {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? null : time;
};

const createdTime = (store: StoreRecord) => timeOf(store.createdAt);

const createdLabel = (store: StoreRecord) => {
  const time = createdTime(store);
  return time === null
    ? "—"
    : new Date(time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const storeHref = (username: string) => {
  if (!username) return "";
  if (typeof window !== "undefined" && isLocalHost(window.location.host)) {
    return storefrontInternalPath(username);
  }
  return storefrontPublicUrl(username);
};

export default function SuperAdminPage() {
  const router = useRouter();
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<StoreRecord | null>(null);
  const [confirmPlan, setConfirmPlan] = useState<StoreRecord | null>(null);
  const [openHref, setOpenHref] = useState<Record<string, string>>({});

  const load = async () => {
    const [storeRows, counts] = await Promise.all([
      listStores(),
      listProductCountsByStore(),
    ]);
    const sorted = [...storeRows].sort((a, b) =>
      String(a.name || a.username || "").localeCompare(String(b.name || b.username || "")),
    );
    setStores(sorted);
    setProductCounts(counts);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await load();
      } catch (error) {
        console.error(error);
        toast.error("Could not load stores.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const store of stores) {
      if (store.username) next[store.id] = storeHref(store.username);
    }
    setOpenHref(next);
  }, [stores]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = stores.filter((store) => {
      if (statusFilter === "premium" && !store.isPremiumUser) return false;
      if (statusFilter === "free" && store.isPremiumUser) return false;
      if (statusFilter === "expired" && !isStorePlanExpired(store)) return false;
      if (statusFilter === "offline" && !store.isOffline) return false;
      if (!term) return true;
      const haystack = [
        store.name,
        store.username,
        store.email,
        store.whatsappNumber,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
    // `stores` is already sorted by name; stores without a created date go last.
    if (sortOrder === "name") return matches;
    const sortTime = (store: StoreRecord) =>
      sortOrder === "active" ? timeOf(store.lastActiveAt) : createdTime(store);
    return [...matches].sort((a, b) => {
      const aTime = sortTime(a);
      const bTime = sortTime(b);
      if (aTime === null || bTime === null) return aTime === bTime ? 0 : aTime === null ? 1 : -1;
      return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
    });
  }, [search, sortOrder, statusFilter, stores]);

  const stats = useMemo(() => {
    const premium = stores.filter((store) => store.isPremiumUser).length;
    const offline = stores.filter((store) => store.isOffline).length;
    const products = Object.values(productCounts).reduce((sum, count) => sum + count, 0);
    return { stores: stores.length, premium, offline, products };
  }, [productCounts, stores]);

  const toggleOffline = async (store: StoreRecord) => {
    setBusyId(store.id);
    try {
      await updateStore(store.id, { isOffline: !store.isOffline });
      setStores((current) =>
        current.map((item) =>
          item.id === store.id ? { ...item, isOffline: !store.isOffline } : item,
        ),
      );
      toast.success(store.isOffline ? "Store is live." : "Store is offline.");
    } catch (error) {
      console.error(error);
      toast.error("Could not update store visibility.");
    } finally {
      setBusyId(null);
    }
  };

  const applyPlanChange = async () => {
    if (!confirmPlan) return;
    const store = confirmPlan;
    const nextPremium = !store.isPremiumUser;
    setBusyId(store.id);
    try {
      await updateStore(store.id, { isPremiumUser: nextPremium, premiumUser: nextPremium });
      setStores((current) =>
        current.map((item) =>
          item.id === store.id
            ? { ...item, isPremiumUser: nextPremium, premiumUser: nextPremium }
            : item,
        ),
      );
      setConfirmPlan(null);
      toast.success(
        nextPremium
          ? `${store.name || store.username || "Store"} is now Premium.`
          : `${store.name || store.username || "Store"} is now on the Free plan.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Could not update plan.");
    } finally {
      setBusyId(null);
    }
  };

  const removeStore = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    try {
      await deleteStore(confirmDelete.id);
      setStores((current) => current.filter((item) => item.id !== confirmDelete.id));
      setConfirmDelete(null);
      toast.success("Store deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete store.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="ds-page ds-catalog">
      <section className="ds-metrics-band ds-admin-metrics" aria-label="Platform metrics">
        {[
          { label: "Stores", value: stats.stores, icon: FiUsers, tone: "violet" },
          { label: "Premium", value: stats.premium, icon: FiShield, tone: "teal" },
          { label: "Offline", value: stats.offline, icon: FiEyeOff, tone: "amber" },
          { label: "Products", value: stats.products, icon: FiPackage, tone: "violet" },
        ].map((metric) => (
          <div className="ds-metric" key={metric.label}>
            <span className={`ds-metric-icon ${metric.tone}`}><metric.icon /></span>
            <strong>{loading ? "—" : (metric.value || 0).toLocaleString("en-IN")}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <div className="ds-catalog-header">
        <div className="ds-catalog-heading">
          <h2 className="ds-catalog-title">All stores</h2>
          <p>
            {loading
              ? "Loading every registered store."
              : `${filtered.length} ${filtered.length === 1 ? "store" : "stores"} shown.`}
          </p>
        </div>
      </div>

      <section className="ds-catalog-card">
        <div className="ds-catalog-toolbar">
          <div className="ds-catalog-search">
            <FiSearch />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, username, email, WhatsApp"
              aria-label="Search stores"
            />
            {search && (
              <button
                type="button"
                className="ds-catalog-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>
          <label className="ds-catalog-view">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              aria-label="Filter stores"
            >
              <option value="all">All stores</option>
              <option value="premium">Premium</option>
              <option value="free">Free / trial</option>
              <option value="expired">Trial ended</option>
              <option value="offline">Offline</option>
            </select>
          </label>
          <label className="ds-catalog-view">
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              aria-label="Sort stores"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="active">Recently active</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </label>
        </div>

        <div className="ds-catalog-table-wrap">
          <div className="ds-admin-table ds-store-list">
            <div className="ds-admin-head">
              <span>Store</span>
              <span>Contact</span>
              <span>Catalogue</span>
              <span>Created</span>
              <span>Last active</span>
              <span>Plan &amp; status</span>
              <span className="ds-store-list-actions-head">Actions</span>
            </div>
            {loading ? (
              [0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="ds-admin-row ds-catalog-skeleton">
                  <span /><span /><span /><span /><span /><span /><span />
                </div>
              ))
            ) : filtered.length ? (
              filtered.map((store) => {
                const count = productCounts[store.id] || 0;
                const views = Number(store.visitCount || 0);
                const href = openHref[store.id];
                const logo = store.logoImage || store.image;
                const plan = storePlanStatus(store);
                const storeLabel = store.name || store.username || "store";
                return (
                  <div key={store.id} className="ds-admin-row">
                    <button
                      type="button"
                      className="ds-catalog-product ds-store-cell"
                      onClick={() => router.push(`/admin/${store.id}`)}
                    >
                      {logo ? (
                        <Image src={logo} alt="" width={40} height={40} sizes="40px" unoptimized />
                      ) : (
                        <span className="ds-store-initial" aria-hidden="true">
                          {(store.name || store.username || "S").trim().charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span>
                        <strong>{store.name || "Untitled store"}</strong>
                        <small>@{store.username || "no-username"}</small>
                      </span>
                    </button>
                    <span className="ds-admin-contact">
                      <span title={store.email}>{store.email || "—"}</span>
                      {store.whatsappNumber ? <small>+{store.whatsappNumber}</small> : null}
                    </span>
                    <span className="ds-store-stats">
                      <span><b>{count}</b> {count === 1 ? "product" : "products"}</span>
                      <span><b>{views.toLocaleString("en-IN")}</b> {views === 1 ? "view" : "views"}</span>
                    </span>
                    <span
                      className="ds-store-date"
                      title={store.createdAt ? new Date(store.createdAt).toLocaleString("en-IN") : undefined}
                    >
                      {createdLabel(store)}
                    </span>
                    <span
                      className={`ds-store-date ${store.lastActiveAt ? "" : "is-muted"}`}
                      title={store.lastActiveAt ? new Date(store.lastActiveAt).toLocaleString("en-IN") : undefined}
                    >
                      {relativeTime(store.lastActiveAt)}
                    </span>
                    <span className="ds-store-badges">
                      <i className={`ds-plan-pill is-${plan.state}`}>{planStatusLabel(plan)}</i>
                      <i className={`ds-plan-pill ${store.isOffline ? "is-offline" : "is-live"}`}>
                        {store.isOffline ? "Offline" : "Live"}
                      </i>
                    </span>
                    <span className="ds-admin-actions ds-store-actions">
                      <Link href={`/admin/${store.id}`} className="ds-catalog-btn">
                        Manage
                      </Link>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="ds-admin-icon"
                          aria-label={`Open ${storeLabel} catalogue`}
                          title="Open catalogue"
                        >
                          <FiExternalLink />
                        </a>
                      ) : null}
                      <button
                        type="button"
                        className="ds-admin-icon"
                        onClick={() => void toggleOffline(store)}
                        disabled={busyId === store.id}
                        aria-label={store.isOffline ? `Set ${storeLabel} live` : `Set ${storeLabel} offline`}
                        title={store.isOffline ? "Set live" : "Set offline"}
                      >
                        {store.isOffline ? <FiEye /> : <FiEyeOff />}
                      </button>
                      <button
                        type="button"
                        className="ds-admin-icon"
                        onClick={() => setConfirmPlan(store)}
                        disabled={busyId === store.id}
                        aria-label={`Change plan for ${storeLabel}`}
                        title="Change plan"
                      >
                        <FiCreditCard />
                      </button>
                      <button
                        type="button"
                        className="ds-admin-icon is-danger"
                        onClick={() => setConfirmDelete(store)}
                        aria-label={`Delete ${storeLabel}`}
                        title="Delete store"
                      >
                        <FiTrash2 />
                      </button>
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="ds-catalog-empty">
                <strong>No stores found</strong>
                <p>Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {confirmPlan && (
        <div className="ds-catalog-modal" onClick={() => busyId !== confirmPlan.id && setConfirmPlan(null)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>
              Switch {confirmPlan.name || confirmPlan.username || "this store"} to{" "}
              {confirmPlan.isPremiumUser ? "Free" : "Premium"}?
            </strong>
            <p>
              This store is currently on the{" "}
              <b>{confirmPlan.isPremiumUser ? "Premium" : "Free"}</b> plan.
              {confirmPlan.isPremiumUser
                ? " Switching to Free removes premium product and theme limits."
                : " Switching to Premium unlocks the paid product and theme limits."}
            </p>
            <div>
              <button
                type="button"
                className="ds-catalog-btn"
                onClick={() => setConfirmPlan(null)}
                disabled={busyId === confirmPlan.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className={confirmPlan.isPremiumUser ? "ds-catalog-btn-danger" : "ds-catalog-btn-primary"}
                onClick={() => void applyPlanChange()}
                disabled={busyId === confirmPlan.id}
              >
                {busyId === confirmPlan.id
                  ? "Updating..."
                  : confirmPlan.isPremiumUser
                    ? "Switch to Free"
                    : "Switch to Premium"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="ds-catalog-modal" onClick={() => busyId !== confirmDelete.id && setConfirmDelete(null)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>Delete {confirmDelete.name || confirmDelete.username || "this store"}?</strong>
            <p>This removes the store, all products, and uploaded images. This cannot be undone.</p>
            <div>
              <button
                type="button"
                className="ds-catalog-btn"
                onClick={() => setConfirmDelete(null)}
                disabled={busyId === confirmDelete.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ds-catalog-btn-danger"
                onClick={() => void removeStore()}
                disabled={busyId === confirmDelete.id}
              >
                {busyId === confirmDelete.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
