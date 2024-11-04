"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { ShoppingCart, Star, Truck } from 'lucide-react';
import { getUserId } from '@/helpers/getUserId';
import { db } from '@/lib/firebase';
import { ProductType } from '@/type';
import Head from 'next/head';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductPageProps {
  productId: string;
  storeId: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ productId, storeId }) => {
  const [productData, setProductData] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [displayReviewInput, setDisplayReviewInput] = useState<boolean>(false);
  const [reviewInput, setReviewInput] = useState({ user: "", review: "", stars: "" });

  useEffect(() => {
    const fetchUserId = async () => {
      if (storeId) {
        const id = await getUserId(storeId);
        setUserId(id);
      }
    };
    fetchUserId();
  }, [storeId]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!userId || !productId) return;
      try {
        const productRef = doc(db, userId, productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProductData(productSnap.data() as ProductType);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [userId, productId]);

  const nextImage = () => {
    if (productData?.images) {
      setCurrentImageIndex((prev) => prev === productData.images.length - 1 ? 0 : prev + 1);
    }
  };

  const prevImage = () => {
    if (productData?.images) {
      setCurrentImageIndex((prev) => prev === 0 ? productData.images.length - 1 : prev - 1);
    }
  };

  const calculateDiscount = () => {
    if (productData?.regularPrice && productData?.discountPrice) {
      const discount = ((productData.regularPrice - productData.discountPrice) / productData.regularPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const RatingStars: React.FC<{ rating: number; totalReviews?: number }> = ({
    rating = 4.5,
    totalReviews = 128,
  }) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
    </div>
  );

  if (loading) return <p className="text-gray-500">Loading product details...</p>;

  if (!productData) return <h2 className="text-2xl font-semibold text-gray-800">Product not found</h2>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl pt-32">
      <Head>
        <title>{productData.name}</title>
        <meta property="og:title" content={productData.name} />
        <meta property="og:image" content={productData.images?.[0] || "/default-image.jpg"} />
        <meta property="og:description" content={productData.description || "Check out this product!"} />
      </Head>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Product Images */}
        <div className="space-y-4 relative">
          <div className="relative rounded-lg overflow-hidden w-full h-96">
            {productData.images?.[currentImageIndex] ? (
              <Image src={productData.images[currentImageIndex]} alt={productData.name} layout="fill" objectFit="contain" />
            ) : (
              <p>No image available</p>
            )}
            <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {productData.images?.map((img, i) => (
              <div key={i} onClick={() => setCurrentImageIndex(i)} className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer ${i === currentImageIndex ? 'ring-2 ring-gray-800' : ''}`}>
                <Image src={img} alt={`Thumbnail ${i}`} width={64} height={64} objectFit="cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">

          {productData.isInStock === true && (
            <div className="flex items-center">
              <Truck className="text-gray-500" />
              <span className="ml-2 text-gray-500 text-sm font-semibold">Free Delivery All Over India</span>
            </div>
          )}



          {productData.isInStock === false && <p className="text-red-600">Out of Stock</p>}

          <h1 className="text-3xl font-semibold">{productData.name}</h1>
          <RatingStars rating={productData.rating} totalReviews={productData.totalReviews} />

          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold">₹{productData.discountPrice || productData.regularPrice}</span>
            {productData.discountPrice && <span className="line-through text-gray-500">₹{productData.regularPrice}</span>}
            {productData.discountPrice && <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">{calculateDiscount()}% OFF</span>}
          </div>


          {/* CTA Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="bg-indigo-700 flex items-center gap-2 justify-center text-white py-3 px-6 rounded-lg font-medium">
              <ShoppingCart className='text-white' />
              Buy Now
            </button>
          </div>

          <p className="text-gray-600">{productData.description}</p>


          {/* Review Form */}
          <button onClick={() => setDisplayReviewInput(!displayReviewInput)} className="text-blue-500 mt-6">Leave a Review</button>
          {displayReviewInput && (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <textarea onChange={(e) => setReviewInput({ ...reviewInput, review: e.target.value })} placeholder="Write your review here..." className="w-full border rounded p-2"></textarea>
              <button onClick={() => { }} className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium">Submit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
