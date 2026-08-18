"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiEyeOff } from "react-icons/fi";
import { onAuthChange } from "@/lib/auth";
import { useStorefrontNav } from "@/components/storefront-nav";
import StoreProducts from "@/components/StoreProducts";
import ProductPage from "@/components/ProductPage";

type OfflineStorefrontProps = {
  storeId: string;
  storeOwnerId: string;
  storeName: string;
  storeLogo?: string;
  storeDescription?: string;
  storeNote?: string;
  productId?: string;
  storeWhatsapp?: string;
};

export default function OfflineStorefront({
  storeId,
  storeOwnerId,
  storeName,
  storeLogo,
  storeDescription,
  storeNote,
  productId,
  storeWhatsapp,
}: OfflineStorefrontProps) {
  const nav = useStorefrontNav();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setIsOwner(!!(user && user.uid === storeOwnerId));
    });
    return () => unsub();
  }, [storeOwnerId]);

  if (isOwner) {
    return (
      <>
        <div className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50 px-4 py-3 text-center">
          <p className="text-sm text-amber-950">
            Your store is offline. Visitors cannot see this page.{" "}
            <Link href={nav.dashboardHref("/store/settings")} className="font-semibold underline underline-offset-2">
              Turn it back on in settings
            </Link>
          </p>
        </div>
        {productId ? (
          <ProductPage
            productId={productId}
            storeId={storeId}
            initialUserId={storeOwnerId}
            storeName={storeName}
            storeWhatsapp={storeWhatsapp}
            isOffline
          />
        ) : (
          <StoreProducts
            storeId={storeId}
            storeOwnerId={storeOwnerId}
            storeName={storeName}
            storeDescription={storeDescription}
            storeLogo={storeLogo}
            storeNote={storeNote}
            isOffline
          />
        )}
      </>
    );
  }

  return (
    <div className="sf-page flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {storeLogo ? (
          <Image
            src={storeLogo}
            alt=""
            width={72}
            height={72}
            unoptimized={storeLogo.startsWith("http")}
            className="mx-auto h-[72px] w-[72px] rounded-2xl border object-cover"
            style={{ borderColor: "var(--sf-border)" }}
          />
        ) : (
          <span
            className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl"
            style={{ background: "var(--sf-bg)", color: "var(--sf-muted)" }}
          >
            <FiEyeOff size={28} />
          </span>
        )}
        <h1 className="sf-title mt-6 text-2xl font-semibold tracking-tight">
          This store is offline
        </h1>
        <p className="sf-muted mt-3 text-sm leading-6">
          {storeName ? `${storeName} has taken this storefront offline for now.` : "This storefront is temporarily unavailable."}{" "}
          Please check back later.
        </p>
        <Link
          href={nav.dashboardHref("/")}
          className="sf-btn mt-8 inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold"
        >
          Back to ProductShare
        </Link>
      </div>
    </div>
  );
}
