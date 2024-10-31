"use client"

import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        description: string;
        category: string;
        images: string[];
        regularPrice: number;
        discountPrice: number;
        isNew: boolean;
        isInStock: boolean;
        rating: number;
        ratingCount: number;
    };
}

const ProductCard = ({ product }: ProductCardProps) => {


    const router = useRouter()


    return (
        <div onClick={()=>router.push(`/123/${product.id}`)} className="cursor-pointer w-full rounded-md border border-gray-200 bg-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg">
            {/* Image Section */}
            <div className="relative">
                <img
                    src={product.images[0]}
                    alt="Image"
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                    {product.isNew && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                            New
                        </span>
                    )}
                    {!product.isInStock && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                            Out of Stock
                        </span>
                    )}
                </div>

            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-800">
                        {product?.category}
                    </span>

                </div>

                <h3 className="font-medium text-ellipsis line-clamp-1">{product.name}</h3>
                <div className="flex items-center text-xl text-yellow-500">
                    {'★'.repeat(Math.floor(3))}
                    {'☆'.repeat(5 - Math.floor(3))}
                    <span className="ml-1 text-gray-600 text-xs">({14})</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-normal">₹{product?.regularPrice}</span>
                    {product?.regularPrice > product?.discountPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            ₹{product?.regularPrice}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;