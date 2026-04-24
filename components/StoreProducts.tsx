"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Search, X, LayoutDashboard, PlusSquare, Settings, MessageSquare, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getUserId } from "@/helpers/getUserId";
import { auth, db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import { ProductType } from "@/type";

interface StoreProductsProps {
  storeId: string | undefined;
  initialProducts?: ProductType[];
  storeOwnerId?: string | null;
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

const StoreProducts = ({
  storeId,
  initialProducts,
  storeOwnerId,
}: StoreProductsProps) => {
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsStoreOwner(!!(user && resolvedStoreOwnerId && user.uid === resolvedStoreOwnerId));
    });

    return () => unsubscribe();
  }, [resolvedStoreOwnerId]);

  const countStoreView = useCallback(async (userID: string) => {
    if (typeof window === "undefined" || !storeId || !userID) {
      return;
    }

    try {
      const isCounted = sessionStorage.getItem(`MyShop_${storeId}_View`);
      if (isCounted) {
        return;
      }

      await updateDoc(doc(db, "users", userID), { visitCount: increment(1) });
      sessionStorage.setItem(`MyShop_${storeId}_View`, "true");
    } catch (error) {
      console.error("Error counting store visit:", error);
    }
  }, [storeId]);

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

      const productsRef = collection(db, "users", userID, "products");
      const querySnapshot = await getDocs(productsRef);

      const productList: ProductType[] = querySnapshot.docs.map((productDoc) => {
        const data = productDoc.data();
        return {
          id: productDoc.id,
          name: data.name,
          description: data.description || "",
          colors: data.colors || [],
          category: data.category || "",
          images: data.images || [],
          regularPrice: data.regularPrice,
          discountPrice: data.discountPrice,
          isNew: data.isNew || false,
          isInStock: data.isInStock || false,
          rating: data.rating || 0,
          ratingCount: data.ratingCount || 0,
          sizes: data.sizes || [],
          isMostSelling: data.isMostSelling || false,
          createdAt: getCreatedAtValue(data.createdAt),
          tags: data.tags || "",
          isFeatured: data.isFeatured || false,
          isHidden: data.isHidden || false,
        };
      });

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

  const filterProducts = () => {
    let results = [...products];

    if (searchInput.trim()) {
      results = results.filter((product) => {
        const searchTerm = searchInput.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.colors.some((color) =>
            color.toLowerCase().includes(searchTerm)
          ) ||
          (product.category &&
            product.category.toLowerCase().includes(searchTerm)) ||
          (product.tags && product.tags.toLowerCase().includes(searchTerm))
        );
      });
    }

    if (sortOption) {
      results = sortProducts(results, sortOption);
    }

    setFilteredProducts(results);
  };

  const sortProducts = (
    items: ProductType[],
    option: string
  ): ProductType[] => {
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

  const handleSearchClick = () => filterProducts();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") filterProducts();
  };

  const clearSearchInput = () => {
    setSearchInput("");
    setFilteredProducts(products);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    filterProducts();
  };

  const handleLoadMore = () => setVisibleProducts((prev) => prev + 20);

  return (
    <div className="container relative min-h-screen max-w-7xl mx-auto pb-8 pt-5 px-4">
      <div className="relative flex items-center w-full pb-3">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Search products or categories..."
          className="w-full px-4 py-3 pr-12 text-sm border rounded-lg border-gray-200 focus:outline-none placeholder:text-gray-400"
        />
        <div className="absolute right-0 flex items-center justify-center h-full space-x-1">
          {searchInput && (
            <button
              onClick={clearSearchInput}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={handleSearchClick}
            className="p-2 text-white bg-primaryColor rounded-md px-4 py-3"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-2 pb-2">
        <select
          name="sort"
          value={sortOption}
          onChange={handleSortChange}
          className="px-4 py-2 rounded-md border border-gray-200"
        >
          <option value="" disabled>
            Sort by
          </option>
          <option value="newest">Newly Added</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
        {isLoading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <ProductCard
                key={idx}
                isLoading
              />
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

      {visibleProducts < filteredProducts.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2.5 text-white font-medium rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}
          >
            Load More
          </button>
        </div>
      )}

      {/* ── Admin Slide-in Panel ── */}
      {isStoreOwner && (
        <>
          {/* Toggle Tab */}
          <button
            onClick={() => setAdminPanelOpen(!adminPanelOpen)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1 py-3 px-2 rounded-l-xl text-white text-xs font-semibold transition-all hover:px-3"
            style={{ background: 'linear-gradient(180deg, #4f46e5, #7c3aed)', boxShadow: '-2px 0 12px rgba(79,70,229,0.3)', writingMode: adminPanelOpen ? undefined : 'vertical-rl' }}
          >
            {adminPanelOpen ? <ChevronRight className="w-4 h-4" /> : <><LayoutDashboard className="w-4 h-4" /><span style={{ transform: 'rotate(180deg)' }}>Admin</span></>}
          </button>

          {/* Overlay */}
          {adminPanelOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
              onClick={() => setAdminPanelOpen(false)}
            />
          )}

          {/* Panel */}
          <div
            className="fixed top-0 right-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out"
            style={{
              width: '300px',
              maxWidth: '85vw',
              background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
              transform: adminPanelOpen ? 'translateX(0)' : 'translateX(100%)',
              boxShadow: adminPanelOpen ? '-8px 0 32px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {/* Panel Header */}
            <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Admin Panel</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>Store Management</p>
                  </div>
                </div>
                <button
                  onClick={() => setAdminPanelOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Panel Actions */}
            <div style={{ padding: '16px 14px', flex: 1, overflowY: 'auto' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748b', padding: '0 10px' }}>Quick Actions</p>
              {[
                { href: '/store', icon: LayoutDashboard, label: 'Dashboard', desc: 'View analytics & stats' },
                { href: '/store/add-product', icon: PlusSquare, label: 'Add Product', desc: 'Create new listing' },
                { href: '/store/reviews', icon: MessageSquare, label: 'Reviews', desc: 'Customer feedback' },
                { href: '/store/settings', icon: Settings, label: 'Settings', desc: 'Store preferences' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl transition-colors mb-1"
                  style={{ padding: '12px 10px', color: '#94a3b8', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e2e8f0'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <item.icon className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Panel Footer */}
            <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Link
                href="/store"
                className="flex items-center justify-center gap-2 w-full rounded-xl text-sm font-semibold transition-all"
                style={{ padding: '11px', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)', textDecoration: 'none' }}
              >
                <ExternalLink className="w-4 h-4" />
                Open Dashboard
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreProducts;
