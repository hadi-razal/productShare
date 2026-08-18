import { Metadata } from "next";
import { headers } from "next/headers";
import StoreProducts from "@/components/StoreProducts";
import OfflineStorefront from "@/components/OfflineStorefront";
import StorefrontShell from "@/components/StorefrontShell";
import { notFound } from "next/navigation";
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
    ? `${storeName} — Online Catalog | Product Share India`
    : "Store Not Found | Product Share India";
  const description = storeData?.description
    ? `${storeData.description} — Browse ${storeName}'s product catalog on Product Share India.`
    : `Browse ${storeName}'s digital product catalog on Product Share India. Discover products, prices, and more.`;
  const storeImage = storeData?.image || storeData?.logoImage || "https://productshare.in/og-image.png";
  const storeUrl = storefrontPublicUrl(storeId);

  return {
    title,
    description,
    keywords: storeData
      ? [
          storeName,
          `${storeName} products`,
          `${storeName} catalog`,
          `${storeName} online store`,
          "Product Share India store",
          "digital catalog India",
          "buy products online India",
        ]
      : ["store not found", "Product Share India"],
    alternates: { canonical: storeUrl },
    openGraph: {
      title,
      description,
      url: storeUrl,
      type: "website",
      images: [
        {
          url: storeImage,
          width: 800,
          height: 600,
          alt: `${storeName} — Product Catalog on Product Share India`,
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

  return (
    <StorefrontShell
      theme={storeData.storeTheme}
      onSubdomain={onSubdomain}
      apexOrigin={apexOrigin}
    >
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
