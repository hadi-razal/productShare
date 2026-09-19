import { Metadata } from "next";
import { headers } from "next/headers";
import StoreProducts from "@/components/StoreProducts";
import OfflineStorefront from "@/components/OfflineStorefront";
import StorefrontShell from "@/components/StorefrontShell";
import JsonLd from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd, storeCollectionJsonLd } from "@/lib/json-ld";
import { defaultOgImage, siteConfig } from "@/lib/site";
import { getStorefrontProducts, getStorefrontStore } from "@/lib/storefront";
import { storefrontPublicUrl, storefrontRequestContext } from "@/lib/storefront-url";

interface StorePageProps {
  params: Promise<{
    storeId: string;
  }>;
}

// Metadata generation function with improved type safety and error handling
export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { storeId } = await params;

  const storeData = await getStorefrontStore(storeId);

  const storeName = storeData?.name ?? "Store";
  const isOffline = Boolean(storeData?.isOffline);

  if (isOffline) {
    const title = `${storeName} is currently unavailable`;
    const description = `${storeName} has taken this storefront offline for now.`;
    return {
      title,
      description,
      robots: { index: false, follow: false },
    };
  }
  const title = storeData
    ? `${storeName} — Online Catalog | ${siteConfig.name}`
    : `Store Not Found | ${siteConfig.name}`;
  const description = storeData?.description
    ? `${storeData.description} Browse ${storeName}'s product catalog on Product Share.`
    : `Browse ${storeName}'s digital product catalog on Product Share. Photos, prices, and a shareable catalogue link.`;
  const storeImage = storeData?.image || storeData?.logoImage || defaultOgImage;
  const storeUrl = storefrontPublicUrl(storeId);

  return {
    title,
    description,
    keywords: storeData
      ? [
          storeName,
          `${storeName} catalog`,
          `${storeName} catalogue`,
          `${storeName} products`,
          `${storeName} online store`,
          "digital catalog",
          "online product catalogue",
          siteConfig.name,
        ]
      : ["store not found", siteConfig.name],
    alternates: { canonical: storeUrl },
    openGraph: {
      title,
      description,
      url: storeUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: siteConfig.locale,
      images: [
        {
          url: storeImage,
          width: 800,
          height: 600,
          alt: `${storeName} product catalog`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [storeImage],
    },
  };
}

// Page component with improved conditional rendering
export default async function Page({ params }: StorePageProps) {
  const { storeId } = await params;
  const { onSubdomain, apexOrigin } = storefrontRequestContext(await headers());
  const storeData = await getStorefrontStore(storeId);

  if (!storeData) {
    notFound();
  }

  if (storeData.isOffline) {
    return (
      <StorefrontShell
        theme={storeData.storeTheme}
        font={storeData.storeFont}
        onSubdomain={onSubdomain}
        apexOrigin={apexOrigin}
      >
        <OfflineStorefront
          storeId={storeId}
          storeOwnerId={storeData.id}
          storeName={storeData.name}
          storeLogo={storeData.logoImage || storeData.image}
          storeDescription={storeData.description}
          storeNote={storeData.additionalNotes}
        />
      </StorefrontShell>
    );
  }

  const initialProducts = await getStorefrontProducts(storeId);
  const storeUrl = storefrontPublicUrl(storeId);

  return (
    <StorefrontShell
      theme={storeData.storeTheme}
      font={storeData.storeFont}
      onSubdomain={onSubdomain}
      apexOrigin={apexOrigin}
    >
      <JsonLd
        data={storeCollectionJsonLd({
          store: storeData,
          url: storeUrl,
          products: initialProducts,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: storeData.name, path: storeUrl },
        ])}
      />
      <StoreProducts
        storeId={storeId}
        initialProducts={initialProducts}
        storeOwnerId={storeData.id}
        storeName={storeData.name}
        storeDescription={storeData.description}
        storeLogo={storeData.logoImage || storeData.image}
        storeNote={storeData.additionalNotes}
      />
    </StorefrontShell>
  );
}
