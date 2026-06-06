"use client";

import { FaStar } from "react-icons/fa";
import { Truck } from "lucide-react";
import { ProductType } from "@/type";

interface ProductPreviewProps {
  product: ProductType;
  previewImages: string[];
  previewVideo: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  home: "Home & Garden",
  sports: "Sports & Outdoors",
  autoMobiles: "Automobiles",
  books: "Books",
  toys: "Toys & Games",
};

const ProductPreview = ({
  product,
  previewImages,
  previewVideo,
}: ProductPreviewProps) => {
  const regular = Number(product.regularPrice);
  const discount = Number(product.discountPrice);
  const hasDiscount =
    !isNaN(regular) &&
    !isNaN(discount) &&
    regular > 0 &&
    discount >= 0 &&
    discount < regular;
  const discountPct = hasDiscount
    ? Math.round(((regular - discount) / regular) * 100)
    : 0;
  const displayPrice = hasDiscount ? discount : regular;
  const mainImage = previewImages[0];
  const productName = product.name.trim() || "Product Name";
  const categoryLabel =
    CATEGORY_LABELS[product.category] || product.category || "Category";

  return (
    <div className="w-full">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Live Preview
      </p>

      <div className="rounded-2xl border border-gray-200 bg-gray-100 p-3 shadow-sm space-y-3">
        {/* Catalog card preview */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
              Catalog view
            </p>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-indigo-200 bg-white overflow-hidden ring-2 ring-indigo-400/30 col-span-1">
              <div className="relative h-20 bg-gray-100">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                    No image
                  </div>
                )}
                {!product.isInStock && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-bold rounded-full bg-red-600 text-white">
                    Out of Stock
                  </span>
                )}
                {hasDiscount && product.isInStock && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-bold rounded-full bg-red-600 text-white">
                    {discountPct}% OFF
                  </span>
                )}
                {product.isMostSelling && (
                  <span className="absolute bottom-0 right-0 px-1.5 py-0.5 text-[8px] font-bold bg-red-600 text-white rounded-tl-md flex items-center gap-0.5">
                    <FaStar className="text-yellow-300 w-2 h-2" /> Top
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="text-[10px] font-medium text-gray-800 line-clamp-2 leading-snug">
                  {productName}
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-[10px] font-bold ${
                      hasDiscount ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {displayPrice > 0
                      ? `₹${displayPrice.toLocaleString("en-IN")}`
                      : "₹—"}
                  </span>
                  {hasDiscount && (
                    <span className="text-[9px] text-gray-400 line-through">
                      ₹{regular.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-white overflow-hidden opacity-40">
              <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200" />
              <div className="p-2">
                <p className="text-[10px] text-gray-400">Other product</p>
                <p className="text-[10px] text-gray-300 mt-1">₹499</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product page preview */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] text-gray-400 truncate">
              productshare.in/store/you/product
            </div>
          </div>

          <div className="p-3 space-y-3">
            <div className="relative h-36 rounded-lg overflow-hidden bg-gray-100">
              {previewVideo ? (
                <video
                  src={previewVideo}
                  muted
                  className="w-full h-full object-cover"
                />
              ) : mainImage ? (
                <img
                  src={mainImage}
                  alt={productName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Upload a product image
                </div>
              )}
            </div>

            {previewImages.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto">
                {previewImages.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                      i === 0 ? "border-indigo-500" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="text-sm font-bold text-gray-900 leading-snug">
                {productName}
              </p>
              {product.category && (
                <p className="text-[10px] text-indigo-600 font-medium mt-1">
                  {categoryLabel}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {!product.isInStock && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Out of Stock
                </span>
              )}
              {product.isFreeDelivery && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-0.5">
                  <Truck className="w-2.5 h-2.5" /> Free Delivery
                </span>
              )}
              {product.isMostSelling && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Top Seller
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span
                className={`text-lg font-bold ${
                  hasDiscount ? "text-red-600" : "text-gray-900"
                }`}
              >
                {displayPrice > 0
                  ? `₹${displayPrice.toLocaleString("en-IN")}`
                  : "₹0"}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{regular.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    {discountPct}% off
                  </span>
                </>
              )}
            </div>

            {product.description.trim() && (
              <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            )}

            {product.category === "clothing" && product.sizes.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-500 mb-1.5">
                  Sizes
                </p>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="text-[9px] font-semibold px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-500 mb-1.5">
                  Colors
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.tags?.trim() && (
              <div className="flex flex-wrap gap-1">
                {product.tags.split(",").slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled
              className="w-full py-2.5 rounded-lg text-white text-xs font-semibold"
              style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
            >
              Buy on WhatsApp
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Updates as you fill in product details
      </p>
    </div>
  );
};

export default ProductPreview;
