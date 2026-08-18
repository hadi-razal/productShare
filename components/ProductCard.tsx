"use client";

import { ProductType } from "@/type";
import { deleteProduct } from "@/lib/db";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useStorefrontNav } from "@/components/storefront-nav";

interface ProductCardProps {
  product?: ProductType;
  storeId?: string;
  storeOwnerId?: string | null;
  isStoreOwner?: boolean;
  isLoading?: boolean;
  refetchProducts?: () => void;
}

const formatPrice = (value: number) =>
  `RS. ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ProductCard = ({
  product,
  storeId,
  storeOwnerId,
  isStoreOwner = false,
  refetchProducts,
  isLoading,
}: ProductCardProps) => {
  const router = useRouter();
  const nav = useStorefrontNav();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const productHref =
    storeId && product?.id ? nav.productHref(storeId, product.id) : null;

  const calculateDiscount = (): number => {
    const regularPrice = Number(product?.regularPrice);
    const discountPrice = Number(product?.discountPrice);
    if (
      !isNaN(regularPrice) &&
      !isNaN(discountPrice) &&
      regularPrice > 0 &&
      discountPrice >= 0 &&
      discountPrice < regularPrice
    ) {
      return Number(
        (((regularPrice - discountPrice) / regularPrice) * 100).toFixed(1)
      );
    }
    return 0;
  };

  const discountPercentage = calculateDiscount();
  const isDiscounted = discountPercentage > 0;

  const displayPrice = isDiscounted
    ? Number(product?.discountPrice)
    : Number(product?.regularPrice);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      if (!storeOwnerId || !product?.id) {
        toast.error("Error");
        return;
      }

      await deleteProduct(storeOwnerId, product.id);
      refetchProducts?.();
      toast.success("Product deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product.");
    }
  };

  if (isLoading) {
    return (
      <div className="sf-product-card w-full border p-2">
        <div className="aspect-square w-full animate-pulse" style={{ background: "var(--sf-bg)", borderRadius: "var(--sf-radius-sm)" }} />
        <div className="space-y-2 px-1 pb-2 pt-3">
          <div className="h-3 w-3/4 animate-pulse rounded-full" style={{ background: "var(--sf-bg)" }} />
          <div className="h-3 w-1/3 animate-pulse rounded-full" style={{ background: "var(--sf-bg)" }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  if (product.isHidden && !isStoreOwner) return null;

  return (
    <>
      <div
        onClick={() => {
          if (productHref) {
            router.push(productHref);
          }
        }}
        onMouseEnter={() => {
          if (productHref) {
            void router.prefetch(productHref);
          }
        }}
        onFocus={() => {
          if (productHref) {
            void router.prefetch(productHref);
          }
        }}
        className="sf-product-card group relative w-full cursor-pointer overflow-hidden border p-2 transition duration-200 hover:-translate-y-0.5"
      >
        <div className="relative aspect-square w-full overflow-hidden" style={{ background: "var(--sf-bg)", borderRadius: "var(--sf-radius-sm)" }}>
          {product.images?.[0] && !imgLoaded && (
            <div className="absolute inset-0 animate-pulse" style={{ background: "var(--sf-bg)" }} />
          )}

          {product.isHidden && isStoreOwner && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/70">
              <span className="rounded-full bg-white/15 px-3 py-1 text-center text-xs font-medium text-white">
                Hidden
              </span>
            </div>
          )}

          {isDiscounted && (
            <span
              className="absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm"
              style={{ background: "var(--sf-surface)", color: "var(--sf-accent)" }}
            >
              {discountPercentage}% off
            </span>
          )}

          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={600}
              quality={70}
              unoptimized
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}
        </div>

        <div className="px-1 pb-2 pt-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em]">
            {product.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
            <span className="sf-price text-sm font-semibold">
              {Number.isFinite(displayPrice) ? formatPrice(displayPrice) : "RS. 0.00"}
            </span>
            {isDiscounted && (
              <span className="sf-muted text-xs line-through">
                {formatPrice(Number(product.regularPrice))}
              </span>
            )}
          </div>
          {!product.isInStock && (
            <p className="mt-2 w-fit rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Out of stock
            </p>
          )}

          {isStoreOwner && (
            <div className="mt-3 flex gap-3 border-t pt-3" style={{ borderColor: "var(--sf-border)" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!storeId) return;
                  router.push(nav.editHref(storeId, product.id));
                }}
                className="sf-muted inline-flex items-center gap-1 text-[11px] font-semibold hover:opacity-80"
              >
                <FiEdit2 className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600"
              >
                <FiTrash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-gray-900 mb-1">Delete product?</p>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
