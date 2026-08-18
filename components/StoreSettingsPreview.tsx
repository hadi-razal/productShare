"use client";

import { type CSSProperties } from "react";
import { FiSearch } from "react-icons/fi";
import {
  normalizeStoreTheme,
  STORE_THEME_MAP,
  storeThemeCssVars,
  type StoreThemeId,
} from "@/lib/store-themes";
import { storefrontDisplayHost } from "@/lib/storefront-url";

interface StoreSettingsPreviewProps {
  name: string;
  username: string;
  logoUrl: string | null;
  themeColor: string;
  storeTheme?: StoreThemeId | string;
  additionalNotes: string;
  isOffline?: boolean;
}

const PLACEHOLDER_PRODUCTS = [
  { name: "Sample Product", price: "RS. 499.00" },
  { name: "Best Seller", price: "RS. 899.00" },
  { name: "New Arrival", price: "RS. 649.00" },
  { name: "Featured Item", price: "RS. 1,299.00" },
];

const StoreSettingsPreview = ({
  name,
  username,
  logoUrl,
  themeColor,
  storeTheme,
  additionalNotes,
  isOffline = false,
}: StoreSettingsPreviewProps) => {
  const storeLabel = name.trim() || "Your Shop Name";
  const storeUrl = username.trim()
    ? storefrontDisplayHost(username.trim())
    : "yourname.productshare.in";
  const themeId = normalizeStoreTheme(storeTheme);
  const theme = STORE_THEME_MAP[themeId];
  const accent = themeColor?.trim() || theme.accent;

  return (
    <div className="w-full">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        {isOffline ? "Offline Preview" : "Live Preview"}
      </p>

      <div className={`rounded-md border bg-gray-100 p-3 shadow-sm ${isOffline ? "border-rose-200" : "border-gray-200"}`}>
        <div className="relative overflow-hidden rounded-md border border-gray-200 shadow-sm">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-2 px-3 py-1 rounded-sm bg-white border border-gray-200 text-[10px] text-gray-400 truncate">
              {storeUrl}
            </div>
          </div>

          <div
            className="storefront-root storefront-preview"
            data-store-theme={themeId}
            data-store-theme-mode={theme.dark ? "dark" : "light"}
            data-store-serif={theme.serif ? "true" : undefined}
            style={
              {
                ...storeThemeCssVars(theme),
                "--sf-radius": "4px",
                "--sf-radius-sm": "4px",
              } as CSSProperties
            }
          >
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ background: accent }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Store logo"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white/20 border-2 border-white/30 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                  {storeLabel.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="sf-title text-white font-bold text-sm truncate">{storeLabel}</p>
                <p className="text-white/70 text-[10px] truncate">@{username || "username"}</p>
              </div>
            </div>

            {additionalNotes.trim() && (
              <div className="sf-note marquee">
                <div className="marquee-content py-1.5">
                  <span className="text-[10px] px-4">
                    {additionalNotes} &nbsp;&nbsp;&nbsp; {additionalNotes}
                  </span>
                </div>
              </div>
            )}

            <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--sf-border)" }}>
              <div className="relative">
                <input
                  readOnly
                  placeholder="Search products..."
                  className="sf-input w-full px-3 py-2 pr-9 text-[11px] rounded-sm"
                />
                <div
                  className="absolute right-0 top-0 bottom-0 flex items-center px-2.5 rounded-r-sm"
                  style={{ backgroundColor: accent }}
                >
                  <FiSearch size={12} className="text-white" />
                </div>
              </div>
            </div>

            <div className="p-3 grid grid-cols-2 gap-x-2 gap-y-4">
              {PLACEHOLDER_PRODUCTS.map((product) => (
                <div key={product.name} className="sf-product-card p-1.5">
                  <div
                    className="aspect-square"
                    style={{ background: theme.previewBg, borderRadius: "4px" }}
                  />
                  <div className="pt-1.5">
                    <p className="sf-title text-[10px] font-bold uppercase tracking-tight truncate">
                      {product.name}
                    </p>
                    <p className="sf-price text-[10px] mt-0.5">
                      {product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isOffline && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 px-6 text-center backdrop-blur-[2px]">
              <div>
                <p className="text-sm font-semibold text-slate-900">Store is offline</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">Visitors will see an unavailable page until you turn this back on.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        {theme.name} theme — updates as you edit your settings
      </p>
    </div>
  );
};

export default StoreSettingsPreview;
