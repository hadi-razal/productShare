"use client";

import { ProductType } from "@/type";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: ProductType;
  storeId: string;
}

const ProductCard = ({ product, storeId }: ProductCardProps) => {
  const router = useRouter();

  const calculateDiscount = (): number => {
    // Ensure both prices are valid numbers and greater than 0
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
      // Round to 1 decimal place for more accurate display
      return Number(discount.toFixed(1));
    }
    return 0;
  };

  // Calculate once to avoid multiple calculations
  const discountPercentage = calculateDiscount();
  
  // Check if there's a valid discount
  const isDiscounted = discountPercentage > 0;
  
  // Safely get the display price
  const getDisplayPrice = () => {
    if (isDiscounted) {
      return Number(product?.discountPrice).toLocaleString('en-IN');
    }
    return Number(product?.regularPrice).toLocaleString('en-IN');
  };

  // Format the original price for display
  const getOriginalPrice = () => {
    return Number(product?.regularPrice).toLocaleString('en-IN');
  };

  return (
    <div
      onClick={() => router.push(`/store/${storeId}/${product.id}`)}
      className="cursor-pointer relative w-full rounded-md border bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-lg"
    >
      {/* Image Section */}
      <div className="relative">
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
      </div>

      {/* Content Section */}
      <div className="p-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-4 py-1 text-xs font-normal rounded-md bg-gray-200 text-gray-950">
            {product?.category}
          </span>
        </div>
        <h3 className="font-light text-sm text-ellipsis line-clamp-3">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 my-2">
          <span className={`text-md font-normal ${isDiscounted ? 'text-red-600' : 'text-black'}`}>
            ₹{getDisplayPrice()}
          </span>
          {isDiscounted && (
            <span className="text-sm text-gray-500 line-through">
              ₹{getOriginalPrice()}
            </span>
          )}
        </div>
      </div>

      <div className="absolute bottom-2 right-2 flex gap-2">
        {product.isBestSelling && (
          <span className="px-2 py-1 w-10 text-[8px] flex items-center justify-center text-center h-10 font-bold rounded-full bg-gray-700 text-white">
            Best Selling
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;