"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { ErrorState } from "@/components/dashboard/WorkspaceUI";
import ManagementProductCard from "@/components/dashboard/ManagementProductCard";
import WorkspaceDialog from "@/components/dashboard/WorkspaceDialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthChange } from "@/lib/auth";
import {
  FiChevronDown,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { deleteProduct, getStoreById, listProductsByStore } from "@/lib/db";
import { logStoreActivity } from "@/lib/activity";
import type { ProductType } from "@/type";
import { categoryLabel } from "@/lib/product-categories";
import { isStoreProfileComplete, STORE_SETTINGS_PATH } from "@/lib/store-profile";

type CatalogProduct = Partial<ProductType> & { id: string };
type StatusFilter = "all" | "active" | "hidden" | "out";

const stockCount = (product: CatalogProduct) => {
  const parsed = Number(product.availableStock);
  return Number.isFinite(parsed) ? parsed : null;
};

const priceLabel = (product: CatalogProduct) => {
  const value = Number(product.discountPrice || product.regularPrice || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const csvCell = (value: string | number) =>
  `"${String(value).replace(/"/g, '""')}"`;

export default function ProductsPage() {
  const router = useRouter();
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] = useState("default");
  const [loadError, setLoadError] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [profileComplete, setProfileComplete] = useState(true);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async (uid: string) => {
    setLoadError(false);
    const [productsData, store] = await Promise.all([
      listProductsByStore(uid),
      getStoreById(uid),
    ]);
    setUsername(String(store?.username || ""));
    setProfileComplete(isStoreProfileComplete(store));
    setProducts(productsData);
  };

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.uid);
      try {
        await fetchProducts(user.uid);
      } catch (error) {
        setLoadError(true);
        console.error(error);
        toast.error("Could not load products.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("category");
    if (fromQuery) setCategoryFilter(fromQuery);
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(
      products
        .map((product) => String(product.category || "").trim())
        .filter(Boolean),
    );
    if (categoryFilter !== "all") unique.add(categoryFilter);
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [categoryFilter, products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = products.filter((product) => {
      const hidden = Boolean(product.isHidden);
      const outOfStock = product.isInStock === false;
      const category = String(product.category || "").trim();
      if (statusFilter === "active" && hidden) return false;
      if (statusFilter === "hidden" && !hidden) return false;
      if (statusFilter === "out" && !outOfStock) return false;
      if (categoryFilter !== "all" && category !== categoryFilter) return false;
      if (!term) return true;
      return (
        (product.name || "").toLowerCase().includes(term) ||
        category.toLowerCase().includes(term) ||
        (product.tags || "").toLowerCase().includes(term)
      );
    });
    return sort === "name" ? matches.sort((a, b) => (a.name || "").localeCompare(b.name || "")) : sort === "views" ? matches.sort((a, b) => Number(b.views || 0) - Number(a.views || 0)) : sort === "price" ? matches.sort((a, b) => Number(a.discountPrice || a.regularPrice || 0) - Number(b.discountPrice || b.regularPrice || 0)) : matches;
  }, [categoryFilter, products, search, statusFilter, sort]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((product) => selected.includes(product.id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelected((current) => current.filter((id) => !filtered.some((product) => product.id === id)));
      return;
    }
    setSelected((current) => Array.from(new Set([...current, ...filtered.map((product) => product.id)])));
  };

  const toggleOne = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "Status", "Inventory", "Price", "Views"].map(csvCell).join(","),
      ...filtered.map((product) => {
        const count = stockCount(product);
        const inventory =
          product.isInStock === false
            ? "0 in stock"
            : count === null
              ? "In stock"
              : `${count} in stock`;
        return [
          product.name || "Untitled product",
          product.isHidden ? "Hidden" : "Active",
          inventory,
          priceLabel(product),
          Number(product.views || 0),
        ]
          .map(csvCell)
          .join(",");
      }),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    link.click();
    URL.revokeObjectURL(url);
    setMoreOpen(false);
  };

  const deleteSelected = async () => {
    if (!userId || selected.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(
        selected.map((id) => deleteProduct(userId, id)),
      );
      void logStoreActivity(userId, "product_deleted", { count: selected.length });
      setProducts((current) => current.filter((product) => !selected.includes(product.id)));
      setSelected([]);
      setConfirmDelete(false);
      toast.success("Selected products deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete products.");
    } finally {
      setDeleting(false);
      setMoreOpen(false);
    }
  };

  const addProductHref = profileComplete ? "/store/add-product" : STORE_SETTINGS_PATH;

  return (
    <div className="ds-page ds-catalog">
      <div className="ds-catalog-header">
        <div className="ds-catalog-heading">
          <h1 className="ds-catalog-title">Products</h1>
          <p>
            {loading
              ? "Manage your catalog, stock, and listings."
              : `${products.length} ${products.length === 1 ? "product" : "products"} in your catalog.`}
          </p>
        </div>
        <div className="ds-catalog-actions">
          <button type="button" className="ds-catalog-btn" onClick={exportCsv}>
            Export
          </button>
          <div className="ds-catalog-more" ref={moreRef}>
            <button
              type="button"
              className="ds-catalog-btn"
              onClick={() => setMoreOpen((open) => !open)}
              aria-expanded={moreOpen}
            >
              More actions <FiChevronDown />
            </button>
            {moreOpen && (
              <div className="ds-catalog-menu">
                <button type="button" onClick={exportCsv}>
                  Export CSV
                </button>
                <button
                  type="button"
                  disabled={selected.length === 0}
                  onClick={() => {
                    setMoreOpen(false);
                    setConfirmDelete(true);
                  }}
                >
                  Delete selected
                </button>
              </div>
            )}
          </div>
          <Link href={addProductHref} className="ds-catalog-btn-primary">
            <FiPlus /> Add product
          </Link>
        </div>
      </div>

      {loadError && <ErrorState message="We couldn’t load your products. Your catalogue has not been changed." onRetry={() => { if (userId) { setLoading(true); void fetchProducts(userId).catch(() => setLoadError(true)).finally(() => setLoading(false)); } }} />}
      <section className="ds-catalog-card" hidden={loadError}>
        <div className="ds-catalog-toolbar">
          <div className="ds-catalog-search">
            <FiSearch />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
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
              aria-label="Filter by status"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="out">Out of stock</option>
            </select>
            <FiChevronDown />
          </label>
          {categories.length > 0 && (
            <label className="ds-catalog-view">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel(category)}
                  </option>
                ))}
              </select>
              <FiChevronDown />
            </label>
          )}
        </div>

        <div className="ps-product-options"><span>{selected.length ? `${selected.length} selected` : `${filtered.length} products`}</span><label>Sort by <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">Default</option><option value="name">Name A–Z</option><option value="views">Most viewed</option><option value="price">Price: low to high</option></select></label><div className="ps-view-toggle"><button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={18} /></button><button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><LayoutGrid size={18} /></button></div></div>
        {view === "grid" && !loading && filtered.length > 0 ? <div className="ps-product-grid">{filtered.map((product) => <ManagementProductCard key={product.id} product={product} href={username ? `/store/edit/${product.id}` : STORE_SETTINGS_PATH} price={priceLabel(product)} selected={selected.includes(product.id)} onSelect={() => toggleOne(product.id)} />)}</div> :
        <div className="ds-catalog-table-wrap">
          <div className="ds-catalog-table" role="table">
            <div className="ds-catalog-head" role="row">
              <label className="ds-catalog-check">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                  aria-label="Select all products"
                />
              </label>
              <span>Product</span>
              <span>Status</span>
              <span>Inventory</span>
              <span>Views</span>
              <span>Price</span>
            </div>

            {loading ? (
              [0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="ds-catalog-row ds-catalog-skeleton" role="row">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              ))
            ) : filtered.length ? (
              filtered.map((product) => {
                const count = stockCount(product);
                const outOfStock = product.isInStock === false;
                const low =
                  outOfStock || (count !== null && count <= 6);
                const inventory = outOfStock
                  ? "0 in stock"
                  : count === null
                    ? "In stock"
                    : `${count} in stock`;
                const image = product.images?.[0];
                const href = username
                  ? `/store/edit/${product.id}`
                  : STORE_SETTINGS_PATH;

                return (
                  <div key={product.id} className="ds-catalog-row" role="row">
                    <label className="ds-catalog-check" onClick={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(product.id)}
                        onChange={() => toggleOne(product.id)}
                        aria-label={`Select ${product.name || "product"}`}
                      />
                    </label>
                    <Link href={href} className="ds-catalog-product">
                      {image ? (
                        <Image src={image} alt="" width={40} height={40} sizes="40px" unoptimized />
                      ) : (
                        <span className="ds-catalog-thumb" />
                      )}
                      <strong>{product.name || "Untitled product"}</strong>
                    </Link>
                    <span>
                      <i className={`ds-status-pill ${product.isHidden ? "hidden" : "active"}`}>
                        {product.isHidden ? "Hidden" : "Active"}
                      </i>
                    </span>
                    <span className={low ? "ds-inventory-low" : undefined}>{inventory}</span>
                    <span>{Number(product.views || 0).toLocaleString("en-IN")}</span>
                    <span>{priceLabel(product)}</span>
                  </div>
                );
              })
            ) : (
              <div className="ds-catalog-empty">
                <strong>No products found</strong>
                <p>
                  {products.length
                    ? "Try a different search or filter."
                    : "Add your first product to start building your catalog."}
                </p>
                {!products.length && (
                  <Link href={addProductHref} className="ds-catalog-btn-primary">
                    <FiPlus /> Add product
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>}
      </section>

      {confirmDelete && (
        <WorkspaceDialog label="Delete selected products" onClose={() => setConfirmDelete(false)} busy={deleting}>
            <strong>Delete {selected.length} product{selected.length === 1 ? "" : "s"}?</strong>
            <p>This action cannot be undone.</p>
            <div>
              <button type="button" className="ds-catalog-btn" disabled={deleting} onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="ds-catalog-btn-danger"
                onClick={() => void deleteSelected()}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
        </WorkspaceDialog>
      )}
    </div>
  );
}
