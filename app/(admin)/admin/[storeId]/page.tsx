"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiChevronLeft, FiExternalLink, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  deleteProduct,
  deleteStore,
  getStoreById,
  listProductsByStore,
  updateStore,
  type ProductRecord,
  type StoreRecord,
} from "@/lib/db";
import { isLocalHost, storefrontInternalPath, storefrontPublicUrl } from "@/lib/storefront-url";

const storeHref = (username: string) => {
  if (!username) return "";
  if (typeof window !== "undefined" && isLocalHost(window.location.host)) {
    return storefrontInternalPath(username);
  }
  return storefrontPublicUrl(username);
};

const priceLabel = (product: ProductRecord) => {
  const value = Number(product.discountPrice || product.regularPrice || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function AdminStorePage() {
  const router = useRouter();
  const { storeId } = useParams();
  const [store, setStore] = useState<StoreRecord | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirmStoreDelete, setConfirmStoreDelete] = useState(false);
  const [confirmPlan, setConfirmPlan] = useState(false);
  const [confirmProductId, setConfirmProductId] = useState<string | null>(null);

  const load = async (id: string) => {
    const [storeData, productRows] = await Promise.all([
      getStoreById(id),
      listProductsByStore(id),
    ]);
    if (!storeData) {
      toast.error("Store not found.");
      router.replace("/admin");
      return;
    }
    setStore(storeData);
    setProducts(productRows);
  };

  useEffect(() => {
    if (!storeId) return;
    const run = async () => {
      try {
        await load(storeId as string);
      } catch (error) {
        console.error(error);
        toast.error("Could not load store.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [storeId, router]);

  const toggleOffline = async () => {
    if (!store) return;
    setBusy(true);
    try {
      await updateStore(store.id, { isOffline: !store.isOffline });
      setStore({ ...store, isOffline: !store.isOffline });
      toast.success(store.isOffline ? "Store is live." : "Store is offline.");
    } catch (error) {
      console.error(error);
      toast.error("Could not update visibility.");
    } finally {
      setBusy(false);
    }
  };

  const applyPlanChange = async () => {
    if (!store) return;
    const nextPremium = !store.isPremiumUser;
    setBusy(true);
    try {
      await updateStore(store.id, {
        isPremiumUser: nextPremium,
        premiumUser: nextPremium,
      });
      setStore({
        ...store,
        isPremiumUser: nextPremium,
        premiumUser: nextPremium,
      });
      setConfirmPlan(false);
      toast.success(nextPremium ? "Store is now Premium." : "Store is now on the Free plan.");
    } catch (error) {
      console.error(error);
      toast.error("Could not update plan.");
    } finally {
      setBusy(false);
    }
  };

  const removeProduct = async () => {
    if (!store || !confirmProductId) return;
    setBusy(true);
    try {
      await deleteProduct(store.id, confirmProductId);
      setProducts((current) => current.filter((product) => product.id !== confirmProductId));
      setConfirmProductId(null);
      toast.success("Product deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete product.");
    } finally {
      setBusy(false);
    }
  };

  const removeStore = async () => {
    if (!store) return;
    setBusy(true);
    try {
      await deleteStore(store.id);
      toast.success("Store deleted.");
      router.replace("/admin");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete store.");
      setBusy(false);
    }
  };

  if (loading || !store) {
    return (
      <div className="ds-page">
        <p className="text-sm text-gray-500">Loading store...</p>
      </div>
    );
  }

  const href = storeHref(store.username);
  const logo = store.logoImage || store.image;

  return (
    <div className="ds-page ds-catalog">
      <div className="ds-catalog-header">
        <div className="ds-catalog-heading">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="ds-catalog-btn" aria-label="Back to stores">
              <FiChevronLeft />
            </Link>
            {logo ? (
              <Image src={logo} alt="" width={44} height={44} sizes="44px" unoptimized className="ds-store-logo" />
            ) : (
              <span className="ds-avatar">{(store.name || "S").slice(0, 1).toUpperCase()}</span>
            )}
            <div>
              <h2 className="ds-catalog-title">{store.name || "Untitled store"}</h2>
              <p>@{store.username || "no-username"} · {store.email || "No email"}</p>
            </div>
          </div>
        </div>
        <div className="ds-catalog-actions">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="ds-catalog-btn">
              <FiExternalLink /> Open store
            </a>
          ) : null}
          <button type="button" className="ds-catalog-btn" onClick={() => void toggleOffline()} disabled={busy}>
            {store.isOffline ? "Set live" : "Set offline"}
          </button>
          <button type="button" className="ds-catalog-btn-primary" onClick={() => setConfirmPlan(true)} disabled={busy}>
            {store.isPremiumUser ? "Switch to Free" : "Switch to Premium"}
          </button>
          <button type="button" className="ds-catalog-btn-danger" onClick={() => setConfirmStoreDelete(true)} disabled={busy}>
            <FiTrash2 /> Delete store
          </button>
        </div>
      </div>

      <section className="ds-catalog-card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="ds-admin-meta">
          <div><span>WhatsApp</span><strong>{store.whatsappNumber || "Not set"}</strong></div>
          <div><span>Plan</span><strong>{store.isPremiumUser ? "Premium" : "Free"}</strong></div>
          <div><span>Status</span><strong>{store.isOffline ? "Offline" : "Live"}</strong></div>
          <div><span>Store views</span><strong>{Number(store.visitCount || 0).toLocaleString("en-IN")}</strong></div>
          <div><span>Products</span><strong>{products.length}</strong></div>
          <div><span>Created</span><strong>{store.createdAt ? new Date(store.createdAt).toLocaleDateString("en-IN") : "—"}</strong></div>
        </div>
      </section>

      <section className="ds-catalog-card">
        <div className="ds-catalog-toolbar">
          <strong style={{ fontSize: 14 }}>Products</strong>
        </div>
        <div className="ds-catalog-table-wrap">
          <div className="ds-admin-products">
            <div className="ds-admin-products-head">
              <span>Product</span>
              <span>Price</span>
              <span>Views</span>
              <span>Status</span>
              <span></span>
            </div>
            {products.length ? (
              products.map((product) => (
                <div key={product.id} className="ds-admin-products-row">
                  <span className="ds-catalog-product">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt="" width={40} height={40} sizes="40px" unoptimized />
                    ) : (
                      <span className="ds-catalog-thumb" />
                    )}
                    <strong>{product.name || "Untitled product"}</strong>
                  </span>
                  <span>{priceLabel(product)}</span>
                  <span>{Number(product.views || 0).toLocaleString("en-IN")}</span>
                  <span>
                    <i className={`ds-status-pill ${product.isHidden ? "hidden" : "active"}`}>
                      {product.isHidden ? "Hidden" : product.isInStock === false ? "Out of stock" : "Active"}
                    </i>
                  </span>
                  <span>
                    <button
                      type="button"
                      className="ds-admin-icon is-danger"
                      onClick={() => setConfirmProductId(product.id)}
                      aria-label={`Delete ${product.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </span>
                </div>
              ))
            ) : (
              <div className="ds-catalog-empty">
                <strong>No products</strong>
                <p>This store has not added any listings yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {confirmPlan && (
        <div className="ds-catalog-modal" onClick={() => !busy && setConfirmPlan(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>
              Switch {store.name || store.username || "this store"} to{" "}
              {store.isPremiumUser ? "Free" : "Premium"}?
            </strong>
            <p>
              This store is currently on the <b>{store.isPremiumUser ? "Premium" : "Free"}</b> plan.
              {store.isPremiumUser
                ? " Switching to Free removes premium product and theme limits."
                : " Switching to Premium unlocks the paid product and theme limits."}
            </p>
            <div>
              <button type="button" className="ds-catalog-btn" onClick={() => setConfirmPlan(false)} disabled={busy}>
                Cancel
              </button>
              <button
                type="button"
                className={store.isPremiumUser ? "ds-catalog-btn-danger" : "ds-catalog-btn-primary"}
                onClick={() => void applyPlanChange()}
                disabled={busy}
              >
                {busy
                  ? "Updating..."
                  : store.isPremiumUser
                    ? "Switch to Free"
                    : "Switch to Premium"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmStoreDelete && (
        <div className="ds-catalog-modal" onClick={() => !busy && setConfirmStoreDelete(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>Delete this store?</strong>
            <p>All products and images for {store.name || store.username} will be removed.</p>
            <div>
              <button type="button" className="ds-catalog-btn" onClick={() => setConfirmStoreDelete(false)} disabled={busy}>
                Cancel
              </button>
              <button type="button" className="ds-catalog-btn-danger" onClick={() => void removeStore()} disabled={busy}>
                {busy ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmProductId && (
        <div className="ds-catalog-modal" onClick={() => !busy && setConfirmProductId(null)}>
          <div onClick={(event) => event.stopPropagation()}>
            <strong>Delete this product?</strong>
            <p>The listing and its images will be removed from this store.</p>
            <div>
              <button type="button" className="ds-catalog-btn" onClick={() => setConfirmProductId(null)} disabled={busy}>
                Cancel
              </button>
              <button type="button" className="ds-catalog-btn-danger" onClick={() => void removeProduct()} disabled={busy}>
                {busy ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
