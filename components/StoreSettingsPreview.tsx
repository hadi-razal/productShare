"use client";

import { Search } from "lucide-react";

interface StoreSettingsPreviewProps {
  name: string;
  username: string;
  logoUrl: string | null;
  themeColor: string;
  additionalNotes: string;
}

const PLACEHOLDER_PRODUCTS = [
  { name: "Sample Product", price: "₹499" },
  { name: "Best Seller", price: "₹899" },
  { name: "New Arrival", price: "₹649" },
  { name: "Featured Item", price: "₹1,299" },
];

const StoreSettingsPreview = ({
  name,
  username,
  logoUrl,
  themeColor,
  additionalNotes,
}: StoreSettingsPreviewProps) => {
  const storeLabel = name.trim() || "Your Shop Name";
  const storeUrl = username.trim()
    ? `productshare.in/store/${username.trim()}`
    : "productshare.in/store/your-username";

  return (
    <div className="w-full">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Live Preview
      </p>

      <div className="rounded-2xl border border-gray-200 bg-gray-100 p-3 shadow-sm">
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-2 px-3 py-1 rounded-md bg-white border border-gray-200 text-[10px] text-gray-400 truncate">
              {storeUrl}
            </div>
          </div>

          {/* Store header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: themeColor }}
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
              <p className="text-white font-bold text-sm truncate">{storeLabel}</p>
              <p className="text-white/70 text-[10px] truncate">@{username || "username"}</p>
            </div>
          </div>

          {/* Promo banner */}
          {additionalNotes.trim() && (
            <div className="bg-red-600 marquee">
              <div className="marquee-content py-1.5">
                <span className="text-white text-[10px] px-4">
                  {additionalNotes} &nbsp;&nbsp;&nbsp; {additionalNotes}
                </span>
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="px-3 py-3 border-b border-gray-100">
            <div className="relative">
              <input
                readOnly
                placeholder="Search products..."
                className="w-full px-3 py-2 pr-9 text-[11px] border border-gray-200 rounded-lg bg-gray-50 text-gray-400"
              />
              <div
                className="absolute right-0 top-0 bottom-0 flex items-center px-2.5 rounded-r-lg"
                style={{ backgroundColor: themeColor }}
              >
                <Search size={12} className="text-white" />
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="p-3 grid grid-cols-2 gap-2">
            {PLACEHOLDER_PRODUCTS.map((product) => (
              <div
                key={product.name}
                className="rounded-lg border border-gray-100 bg-white overflow-hidden"
              >
                <div className="h-16 bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="p-2">
                  <p className="text-[10px] font-medium text-gray-800 truncate">
                    {product.name}
                  </p>
                  <p
                    className="text-[10px] font-bold mt-0.5"
                    style={{ color: themeColor }}
                  >
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Updates as you edit your settings
      </p>
    </div>
  );
};

export default StoreSettingsPreview;
