"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, Share2, Star } from 'lucide-react';
import { getUserId } from '@/helpers/getUserId';
import { db } from '@/lib/fireabase';

interface ProductData {
  name: string;
  description: string;
  regularPrice: number;
  discountPrice?: number;
  rating: number;
  totalReviews: number;
  images: string[];
  features: string[];
  inStock: boolean;
}

const ProductPage: React.FC = () => {
  const { storeId, productId } = useParams();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      if (storeId) {
        const id = await getUserId(storeId as string);
        setUserId(id);
      }
    };
    fetchUserId();
  }, [storeId]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!userId || !productId) return;
      try {
        const productRef = doc(db, userId, productId as string);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProductData(productSnap.data() as ProductData);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [userId, productId]);

  // Image navigation functions
  const nextImage = () => {
    if (productData?.images) {
      setCurrentImageIndex((prev) =>
        prev === productData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (productData?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? productData.images.length - 1 : prev - 1
      );
    }
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (productData?.regularPrice && productData?.discountPrice) {
      const discount =
        ((productData.regularPrice - productData.discountPrice) / productData.regularPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  // Rating Stars Component
  const RatingStars: React.FC<{ rating: number; totalReviews: number }> = ({
    rating = 4.5,
    totalReviews = 128,
  }) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Product not found</h2>
        <p className="mt-2 text-gray-600">
          The product you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-32 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Section */}
        <div className="space-y-4">

          <div className="relative rounded-lg overflow-hidden shadow-md w-full h-96 bg-gray-200 flex items-center justify-center">
            {productData.images && productData.images.length > 0 ? (
              <>
                <img
                  src={productData.images[currentImageIndex]}
                  alt={productData.name}
                  className="object-contain h-full w-full transition-transform duration-300 ease-in-out"
                />
                {productData.images.length > 1 && ( // Only show buttons if there's more than one image
                  <div className="absolute inset-0 flex justify-between items-center px-4">
                    <button
                      onClick={prevImage}
                      className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-105"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-105"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>


          {/* Thumbnail Preview */}
          {productData.images && productData.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {productData.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`cursor-pointer w-16 h-16 rounded-lg overflow-hidden transition-all ${currentImageIndex === index ? 'ring-2 ring-indigo-500' : ''
                    }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-4">
          {productData.inStock && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              In Stock
            </span>
          )}
          <h1 className="md:text-3xl text-lg font-semibold text-gray-950">{productData.name}</h1>
          <RatingStars rating={productData.rating} totalReviews={productData.totalReviews} />

          {/* Pricing */}
          <div className="flex items-center gap-2">
            {productData.discountPrice ? (
              <>
                <span className="md:text-3xl text-lg font-bold text-gray-900">
                  ₹{productData.discountPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{productData.regularPrice}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                  {calculateDiscount()}% OFF
                </span>
              </>
            ) : (
              <span className="md:text-3xl text-lg font-bold text-gray-900">
                ₹{productData.regularPrice}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
            {productData.description}
          </p>

          {/* Actions */}
          <div className="flex gap-4 mt-4">
            <button className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-shadow hover:shadow-lg">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Features */}
          {productData.features && (
            <div className="mt-6 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Product Features</h3>
              <ul className="space-y-1 text-gray-600">
                {productData.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
