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
import Image from "next/image";
import { ChevronLeft, ChevronRight, EyeIcon, Truck } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

interface ProductPageProps {
  productId: string;
  storeId: string;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const ProductSkeleton = () => (
  <div className="container mx-auto px-4 py-4 max-w-7xl animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
      {/* Left — image */}
      <div className="space-y-3">
        <div className="w-full h-96 bg-gray-200 rounded-2xl" />
        {/* Thumbnails row */}
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>
      {/* Right — details */}
      <div className="space-y-4 pt-2">
        <div className="h-7 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-7 w-1/3 bg-gray-200 rounded-full" />
        <div className="h-12 w-full bg-gray-200 rounded-xl" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-gray-200 rounded-full" />
          <div className="h-4 w-5/6 bg-gray-200 rounded-full" />
          <div className="h-4 w-4/6 bg-gray-200 rounded-full" />
        </div>
        <div className="flex gap-3 pt-4">
          <div className="h-12 flex-1 bg-gray-200 rounded-xl" />
          <div className="h-12 w-14 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const ProductPage: React.FC<ProductPageProps> = ({ productId, storeId }) => {
  const [productData, setProductData] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const getMediaArray = () => {
    if (!productData) return [];
    const mediaArray: { type: string; src: string; alt: string }[] = [];
    if (productData.video) {
      mediaArray.push({ type: "video", src: productData.video, alt: "Product Video" });
    }
    productData.images?.forEach((image, index) => {
      mediaArray.push({ type: "image", src: image, alt: `${productData.name} - Image ${index + 1}` });
    });
    return mediaArray;
  };

  const mediaArray = getMediaArray();

  const addProductCount = async () => {
    if (typeof window === "undefined") return;
    const userID = await getUserId(storeId);
    const isCounted = sessionStorage.getItem(`MyShop_Product_${productId}_View`);
    if (userID && !isCounted) {
      await updateDoc(doc(db, "users", userID, "products", productId), { views: increment(1) });
      sessionStorage.setItem(`MyShop_Product_${productId}_View`, "true");
    }
  };

  // Single combined fetch — no waterfall
  useEffect(() => {
    const init = async () => {
      try {
        const id = await getUserId(storeId);
        setUserId(id);
        if (id) {
          const productSnap = await getDoc(doc(db, "users", id, "products", productId));
          if (productSnap.exists()) {
            setProductData(productSnap.data() as ProductType);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    addProductCount();
    init();
  }, [storeId, productId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsOwner(!!(user && userId && user.uid === userId));
    });
    return () => unsubscribe();
  }, [userId]);

  // Reset image loaded state when switching images
  useEffect(() => {
    setMainImgLoaded(false);
  }, [currentImageIndex]);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === mediaArray.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? mediaArray.length - 1 : prev - 1));

  const calculateDiscount = () => {
    if (productData?.regularPrice && productData?.discountPrice) {
      return Math.round(((productData.regularPrice - productData.discountPrice) / productData.regularPrice) * 100);
    }
    return 0;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnPlatform = (platform: string) => {
    if (!productData) return;
    const message = `Check out this product:\n\n*${productData.name}*\nPrice: ₹${productData.discountPrice || productData.regularPrice}\n\n${productData.description || ""}\n\n*${currentUrl}*`;
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank");
  };

  const handleLiveChat = () => {
    if (!productData) return;
    const message = `Hi, I'm interested in purchasing:\n\n*${productData.name}*\nPrice: ₹${productData.discountPrice || productData.regularPrice}\n\n*${currentUrl}*`;
    window.open(`https://wa.me/919074063723?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) return <ProductSkeleton />;

  if (!productData)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-90px)]">
        <h2 className="text-xl font-semibold text-gray-600">Product not found</h2>
      </div>
    );

  const currentMedia = mediaArray[currentImageIndex];

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">

        {/* ── Media column ── */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden w-full h-96 bg-gray-100">
            {mediaArray.length > 0 ? (
              currentMedia.type === "video" ? (
                <video
                  src={currentMedia.src}
                  autoPlay muted loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  {/* Shimmer while main image loads */}
                  {!mainImgLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
                  )}
                  <Image
                    src={currentMedia.src}
                    alt={currentMedia.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                    className={`object-contain transition-opacity duration-300 ${mainImgLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setMainImgLoaded(true)}
                    priority={currentImageIndex === 0}
                  />
                </>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No media available
              </div>
            )}

            {/* Nav arrows */}
            {mediaArray.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Image counter */}
            {mediaArray.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                {currentImageIndex + 1} / {mediaArray.length}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {mediaArray.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {mediaArray.map((media, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === currentImageIndex
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {media.type === "video" ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                    </div>
                  ) : (
                    <Image
                      src={media.src}
                      alt={`Thumbnail ${i + 1}`}
                      width={64}
                      height={64}
                      quality={60}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details column ── */}
        <div className="space-y-4">
          {isOwner && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold">
              <EyeIcon className="w-4 h-4" />
              {productData.views || 0} Views
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900 leading-snug">{productData.name}</h1>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold text-gray-900">
              ₹{productData.discountPrice || productData.regularPrice}
            </span>
            {productData.discountPrice && (
              <>
                <span className="line-through text-gray-400 text-lg">₹{productData.regularPrice}</span>
                <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-sm font-semibold">
                  {calculateDiscount()}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 bg-green-50 border border-green-100 p-3 rounded-xl">
            <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium text-green-700">Free Delivery Available</span>
          </div>

          {productData.colors && productData.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">Available Colors</span>
              <div className="flex items-center flex-wrap gap-2">
                {productData.colors.map((color, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: color }}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform ring-1 ring-gray-200"
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {productData.sizes && productData.sizes.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-semibold text-gray-700">Available Sizes</span>
              <div className="flex flex-wrap gap-2">
                {productData.sizes.map((size, index) => (
                  <button
                    key={index}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl bg-white text-gray-700 hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleLiveChat}
              className="flex-1 bg-green-500 hover:bg-green-600 flex items-center gap-2 justify-center text-white py-3 px-6 rounded-xl font-semibold transition-colors shadow-sm"
            >
              <FaWhatsapp className="w-5 h-5" />
              Live Chat
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 justify-center border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-xl font-medium transition-colors"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>

          {productData.description && (
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {productData.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Share Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[90vw] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Share this product</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-4 justify-center mb-6">
              <button
                onClick={() => shareOnPlatform("facebook")}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
                title="Share on Facebook"
              >
                <FiFacebook className="w-6 h-6" />
              </button>
              <button
                onClick={() => shareOnPlatform("twitter")}
                className="bg-sky-400 text-white p-3 rounded-xl hover:bg-sky-500 transition-colors"
                title="Share on Twitter"
              >
                <FiTwitter className="w-6 h-6" />
              </button>
              <button
                onClick={() => shareOnPlatform("whatsapp")}
                className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors"
                title="Share on WhatsApp"
              >
                <FaWhatsapp className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className={`w-full text-sm flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all font-medium ${
                copied
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              {copied ? "✓ Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
