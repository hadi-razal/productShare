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
      const discount = ((regularPrice - discountPrice) / regularPrice) * 100;
      return Number(discount.toFixed(1));
    }
    return 0;
  };

  const discountPercentage = calculateDiscount();
  const isDiscounted = discountPercentage > 0;

  const getDisplayPrice = () => {
    if (isDiscounted) {
      return Number(product?.discountPrice).toLocaleString("en-IN");
    }
    return Number(product?.regularPrice).toLocaleString("en-IN");
  };

  const getOriginalPrice = () => {
    return Number(product?.regularPrice).toLocaleString("en-IN");
  };

  useEffect(() => {
    const getStoreOwner = async () => {
      try {
        const userId = await getUserId(storeId);
        onAuthStateChanged(auth, (user) => {
          if (user && user.uid === userId) {
            setIsStoreOwner(true);
          }
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
      if (!userId) {
        toast.success("Error");
        return;
      }
      await deleteDoc(doc(db, userId, product.id));
      refetchProducts();
      toast.success("Product deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete product."); // Show error toast
    }
  };

  console.log(product);

  if (isLoading) {
    return (
      <div className="cursor-pointer relative w-full rounded-md border bg-gray-200 animate-pulse shadow-sm">
        <div className="w-full h-48 bg-gray-300 rounded-t-md"></div>
        <div className="p-2">
          <div className="h-4 w-3/4 bg-gray-300 rounded-md mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded-md mb-2"></div>
          <div className="flex gap-2">
            <div className="h-4 w-1/4 bg-gray-300 rounded-md"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (product.isHidden && !isStoreOwner) {
    return;
  }

  return (
    <div
      onClick={() => router.push(`/store/${storeId}/${product.id}`)}
      className="cursor-pointer relative w-full rounded-md border bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative">
        {product.isHidden && isStoreOwner && (
          <div className="bg-black/75 absolute flex flex-col items-center justify-center w-full h-full">
            <span className="text-white text-sm font-medium px-3">
              This product is hidden
            </span>
          </div>
        )}

        <Image
          quality={50}
          unoptimized={true}
          width={0}
          height={0}
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-contain rounded-t-lg"
        />
        <div className="absolute top-1 left-1 flex gap-2">
          {!product.isInStock && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-700 text-white">
              Out of Stock
            </span>
          )}
          {isDiscounted && product.isInStock && (
            <span className="px-2 py-1 bg-red-700 text-white rounded-full text-[12px] font-medium">
              {Math.round(discountPercentage)}% OFF
            </span>
          )}
        </div>
        <div className="absolute top-1 right-1 flex gap-2">
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
              New
            </span>
          )}
        </div>

        <div className="absolute bottom-0 right-0 flex gap-2">
          {product.isMostSelling && (
            <span className="px-3 py-1 text-xs flex items-center font-semibold rounded-md bg-red-700 text-white">
              <FaStar className="text-yellow-400 pr-[2px]" /> Most Selling
            </span>
          )}
        </div>
      </div>

      <div className="p-2">
        <h3 className="font-light text-sm text-ellipsis line-clamp-3">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 my-2">
          <span
            className={`text-md font-normal ${
              isDiscounted ? "text-red-600" : "text-black"
            }`}
          >
            ₹{getDisplayPrice()}
          </span>
          {isDiscounted && (
            <span className="text-sm text-gray-500 line-through">
              ₹{getOriginalPrice()}
            </span>
          )}
        </div>
      
      </div>

      {isStoreOwner && (
        <div className="flex h-12 items-center justify-center w-full px-3">
          <div className="flex gap-3 bottom-0 py-4 absolute items-center justify-center w-full px-3">
            <button
              onClick={(e) => {
                handleDelete(e);
              }}
              className="flex items-center justify-center bg-red-600  py-2 px-3 w-full rounded-md text-white gap-1"
            >
              <Trash className="w-4 h-4" />
              <span className="hidden sm:flex">Delete</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/store/${storeId}/edit/${product.id}`);
              }}
              className="flex items-center justify-center bg-gray-500 w-full py-2 px-3 rounded-md text-white gap-1"
            >
              <PencilIcon className="w-4 h-4" />
              <span className="hidden sm:flex">Edit</span>
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="mb-4 text-lg font-semibold">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={(e) => confirmDelete(e)}
                className="px-4 py-2 rounded bg-red-600 text-white"
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
