"use client";

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FiFacebook, FiTwitter, FiLinkedin, FiShoppingCart, FiShare2, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

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

  const handleShare = () => {
    setModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy link: ", error));
  };

  const closeModal = () => setModalOpen(false);

  const shareOnPlatform = (platform: string) => {
    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`;
    }
    window.open(shareUrl, '_blank');
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

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
              <div key={i} onClick={() => setCurrentImageIndex(i)} className={`w-16 h-16 ml-1 my-2 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer ${i === currentImageIndex ? 'ring-2 ring-gray-500' : ''}`}>
            <Image src={img} alt={`Thumbnail ${i}`} width={64} height={64} objectFit="contain" />
          </div>
          ))}
        </div>

      </div>

      <div className="space-y-4">
        <h1 className="text-xl font-semibold">{productData.name}</h1>

        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold">₹{productData.discountPrice || productData.regularPrice}</span>
          {productData.discountPrice && <span className="line-through text-gray-500">₹{productData.regularPrice}</span>}
          {productData.discountPrice && <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">{calculateDiscount()}% OFF</span>}
        </div>

        <div className="flex gap-4 mt-6">
          <button className="bg-indigo-700 flex items-center gap-2 justify-center text-white py-3 px-6 rounded-lg font-medium">
            <FiShoppingCart className="text-white" />
            Buy Now
          </button>
          <button
            className="flex border bg-gray-300 text-gray-700 items-center gap-2 justify-center py-3 px-6 rounded-lg font-medium"
            onClick={handleShare}
          >
            <FiShare2 className="text-black" />
            Share
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-xl w-96 max-w-[90vw] p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Share this product</h3>
                <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => shareOnPlatform('facebook')} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                    <FiFacebook className="w-6 h-6" />
                  </button>
                  <button onClick={() => shareOnPlatform('twitter')} className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500">
                    <FiTwitter className="w-6 h-6" />
                  </button>
                  <button onClick={() => shareOnPlatform('whatsapp')} className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
                    <FaWhatsapp className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCopyLink}
                  className={`text-sm flex items-center justify-center w-full gap-2 px-6 py-3 bg-gray-100 rounded-lg border transition-colors ${copied ? "bg-green-100 border-green-200 text-green-700" : "hover:bg-gray-200"}`}
                >
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
            </div>
          </div>
        )}
        <p className="text-gray-600 pb-10">{productData.description}</p>
      </div>
    </div>
    </div >
  );
};

export default ProductPage;
