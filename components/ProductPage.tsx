"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import {
  FiFacebook,
  FiTwitter,
  FiShoppingCart,
  FiShare2,
  FiX,
} from "react-icons/fi";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { getUserId } from "@/helpers/getUserId";
import { auth, db } from "@/lib/firebase";
import { ProductType } from "@/type";
import Head from "next/head";
import Image from "next/image";
import { ChevronLeft, ChevronRight, EyeIcon, Info, Truck } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

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
  const [isOwner, setIsOwner] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Create media array with video first (if exists), then images
  const getMediaArray = () => {
    if (!productData) return [];
    
    const mediaArray = [];
    
    // Add video first if it exists
    if (productData.video) {
      mediaArray.push({
        type: 'video',
        src: productData.video,
        alt: 'Product Video'
      });
    }
    
    // Add images
    if (productData.images?.length > 0) {
      productData.images.forEach((image, index) => {
        mediaArray.push({
          type: 'image',
          src: image,
          alt: `${productData.name} - Image ${index + 1}`
        });
      });
    }
    
    return mediaArray;
  };

  const mediaArray = getMediaArray();

  const addProductCount = async () => {
    const userID = await getUserId(storeId as string);

    const isCounted = sessionStorage.getItem(
      `MyShop_Product_${productId}_View`
    );

    if (userID && !isCounted) {
      const ProductDocRef = doc(db, "users", userID, "products", productId);
      await updateDoc(ProductDocRef, {
        views: increment(1),
      });
      sessionStorage.setItem(`MyShop_Product_${productId}_View`, "true");
    }
  };

  // To get total views of the product visible only for the store owner
  useEffect(() => {
    addProductCount();
    const fetchUserId = async () => {
      if (storeId) {
        const id = await getUserId(storeId);
        setUserId(id);
      }
    };

    fetchUserId();
  }, [storeId, productId]);

  // Separate useEffect for auth state monitoring
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && userId) {
        setIsOwner(userId === user?.uid);
      } else {
        setIsOwner(false);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!userId || !productId) return;
      try {
        const productRef = doc(db, "users", userId, "products", productId);
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
    if (mediaArray.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === mediaArray.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (mediaArray.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? mediaArray.length - 1 : prev - 1
      );
    }
  };

  const calculateDiscount = () => {
    if (productData?.regularPrice && productData?.discountPrice) {
      const discount =
        ((productData.regularPrice - productData.discountPrice) /
          productData.regularPrice) *
        100;
      return Math.round(discount);
    }
    return 0;
  };

  const handleShare = () => {
    setModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy link: ", error));
  };

  const closeModal = () => setModalOpen(false);

  const shareOnPlatform = (platform: string) => {
    if (productData) {
      const message = `Check out this product:\n\n*${
        productData.name
      }*\nPrice: ₹${productData.discountPrice || productData.regularPrice}\n\n${
        productData.description || "No description available."
      }\n\n*${currentUrl}*`;
      let shareUrl = "";

      if (platform === "facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}&quote=${encodeURIComponent(message)}`;
      } else if (platform === "twitter") {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message
        )}`;
      } else if (platform === "whatsapp") {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          message
        )}`;
      }
      window.open(shareUrl, "_blank");
    }
  };

  const handleLiveChat = () => {
    if (productData) {
      const message = `Hi, I'm interested in purchasing:\n\n*${
        productData.name
      }*\nPrice: ₹${
        productData.discountPrice || productData.regularPrice
      }\n\n*${currentUrl}*`;
      const whatsappUrl = `https://wa.me/919074063723?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-90px)]">
        <p className="text-lg text-gray-400 animate-pulse">
          Loading product details...
        </p>
      </div>
    );

  if (!productData)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-90px)]">
        <h2 className="text-2xl font-semibold text-gray-800">
          Product not found
        </h2>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl pt-4">
      <Head>
        <title>{productData.name}</title>
        <meta property="og:title" content={productData.name} />
        <meta
          property="og:image"
          content={productData.images?.[0] || "/default-image.jpg"}
        />
        <meta
          property="og:description"
          content={productData.description || "Check out this product!"}
        />
      </Head>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-10">
        {/* Product Media (Video/Images) */}
        <div className="space-y-4 rounded-md relative">
          <div className="relative rounded-md overflow-hidden w-full h-96 bg-gray-100">
            {mediaArray.length > 0 ? (
              mediaArray[currentImageIndex].type === 'video' ? (
                <video
                  src={mediaArray[currentImageIndex].src}
                  autoPlay
                  muted
                  loop
                  
                  className="rounded-md w-full h-full object-cover"
                  style={{ background: "#f3f4f6" }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={mediaArray[currentImageIndex].src}
                  alt={mediaArray[currentImageIndex].alt}
                  layout="fill"
                  className="rounded-md"
                  objectFit="contain"
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No media available</p>
              </div>
            )}

            {/* Navigation arrows - only show if more than 1 media item */}
            {mediaArray.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail gallery */}
          {mediaArray.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mediaArray.map((media, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 ml-1 my-2 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    i === currentImageIndex 
                      ? "ring-2 ring-blue-500 border-blue-500" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {media.type === 'video' ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={media.src}
                      alt={`Thumbnail ${i + 1}`}
                      width={64}
                      height={64}
                      objectFit="contain"
                      className="w-full h-full"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          {isOwner && (
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <EyeIcon className="text-blue-600 w-4 h-4" />
              <span className="text-sm font-semibold text-blue-600">
                {productData.views || 0} Views
              </span>
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900">{productData.name}</h1>

          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold ">
              ₹{productData.discountPrice || productData.regularPrice}
            </span>
            {productData.discountPrice && (
              <>
                <span className="line-through text-gray-500 text-lg">
                  ₹{productData.regularPrice}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                  {calculateDiscount()}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex gap-2 items-center bg-gray-100 p-3 rounded-lg">
            <Truck className=" w-5 h-5" />
            <span className="text-sm font-medium ">
              Free Delivery Available
            </span>
          </div>

          {productData.colors && productData.colors.length > 0 && (
            <div className="space-y-3">
              <span className="block text-sm font-semibold text-gray-700">
                Available Colors
              </span>
              <div className="flex items-center flex-wrap gap-2">
                {productData.colors.map((color, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: color }}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform shadow-sm"
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {productData.sizes && productData.sizes.length > 0 && (
            <div className="space-y-3">
              <span className="block text-sm font-semibold text-gray-700">
                Available Sizes
              </span>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((size, index) => (
                  <button
                    key={index}
                    type="button"
                    className="px-4 py-2 border-2 border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleLiveChat}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2 justify-center text-white py-3 px-6 rounded-md font-medium transition-colors flex-1"
            >
              <FaWhatsapp className="text-white w-5 h-5" />
              Live Chat
            </button>
            <button
              className="flex border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 items-center gap-2 justify-center py-3 px-4 rounded-md font-medium transition-colors"
              onClick={handleShare}
            >
              <FiShare2 className="text-gray-700 w-5 h-5" />
            </button>
          </div>

          {productData.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {productData.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-xl w-96 max-w-[90vw] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Share this product
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 justify-center">
                <button
                  onClick={() => shareOnPlatform("facebook")}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share on Facebook"
                >
                  <FiFacebook className="w-6 h-6" />
                </button>
                <button
                  onClick={() => shareOnPlatform("twitter")}
                  className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors"
                  title="Share on Twitter"
                >
                  <FiTwitter className="w-6 h-6" />
                </button>
                <button
                  onClick={() => shareOnPlatform("whatsapp")}
                  className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleCopyLink}
                className={`text-sm flex items-center justify-center w-full gap-2 px-6 py-3 rounded-lg border transition-colors ${
                  copied
                    ? "bg-green-100 border-green-200 text-green-700"
                    : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;