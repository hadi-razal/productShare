"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProduct, incrementProductViews } from "@/lib/db";
import {
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiX,
  FiEdit2,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { getUserId } from "@/helpers/getUserId";
import { onAuthChange } from "@/lib/auth";
import { ProductType } from "@/type";

interface ProductPageProps {
  productId: string;
  storeId: string;
  initialProduct?: ProductType | null;
  initialUserId?: string | null;
  storeName?: string | null;
  storeWhatsapp?: string | null;
}

const formatPrice = (value: number) =>
  `RS. ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const whatsappDigits = (value?: string | null) => {
  const digits = (value || "").replace(/\D/g, "");
  return digits || "919074063723";
};

const ProductSkeleton = () => (
  <div className="min-h-screen w-full bg-white pb-16 pt-24">
    <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
      <div className="mb-8 h-3 w-28 bg-neutral-100 animate-pulse" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="aspect-square w-full bg-neutral-100 animate-pulse" />
          <div className="mt-3 flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 w-16 bg-neutral-100 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-1">
          <div className="h-3 w-20 bg-neutral-100 animate-pulse" />
          <div className="h-7 w-3/4 bg-neutral-100 animate-pulse" />
          <div className="h-4 w-28 bg-neutral-100 animate-pulse" />
          <div className="h-12 w-full bg-neutral-100 animate-pulse" />
          <div className="space-y-2 pt-6">
            <div className="h-3 w-full bg-neutral-100 animate-pulse" />
            <div className="h-3 w-5/6 bg-neutral-100 animate-pulse" />
            <div className="h-3 w-2/3 bg-neutral-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductPage = ({
  productId,
  storeId,
  initialProduct = null,
  initialUserId = null,
  storeName = null,
  storeWhatsapp = null,
}: ProductPageProps) => {
  const [productData, setProductData] = useState<ProductType | null>(initialProduct);
  const [loading, setLoading] = useState<boolean>(!initialProduct);
  const [userId, setUserId] = useState<string | null>(initialUserId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [mainImgLoaded, setMainImgLoaded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const mediaArray = useMemo(() => {
    if (!productData) return [];
    const media: { type: "video" | "image"; src: string; alt: string }[] = [];
    if (productData.video) {
      media.push({ type: "video", src: productData.video, alt: "Product Video" });
    }
    productData.images?.forEach((image, index) => {
      media.push({
        type: "image",
        src: image,
        alt: `${productData.name} - Image ${index + 1}`,
      });
    });
    return media;
  }, [productData]);

  const addProductCount = useCallback(
    async (resolvedUserId?: string | null) => {
      if (typeof window === "undefined") return;
      const userID = resolvedUserId ?? userId ?? (await getUserId(storeId));
      const isCounted = sessionStorage.getItem(`MyShop_Product_${productId}_View`);
      if (userID && !isCounted) {
        await incrementProductViews(productId);
        sessionStorage.setItem(`MyShop_Product_${productId}_View`, "true");
      }
    },
    [productId, storeId, userId],
  );

  useEffect(() => {
    if (initialProduct) {
      setProductData(initialProduct);
      setUserId(initialUserId);
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const id = await getUserId(storeId);
        setUserId(id);
        if (id) {
          const product = await getProduct(id, productId);
          if (product) setProductData(product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [initialProduct, initialUserId, productId, storeId]);

  useEffect(() => {
    void addProductCount(initialUserId ?? userId);
  }, [addProductCount, initialUserId, productId, storeId, userId]);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setIsOwner(!!(user && userId && user.uid === userId));
    });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    setMainImgLoaded(false);
  }, [currentImageIndex]);

  useEffect(() => {
    if (!productData) return;
    if (!selectedColor && productData.colors?.[0]) {
      setSelectedColor(productData.colors[0]);
    }
    if (!selectedSize && productData.sizes?.[0]) {
      setSelectedSize(productData.sizes[0]);
    }
  }, [productData, selectedColor, selectedSize]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      mediaArray.length ? (prev === mediaArray.length - 1 ? 0 : prev + 1) : 0,
    );
  }, [mediaArray.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      mediaArray.length ? (prev === 0 ? mediaArray.length - 1 : prev - 1) : 0,
    );
  }, [mediaArray.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setZoomOpen(false);
        setShareOpen(false);
      }
      if (mediaArray.length < 2) return;
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mediaArray.length, nextImage, prevImage]);

  const regularPrice = Number(productData?.regularPrice);
  const discountPrice = Number(productData?.discountPrice);
  const isDiscounted =
    Number.isFinite(regularPrice) &&
    Number.isFinite(discountPrice) &&
    regularPrice > 0 &&
    discountPrice >= 0 &&
    discountPrice < regularPrice;
  const displayPrice = isDiscounted ? discountPrice : regularPrice;
  const discountPercent = isDiscounted
    ? Math.round(((regularPrice - discountPrice) / regularPrice) * 100)
    : 0;

  const productMessage = () => {
    if (!productData) return "";
    const lines = [
      `Hi, I'm interested in:`,
      `*${productData.name}*`,
      `Price: ${Number.isFinite(displayPrice) ? formatPrice(displayPrice) : ""}`,
    ];
    if (selectedColor) lines.push(`Color: ${selectedColor}`);
    if (selectedSize) lines.push(`Size: ${selectedSize}`);
    lines.push(currentUrl);
    return lines.filter(Boolean).join("\n");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnPlatform = (platform: string) => {
    if (!productData) return;
    const message = productMessage();
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank");
  };

  const handleEnquire = () => {
    const message = productMessage();
    window.open(
      `https://wa.me/${whatsappDigits(storeWhatsapp)}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  if (loading) return <ProductSkeleton />;

  if (!productData) {
    return (
      <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-white pt-24">
        <h2 className="text-sm uppercase tracking-wide text-neutral-500">
          Product not found
        </h2>
      </div>
    );
  }

  const currentMedia = mediaArray[currentImageIndex];
  const inStock = productData.isInStock !== false;

  return (
    <div className="min-h-screen w-full bg-white pb-16 pt-24">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <Link
          href={`/store/${storeId}`}
          className="mb-8 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400 hover:text-black"
        >
          <FiChevronLeft className="h-3.5 w-3.5" />
          {storeName || "Back to catalog"}
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
              {mediaArray.length > 0 ? (
                currentMedia.type === "video" ? (
                  <video
                    src={currentMedia.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    {!mainImgLoaded && (
                      <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
                    )}
                    <Image
                      src={currentMedia.src}
                      alt={currentMedia.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={80}
                      unoptimized
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+"
                      className={`cursor-zoom-in object-cover transition-opacity duration-300 ${
                        mainImgLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setMainImgLoaded(true)}
                      onClick={() => setZoomOpen(true)}
                      priority={currentImageIndex === 0}
                    />
                  </>
                )
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  No image
                </div>
              )}

              {mediaArray.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 text-black hover:bg-white"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 text-black hover:bg-white"
                    aria-label="Next image"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 text-[10px] tracking-wide text-white">
                    {currentImageIndex + 1} / {mediaArray.length}
                  </div>
                </>
              )}
            </div>

            {mediaArray.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {mediaArray.map((media, i) => (
                  <button
                    key={`${media.src}-${i}`}
                    type="button"
                    onClick={() => setCurrentImageIndex(i)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden bg-neutral-100 ${
                      i === currentImageIndex
                        ? "ring-1 ring-black"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    {media.type === "video" ? (
                      <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wide text-neutral-500">
                        Video
                      </div>
                    ) : (
                      <Image
                        src={media.src}
                        alt={`Thumbnail ${i + 1}`}
                        width={64}
                        height={64}
                        quality={40}
                        unoptimized
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            {productData.category && (
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                {productData.category}
              </p>
            )}

            <h1 className="mt-2 text-[22px] font-bold uppercase leading-snug tracking-tight text-black md:text-[26px]">
              {productData.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[15px] text-black">
                {Number.isFinite(displayPrice) ? formatPrice(displayPrice) : "RS. 0.00"}
              </span>
              {isDiscounted && (
                <>
                  <span className="text-[13px] text-neutral-400 line-through">
                    {formatPrice(regularPrice)}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-neutral-500">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>

            <p
              className={`mt-3 text-[11px] uppercase tracking-[0.16em] ${
                inStock ? "text-neutral-500" : "text-neutral-400"
              }`}
            >
              {inStock ? "In stock" : "Out of stock"}
            </p>

            {productData.colors?.length > 0 && (
              <div className="mt-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Color{selectedColor ? ` — ${selectedColor}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {productData.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`h-8 w-8 border ${
                        selectedColor === color ? "border-black" : "border-neutral-200"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {productData.sizes?.length > 0 && (
              <div className="mt-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Size
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {productData.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] px-3 py-2 text-sm ${
                        selectedSize === size
                          ? "border border-black text-black"
                          : "border border-neutral-200 text-neutral-500 hover:border-black hover:text-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleEnquire}
                className="inline-flex w-full items-center justify-center gap-2 bg-black py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white hover:bg-neutral-800"
              >
                <FaWhatsapp className="h-4 w-4" />
                Enquire on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 border border-black py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-black hover:bg-black hover:text-white"
              >
                <FiShare2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {productData.isFreeDelivery && (
              <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                Free delivery available
              </p>
            )}

            {productData.description && (
              <div className="mt-10 border-t border-neutral-200 pt-8">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                  Details
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {productData.description}
                </p>
              </div>
            )}

            {isOwner && (
              <div className="mt-10 flex items-center gap-5 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                <span>{productData.views || 0} views</span>
                <Link
                  href={`/store/${storeId}/edit/${productId}`}
                  className="inline-flex items-center gap-1 hover:text-black"
                >
                  <FiEdit2 className="h-3 w-3" />
                  Edit
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[12px] font-medium uppercase tracking-[0.16em] text-black">
                Share this product
              </h3>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { id: "whatsapp", label: "WhatsApp" },
                { id: "facebook", label: "Facebook" },
                { id: "twitter", label: "X / Twitter" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => shareOnPlatform(item.id)}
                  className="w-full border border-neutral-200 py-3 text-[12px] uppercase tracking-[0.16em] text-black hover:border-black"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full bg-black py-3 text-[12px] uppercase tracking-[0.16em] text-white"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomOpen && currentMedia?.type === "image" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 text-white"
            aria-label="Close"
          >
            <FiX className="h-6 w-6" />
          </button>
          {mediaArray.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
                aria-label="Previous image"
              >
                <FiChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                aria-label="Next image"
              >
                <FiChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          <div
            className="relative h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentMedia.src}
              alt={currentMedia.alt}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
