"use client";

import { getUserId } from "@/helpers/getUserId";
import { auth, db } from "@/lib/firebase";
import { ProductType } from "@/type";
import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { PencilIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

interface ProductCardProps {
  product?: ProductType;
  storeId?: string;
  isLoading?: boolean;
  refetchProducts?: () => void;
}

const ProductCard = ({
  product,
  storeId,
  refetchProducts,
  isLoading,
}: ProductCardProps) => {
  const router = useRouter();
  const [isStoreOwner, setIsStoreOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

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
      return Number((((regularPrice - discountPrice) / regularPrice) * 100).toFixed(1));
    }
    return 0;
  };

  const discountPercentage = calculateDiscount();
  const isDiscounted = discountPercentage > 0;

  const getDisplayPrice = () =>
    isDiscounted
      ? Number(product?.discountPrice).toLocaleString("en-IN")
      : Number(product?.regularPrice).toLocaleString("en-IN");

  const getOriginalPrice = () =>
    Number(product?.regularPrice).toLocaleString("en-IN");

  useEffect(() => {
    const getStoreOwner = async () => {
      try {
        const userId = await getUserId(storeId);
        onAuthStateChanged(auth, (user) => {
          if (user && user.uid === userId) setIsStoreOwner(true);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getStoreOwner();
  }, [storeId]);

  const handleDelete = (e: any) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async (e: any) => {
    try {
      e.stopPropagation();
      const userId = await getUserId(storeId);
      if (!userId) { toast.error("Error"); return; }
      await deleteDoc(doc(db, "users", userId, "products", product.id));
      refetchProducts?.();
      toast.success("Product deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product.");
    }
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="relative w-full rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="w-full h-48 bg-gray-200 animate-pulse" />
        <div className="p-3 space-y-2">
          <div className="h-3.5 w-3/4 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-3 w-1/2 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex gap-2 pt-1">
            <div className="h-3.5 w-1/4 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3.5 w-1/4 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (product.isHidden && !isStoreOwner) return null;

  return (
    <div
      onClick={() => router.push(`/store/${storeId}/${product.id}`)}
      className="cursor-pointer relative w-full rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* ── Image container ── */}
      <div className="relative w-full h-48 bg-gray-100 rounded-t-xl overflow-hidden">
        {/* Shimmer placeholder — fades out when image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        )}

        {product.isHidden && isStoreOwner && (
          <div className="absolute inset-0 z-10 bg-black/70 flex flex-col items-center justify-center">
            <span className="text-white text-xs font-medium px-3 text-center">Hidden</span>
          </div>
        )}

        <Image
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={300}
          quality={80}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className={`w-full h-48 object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badges — top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {!product.isInStock && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-600 text-white shadow">
              Out of Stock
            </span>
          )}
          {isDiscounted && product.isInStock && (
            <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-bold shadow">
              {Math.round(discountPercentage)}% OFF
            </span>
          )}
        </div>

        {/* Badges — top right */}
        {product.isNew && (
          <span className="absolute top-2 right-2 z-10 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500 text-white shadow">
            New
          </span>
        )}

        {/* Most Selling — bottom */}
        {product.isMostSelling && (
          <span className="absolute bottom-0 right-0 z-10 px-2 py-1 text-[10px] flex items-center gap-0.5 font-bold bg-red-600 text-white rounded-tl-lg">
            <FaStar className="text-yellow-300 w-2.5 h-2.5" /> Top Seller
          </span>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-2.5">
        <h3 className="text-sm text-gray-800 line-clamp-2 leading-snug mb-1.5">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-sm font-semibold ${isDiscounted ? "text-red-600" : "text-gray-900"}`}>
            ₹{getDisplayPrice()}
          </span>
          {isDiscounted && (
            <span className="text-xs text-gray-400 line-through">₹{getOriginalPrice()}</span>
          )}
        </div>
      </div>

      {/* ── Owner controls ── */}
      {isStoreOwner && (
        <div className="flex gap-2 px-2.5 pb-2.5">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 py-1.5 px-3 w-full rounded-lg text-white text-xs font-medium transition-colors"
          >
            <Trash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/store/${storeId}/edit/${product.id}`);
            }}
            className="flex items-center justify-center gap-1 bg-gray-500 hover:bg-gray-600 w-full py-1.5 px-3 rounded-lg text-white text-xs font-medium transition-colors"
          >
            <PencilIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      )}

      {/* ── Delete modal ── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
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
    </div>
  );
};

export default ProductCard;
