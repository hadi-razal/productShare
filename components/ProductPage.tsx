"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import { cataloguePrice, useCataloguePreferences } from "./catalogue-preferences";
import { ProductType } from "@/type";
import { storeWhatsappDigits } from "@/lib/store-profile";
import { useStorefrontNav } from "@/components/storefront-nav";
import StorefrontImage, { usableMediaSrc } from "@/components/StorefrontImage";

interface ProductPageProps {
  productId: string;
  storeId: string;
  initialProduct?: ProductType | null;
  initialUserId?: string | null;
  storeName?: string | null;
  storeWhatsapp?: string | null;
  isOffline?: boolean;
}



const ProductSkeleton = () => (
  <div className="sf-page w-full pb-16 pt-8">
    <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
      <div className="mb-8 h-3 w-28 animate-pulse" style={{ background: "var(--sf-border)" }} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="aspect-square w-full animate-pulse" style={{ background: "var(--sf-border)" }} />
          <div className="mt-3 flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 w-16 animate-pulse" style={{ background: "var(--sf-border)" }} />
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-1">
          <div className="h-3 w-20 animate-pulse" style={{ background: "var(--sf-border)" }} />
          <div className="h-7 w-3/4 animate-pulse" style={{ background: "var(--sf-border)" }} />
          <div className="h-4 w-28 animate-pulse" style={{ background: "var(--sf-border)" }} />
          <div className="h-12 w-full animate-pulse" style={{ background: "var(--sf-border)" }} />
          <div className="space-y-2 pt-6">
            <div className="h-3 w-full animate-pulse" style={{ background: "var(--sf-border)" }} />
            <div className="h-3 w-5/6 animate-pulse" style={{ background: "var(--sf-border)" }} />
            <div className="h-3 w-2/3 animate-pulse" style={{ background: "var(--sf-border)" }} />
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
  isOffline = false,
}: ProductPageProps) => {
  const nav = useStorefrontNav();
  const preferences = useCataloguePreferences();
  const formatPrice = (value: number) => cataloguePrice(value, preferences.currency);
  const [productData, setProductData] = useState<ProductType | null>(initialProduct);
  const [loading, setLoading] = useState<boolean>(!initialProduct);
  const [userId, setUserId] = useState<string | null>(initialUserId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const mediaArray = useMemo(() => {
    if (!productData) return [];
    const media: { type: "video" | "image"; src: string; alt: string }[] = [];
    (productData.images ?? []).forEach((image, index) => {
      const src = usableMediaSrc(image);
      if (!src) return;
      media.push({
        type: "image",
        src,
        alt: `${productData.name} — ${index + 1}`,
      });
    });
    const video = usableMediaSrc(
      typeof productData.video === "string" ? productData.video : "",
    );
    if (video) {
      media.push({ type: "video", src: video, alt: "Product video" });
    }
    return media;
  }, [productData]);

  const addProductCount = useCallback(
    async (resolvedUserId?: string | null) => {
      if (typeof window === "undefined" || isOffline) return;
      const userID = resolvedUserId ?? userId ?? (await getUserId(storeId));
      const isCounted = sessionStorage.getItem(`MyShop_Product_${productId}_View`);
      if (userID && !isCounted) {
        await incrementProductViews(productId);
        sessionStorage.setItem(`MyShop_Product_${productId}_View`, "true");
      }
    },
    [isOffline, productId, storeId, userId],
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
    setCurrentImageIndex(0);
  }, [productId]);

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
    const number = storeWhatsappDigits(storeWhatsapp);
    if (number.length < 10) return;
    const message = productMessage();
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  if (loading) return <ProductSkeleton />;

  if (!productData) {
    return (
      <div className="sf-page flex min-h-[calc(100vh-90px)] items-center justify-center pt-8">
        <h2 className="sf-muted text-sm uppercase tracking-wide">
          Product not found
        </h2>
      </div>
    );
  }

  const currentMedia = mediaArray[Math.min(currentImageIndex, Math.max(mediaArray.length - 1, 0))];
  const inStock = productData.isInStock !== false;

  return (
    <div className="sf-page w-full pb-16 pt-8">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-5">
        <Link
          href={nav.catalogHref(storeId)}
          className="sf-muted mb-8 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] hover:opacity-80"
        >
          <FiChevronLeft className="h-3.5 w-3.5" />
          {storeName || "Back to catalog"}
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
          <div className="lg:sticky lg:top-8">
            <div
              className="sf-gallery relative aspect-square w-full overflow-hidden"
              style={{
                background: "var(--sf-bg)",
                borderRadius: "var(--sf-radius)",
                border: "1px solid var(--sf-border)",
              }}
            >
              {mediaArray.length > 0 ? (
                currentMedia.type === "video" ? (
                  <video
                    src={currentMedia.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <StorefrontImage
                    src={currentMedia.src}
                    alt={currentMedia.alt}
                    fit="contain"
                    priority={currentImageIndex === 0}
                    className="cursor-zoom-in p-3"
                    onClick={() => setZoomOpen(true)}
                  />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-sm" style={{ color: "var(--sf-muted)" }}>
                  No image
                </div>
              )}

              {mediaArray.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 shadow-sm"
                    style={{ background: "var(--sf-surface)", color: "var(--sf-text)" }}
                    aria-label="Previous image"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 shadow-sm"
                    style={{ background: "var(--sf-surface)", color: "var(--sf-text)" }}
                    aria-label="Next image"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                  <div
                    className="absolute bottom-3 right-3 z-10 rounded-md px-2.5 py-1 text-[10px] font-semibold tracking-wide"
                    style={{ background: "var(--sf-surface)", color: "var(--sf-muted)" }}
                  >
                    {currentImageIndex + 1} / {mediaArray.length}
                  </div>
                </>
              )}
            </div>

            {mediaArray.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {mediaArray.map((media, i) => (
                  <button
                    key={`${media.src}-${i}`}
                    type="button"
                    onClick={() => setCurrentImageIndex(i)}
                    className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden"
                    style={{
                      borderRadius: "var(--sf-radius-sm)",
                      border: `2px solid ${
                        i === currentImageIndex ? "var(--sf-accent)" : "var(--sf-border)"
                      }`,
                      opacity: i === currentImageIndex ? 1 : 0.72,
                      background: "var(--sf-bg)",
                    }}
                    aria-label={`View ${media.type} ${i + 1}`}
                    aria-current={i === currentImageIndex}
                  >
                    {media.type === "video" ? (
                      <div
                        className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wide"
                        style={{ color: "var(--sf-muted)" }}
                      >
                        Video
                      </div>
                    ) : (
                      <StorefrontImage
                        src={media.src}
                        alt={`Thumbnail ${i + 1}`}
                        fit="cover"
                        className="h-full w-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-2">
            {productData.category && (
              <p className="sf-kicker text-[11px] uppercase tracking-[0.18em]">
                {productData.category}
              </p>
            )}

            <h1 className="sf-title mt-2 text-[22px] font-bold uppercase leading-snug tracking-tight md:text-[26px]">
              {productData.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="sf-price text-[22px] font-semibold tracking-tight">
                {Number.isFinite(displayPrice) ? formatPrice(displayPrice) : formatPrice(0)}
              </span>
              {isDiscounted && (
                <>
                  <span className="sf-muted text-[13px] line-through">
                    {formatPrice(regularPrice)}
                  </span>
                  <span className="sf-muted text-[11px] uppercase tracking-wide">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>

            <p
              className={`mt-3 text-[11px] uppercase tracking-[0.16em] ${
                inStock ? "sf-muted" : "sf-muted opacity-70"
              }`}
            >
              {inStock
                ? Number.isFinite(Number(productData.availableStock)) &&
                  String(productData.availableStock).trim() !== ""
                  ? `${Number(productData.availableStock).toLocaleString("en-IN")} in stock`
                  : "In stock"
                : "Out of stock"}
            </p>

            {productData.colors?.length > 0 && (
              <div className="mt-8">
                <p className="sf-muted text-[11px] font-medium uppercase tracking-[0.16em]">
                  Color{selectedColor ? ` — ${selectedColor}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {productData.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className="h-8 w-8 border"
                      style={{
                        backgroundColor: color,
                        borderColor:
                          selectedColor === color ? "var(--sf-text)" : "var(--sf-border)",
                      }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {productData.sizes?.length > 0 && (
              <div className="mt-8">
                <p className="sf-muted text-[11px] font-medium uppercase tracking-[0.16em]">
                  Size
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {productData.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className="min-w-[44px] border px-3 py-2 text-sm"
                      style={{
                        borderColor:
                          selectedSize === size ? "var(--sf-text)" : "var(--sf-border)",
                        color:
                          selectedSize === size ? "var(--sf-text)" : "var(--sf-muted)",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3">
              {preferences.allowProductEnquiries !== false && preferences.showWhatsappButton !== false && storeWhatsappDigits(storeWhatsapp).length >= 10 ? (
                <button
                  type="button"
                  onClick={handleEnquire}
                  className="sf-btn inline-flex w-full items-center justify-center gap-2 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em]"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  Enquire on WhatsApp
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="sf-ghost inline-flex w-full items-center justify-center gap-2 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em]"
              >
                <FiShare2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {productData.isFreeDelivery && (
              <p className="sf-muted mt-5 text-[11px] uppercase tracking-[0.16em]">
                Free delivery available
              </p>
            )}

            {productData.description && (
              <div className="mt-10 border-t pt-8" style={{ borderColor: "var(--sf-border)" }}>
                <h2 className="sf-muted text-[11px] font-medium uppercase tracking-[0.16em]">
                  Details
                </h2>
                <p className="sf-muted mt-3 whitespace-pre-line text-sm leading-relaxed">
                  {productData.description}
                </p>
              </div>
            )}

            {isOwner && (
              <div className="sf-muted mt-10 flex items-center gap-5 text-[11px] uppercase tracking-[0.16em]">
                <span>{productData.views || 0} views</span>
                <Link
                  href={nav.editHref(storeId, productId)}
                  className="inline-flex items-center gap-1 hover:opacity-80"
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
            className="sf-card w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="sf-title text-[12px] font-medium uppercase tracking-[0.16em]">
                Share this product
              </h3>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="sf-muted p-1 hover:opacity-80"
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
                  className="sf-ghost w-full py-3 text-[12px] uppercase tracking-[0.16em]"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleCopyLink}
                className="sf-btn w-full py-3 text-[12px] uppercase tracking-[0.16em]"
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
            className="relative h-[85vh] w-full max-w-5xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <StorefrontImage
              src={currentMedia.src}
              alt={currentMedia.alt}
              fit="contain"
              priority
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
