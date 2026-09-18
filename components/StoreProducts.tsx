"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthChange } from "@/lib/auth";
import {
  FiChevronRight,
  FiExternalLink,
  FiLayout,
  FiMessageSquare,
  FiPackage,
  FiPlusSquare,
  FiSearch,
  FiSettings,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { getUserId } from "@/helpers/getUserId";
import { incrementStoreVisits, listProductsByStore } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { useStorefrontNav } from "@/components/storefront-nav";
import { ProductType } from "@/type";

interface StoreProductsProps {
  storeId: string | undefined;
  initialProducts?: ProductType[];
  storeOwnerId?: string | null;
  storeName?: string;
  storeDescription?: string;
  storeLogo?: string;
  storeNote?: string;
  isOffline?: boolean;
}

const getCreatedAtValue = (createdAt: ProductType["createdAt"]) => {
  if (typeof createdAt === "number") {
    return createdAt;
  }

  if (typeof createdAt?.toMillis === "function") {
    return createdAt.toMillis();
  }

  if (typeof createdAt === "string") {
    return new Date(createdAt).getTime() || 0;
  }

  return 0;
};

const sortProducts = (items: ProductType[], option: string): ProductType[] => {
  switch (option) {
    case "price-low-high":
      return [...items].sort(
        (a, b) =>
          (a.discountPrice || a.regularPrice) -
          (b.discountPrice || b.regularPrice)
      );
    case "price-high-low":
      return [...items].sort(
        (a, b) =>
          (b.discountPrice || b.regularPrice) -
          (a.discountPrice || a.regularPrice)
      );
    case "newest":
      return [...items].sort((a, b) => {
        const dateA = getCreatedAtValue(a.createdAt);
        const dateB = getCreatedAtValue(b.createdAt);
        return dateB - dateA;
      });
    default:
      return items;
  }
};

const StoreProducts = ({
  storeId,
  initialProducts,
  storeOwnerId,
  storeName,
  storeDescription,
  storeLogo,
  storeNote,
  isOffline = false,
}: StoreProductsProps) => {
  const nav = useStorefrontNav();
  const [products, setProducts] = useState<ProductType[]>(() => initialProducts ?? []);
  const [isLoading, setIsLoading] = useState(initialProducts === undefined);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>(
    () => initialProducts ?? []
  );
  const [sortOption, setSortOption] = useState<string>("");
  const [visibleProducts, setVisibleProducts] = useState(20);
  const [resolvedStoreOwnerId, setResolvedStoreOwnerId] = useState<string | null>(
    storeOwnerId ?? null
  );
  const [isStoreOwner, setIsStoreOwner] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    setProducts(initialProducts ?? []);
    setFilteredProducts(initialProducts ?? []);
    setIsLoading(initialProducts === undefined);
  }, [initialProducts]);

  useEffect(() => {
    setResolvedStoreOwnerId(storeOwnerId ?? null);
  }, [storeOwnerId]);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setIsStoreOwner(!!(user && resolvedStoreOwnerId && user.uid === resolvedStoreOwnerId));
    });

    return () => unsubscribe();
  }, [resolvedStoreOwnerId]);

  const countStoreView = useCallback(async (userID: string) => {
    if (typeof window === "undefined" || !storeId || !userID || isOffline) {
      return;
    }

    try {
      const isCounted = sessionStorage.getItem(`MyShop_${storeId}_View`);
      if (isCounted) {
        return;
      }

      await incrementStoreVisits(userID);
      sessionStorage.setItem(`MyShop_${storeId}_View`, "true");
    } catch (error) {
      console.error("Error counting store visit:", error);
    }
  }, [isOffline, storeId]);

  const fetchProducts = useCallback(async () => {
    if (!storeId || typeof window === "undefined") {
      return;
    }

    setIsLoading(true);

    try {
      const userID = resolvedStoreOwnerId ?? (await getUserId(storeId));

      if (!userID) {
        setProducts([]);
        setFilteredProducts([]);
        return;
      }

      if (!resolvedStoreOwnerId) {
        setResolvedStoreOwnerId(userID);
      }

      void countStoreView(userID);

      const productList = await listProductsByStore(userID);

      setProducts(productList);
      setFilteredProducts(productList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [countStoreView, resolvedStoreOwnerId, storeId]);

  useEffect(() => {
    const publicStoreOwnerId = storeOwnerId ?? resolvedStoreOwnerId;

    if (initialProducts !== undefined) {
      if (publicStoreOwnerId) {
        void countStoreView(publicStoreOwnerId);
      }
      return;
    }

    void fetchProducts();
  }, [countStoreView, fetchProducts, initialProducts, resolvedStoreOwnerId, storeId, storeOwnerId]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  const handleLoadMore = () => setVisibleProducts((prev) => prev + 20);
  const displayStoreName = storeName?.trim() || storeId || "Online Store";
  const visibleProductCount = filteredProducts.filter(
    (product) => !product.isHidden || isStoreOwner
  ).length;
  const announcement = storeNote?.trim() || "";
  const description =
    storeDescription?.trim() || "Browse products, prices, and details from this catalog.";

  useEffect(() => {
    let results = [...products];

    if (searchInput.trim()) {
      const searchTerm = searchInput.toLowerCase();
      results = results.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.colors.some((color) => color.toLowerCase().includes(searchTerm)) ||
          (product.category && product.category.toLowerCase().includes(searchTerm)) ||
          (product.tags && product.tags.toLowerCase().includes(searchTerm))
        );
      });
    }

    if (sortOption) {
      results = sortProducts(results, sortOption);
    }

    setFilteredProducts(results);
  }, [products, searchInput, sortOption]);

  return (
    <div className="sf-page relative w-full pb-20 pt-6">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <header className="sf-store-header">
          <div className="flex items-start gap-4">
            {storeLogo ? (
              <Image
                src={storeLogo}
                alt={`${displayStoreName} logo`}
                width={56}
                height={56}
                unoptimized={storeLogo.startsWith("http")}
                className="h-14 w-14 shrink-0 object-contain"
                style={{
                  border: "1px solid var(--sf-border)",
                  borderRadius: "var(--sf-radius-sm)",
                  background: "var(--sf-surface)",
                }}
              />
            ) : (
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center text-lg font-semibold"
                style={{
                  background: "var(--sf-surface)",
                  color: "var(--sf-text)",
                  border: "1px solid var(--sf-border)",
                  borderRadius: "var(--sf-radius-sm)",
                }}
              >
                {displayStoreName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 pt-0.5">
              <h1 className="sf-title truncate text-[22px] font-semibold tracking-[-0.03em] sm:text-2xl">
                {displayStoreName}
              </h1>
              <p className="sf-muted mt-1 max-w-xl text-sm leading-6 line-clamp-2">
                {description}
              </p>
              <p className="sf-muted mt-2 text-xs">
                {products.length} {products.length === 1 ? "product" : "products"}
              </p>
            </div>
          </div>

          {announcement ? (
            <p className="sf-store-note">{announcement}</p>
          ) : null}

          <div className={`sf-store-tools${isStoreOwner ? " has-manage" : ""}`}>
            <div className="relative min-w-0 flex-1">
              <FiSearch className="sf-muted pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                type="search"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Search products"
                aria-label="Search products"
                className="sf-input h-11 w-full border pl-10 pr-10 text-sm outline-none"
                style={{ borderRadius: "var(--sf-radius-sm)" }}
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="sf-muted absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center"
                  aria-label="Clear search"
                >
                  <FiX size={16} />
                </button>
              ) : null}
            </div>
            <select
              name="sort"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              aria-label="Sort products"
              className="sf-select h-11 border px-3 text-sm outline-none sm:w-44"
              style={{ borderRadius: "var(--sf-radius-sm)" }}
            >
              <option value="">Featured</option>
              <option value="newest">Newly added</option>
              <option value="price-low-high">Price: low to high</option>
              <option value="price-high-low">Price: high to low</option>
            </select>
          </div>
        </header>

        <div className="mb-4 mt-8 flex items-end justify-between gap-4">
          <h2 className="sf-title text-base font-semibold tracking-tight sm:text-lg">
            All products
          </h2>
          <p className="sf-muted text-xs">
            {visibleProductCount} {visibleProductCount === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <ProductCard key={idx} isLoading />
              ))
            : filteredProducts.slice(0, visibleProducts).map((product) => (
                <ProductCard
                  key={product.id}
                  isLoading={isLoading}
                  refetchProducts={fetchProducts}
                  storeId={storeId}
                  storeOwnerId={resolvedStoreOwnerId}
                  isStoreOwner={isStoreOwner}
                  product={product}
                />
              ))}
        </div>

        {!isLoading && visibleProductCount === 0 && (
          <div className="sf-card border-dashed px-6 py-16 text-center">
            <div
              className="mx-auto flex h-11 w-11 items-center justify-center"
              style={{ background: "var(--sf-bg)", color: "var(--sf-muted)", borderRadius: "var(--sf-radius-sm)" }}
            >
              <FiPackage />
            </div>
            <h3 className="sf-title mt-4 text-sm font-semibold">No products found</h3>
            <p className="sf-muted mt-1 text-sm">Try a different search or check back soon.</p>
          </div>
        )}

        {visibleProducts < filteredProducts.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="sf-ghost rounded-md px-5 py-3 text-sm font-semibold"
              style={{ borderRadius: "var(--sf-radius-sm)" }}
            >
              Load more
            </button>
          </div>
        )}
      </div>

      {/* ── Admin Slide-in Panel ── */}
      {isStoreOwner && (
        <>
          {/* Toggle Tab */}
          <button
            type="button"
            onClick={() => setAdminPanelOpen(!adminPanelOpen)}
            className={`fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-1 rounded-l-xl border border-r-0 border-violet-500 bg-violet-600 px-2 py-3 text-xs font-semibold text-white shadow-lg shadow-violet-900/10 transition-all hover:bg-violet-700 ${
              adminPanelOpen ? "" : "[writing-mode:vertical-rl]"
            }`}
            aria-label={adminPanelOpen ? "Close store controls" : "Open store controls"}
          >
            {adminPanelOpen ? (
              <FiChevronRight className="h-4 w-4" />
            ) : (
              <>
                <FiLayout className="h-4 w-4" />
                <span className="rotate-180">Manage</span>
              </>
            )}
          </button>

          {/* Overlay */}
          {adminPanelOpen && (
            <div
              className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[2px]"
              onClick={() => setAdminPanelOpen(false)}
            />
          )}

          {/* Panel */}
          <div
            className={`fixed right-0 top-0 z-50 flex h-full w-[320px] max-w-[88vw] flex-col border-l border-slate-200 bg-white transition-transform duration-300 ease-out ${
              adminPanelOpen
                ? "translate-x-0 shadow-[-16px_0_48px_rgba(15,23,42,0.12)]"
                : "translate-x-full"
            }`}
          >
            {/* Panel Header */}
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-100">
                    <FiLayout className="h-5 w-5 text-violet-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Store controls</p>
                    <p className="text-xs text-slate-500">Quick management tools</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminPanelOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
                  aria-label="Close store controls"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Panel Actions */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Quick actions
              </p>
              {[
                { href: nav.dashboardHref("/store"), icon: FiLayout, label: "Dashboard", desc: "View analytics and stats" },
                { href: nav.dashboardHref("/store/add-product"), icon: FiPlusSquare, label: "Add product", desc: "Create a new listing" },
                { href: nav.dashboardHref("/store/reviews"), icon: FiMessageSquare, label: "Reviews", desc: "Read customer feedback" },
                { href: nav.dashboardHref("/store/settings"), icon: FiSettings, label: "Settings", desc: "Update store details" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mb-1 flex items-center gap-3 rounded-md px-3 py-3 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-violet-600">
                    <item.icon className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Panel Footer */}
            <div className="border-t border-slate-200 p-4">
              <Link
                href="/store"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <FiExternalLink className="h-4 w-4" />
                Open dashboard
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreProducts;
