"use client";

import { ProductType } from "@/type";
import { deleteProduct } from "@/lib/db";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const productHref =
    storeId && product?.id ? `/store/${storeId}/${product.id}` : null;

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
      <div className="w-full">
        <div className="aspect-square w-full bg-neutral-100 animate-pulse" />
        <div className="mt-2.5 space-y-2">
          <div className="h-3 w-3/4 bg-neutral-100 animate-pulse" />
          <div className="h-3 w-1/3 bg-neutral-100 animate-pulse" />
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
        className="cursor-pointer relative w-full bg-white"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          {product.images?.[0] && !imgLoaded && (
            <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
          )}

          {product.isHidden && isStoreOwner && (
            <div className="absolute inset-0 z-10 bg-black/70 flex flex-col items-center justify-center">
              <span className="text-white text-xs font-medium px-3 text-center">Hidden</span>
            </div>
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
              className={`h-full w-full object-cover transition-opacity duration-300 ${
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

        <div className="pt-2.5">
          <h3 className="text-[13px] font-bold uppercase tracking-tight text-black leading-snug line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-[13px] font-normal text-black">
              {Number.isFinite(displayPrice) ? formatPrice(displayPrice) : "RS. 0.00"}
            </span>
            {isDiscounted && (
              <span className="text-[12px] text-neutral-400 line-through">
                {formatPrice(Number(product.regularPrice))}
              </span>
            )}
          </div>
          {!product.isInStock && (
            <p className="mt-1 text-[11px] uppercase tracking-wide text-neutral-500">
              Out of stock
            </p>
          )}
        </div>

        {isStoreOwner && (
          <div className="mt-2 flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/store/${storeId}/edit/${product.id}`);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500 hover:text-black"
            >
              <FiEdit2 className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500 hover:text-red-600"
            >
              <FiTrash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        )}
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
