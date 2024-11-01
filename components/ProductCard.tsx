"use client"

import { ProductType } from "@/type";
import { useRouter } from "next/navigation";


interface ProductCardProps {
    product: ProductType;
    storeId: string;
}


const ProductCard = ({ product, storeId }: ProductCardProps) => {


    const router = useRouter()


    const calculateDiscount = () => {
        if (product?.regularPrice && product?.discountPrice) {
            const discount =
                ((product.regularPrice - product.discountPrice) / product.regularPrice) * 100;
            return Math.round(discount);
        }
        return 0;
    };


    return (
        <div onClick={() => router.push(`/store/${storeId}/${product.id}`)} className="cursor-pointer w-full rounded-md border border-gray-200 bg-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg">
            {/* Image Section */}
            <div className="relative">
                <img
                    src={product.images[0]}
                    alt="Image"
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-1 left-1 flex gap-2">
                   
                    {!product.isInStock && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                            Out of Stock
                        </span>
                    )}
                    {product.regularPrice > product.discountPrice && product.isInStock && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-[12px] font-medium">
                            {calculateDiscount()}% OFF
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
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-800">
                        {product?.category}
                    </span>

                </div>

                <h3 className="font-light text-sm text-ellipsis line-clamp-3">{product.name}</h3>
                <div className="flex items-center text-xl text-yellow-500">
                    {'★'.repeat(Math.floor(3))}
                    {'☆'.repeat(5 - Math.floor(3))}
                    <span className="ml-1 text-gray-600 text-xs">({14})</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-md font-normal">₹{product?.regularPrice}</span>
                    {product?.regularPrice > product?.discountPrice && (
                        <>
                            <span className="text-sm text-gray-500 line-through">
                                ₹{product?.regularPrice}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;