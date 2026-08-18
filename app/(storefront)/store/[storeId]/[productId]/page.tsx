import ProductPage from "@/components/ProductPage";
import OfflineStorefront from "@/components/OfflineStorefront";
import StorefrontShell from "@/components/StorefrontShell";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getStorefrontProduct } from "@/lib/storefront";
import { storefrontPublicUrl, storefrontRequestContext } from "@/lib/storefront-url";

interface ProductRouteProps {
  params: Promise<{
    productId: string;
    storeId: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: ProductRouteProps): Promise<Metadata> {
  const { productId, storeId } = await params;

  const storefrontProduct = await getStorefrontProduct(storeId, productId);
  const productData = storefrontProduct?.product ?? null;
  const storeName = storefrontProduct?.store.name ?? "Store";

  if (storefrontProduct?.store.isOffline) {
    return {
      title: `${storeName} is currently unavailable`,
      description: `${storeName} has taken this storefront offline for now.`,
      robots: { index: false, follow: false },
    };
  }

  const productName = productData?.name ?? "Product";
  const title = productData
    ? `${productName} — Buy Online | Product Share India`
    : "Product Not Found | Product Share India";
  const description = productData?.description
    ? `${productData.description} — View ${productName} on Product Share India.`
    : `View details and pricing for ${productName} on Product Share India's digital catalog.`;
  const image = productData?.images?.[0] ?? null;
  const productUrl = storefrontPublicUrl(storeId, `/${productId}`);

  return {
    title,
    description,
    keywords: productData
      ? [
          productName,
          `buy ${productName} online India`,
          `${productName} price`,
          "Product Share India",
          "digital catalog product",
          "small business products India",
        ]
      : ["Product Share India"],
    alternates: { canonical: productUrl },
    openGraph: {
      title,
      description,
      url: productUrl,
      type: "website",
      images: image
        ? [{ url: image, width: 800, height: 600, alt: productName }]
        : [{ url: "https://productshare.in/og-image.png", width: 1200, height: 630, alt: "Product Share India" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : ["https://productshare.in/og-image.png"],
    },
  };
}

// Server component that renders the page
export default async function Page({ params }: ProductRouteProps) {
  const { productId, storeId } = await params;
  const { onSubdomain, apexOrigin } = storefrontRequestContext(await headers());
  const storefrontProduct = await getStorefrontProduct(storeId, productId);

  if (!storefrontProduct) {
    notFound();
  }

  if (storefrontProduct.store.isOffline) {
    return (
      <StorefrontShell
        theme={storefrontProduct.store.storeTheme}
        onSubdomain={onSubdomain}
        apexOrigin={apexOrigin}
      >
        <OfflineStorefront
          storeId={storeId}
          storeOwnerId={storefrontProduct.store.id}
          storeName={storefrontProduct.store.name}
          storeLogo={storefrontProduct.store.logoImage || storefrontProduct.store.image}
          productId={productId}
          storeWhatsapp={storefrontProduct.store.whatsappNumber}
        />
      </StorefrontShell>
    );
  }

  return (
    <StorefrontShell
      theme={storefrontProduct.store.storeTheme}
      onSubdomain={onSubdomain}
      apexOrigin={apexOrigin}
    >
      <ProductPage
        productId={productId}
        storeId={storeId}
        initialProduct={storefrontProduct.product}
        initialUserId={storefrontProduct.store.id}
        storeName={storefrontProduct.store.name}
        storeWhatsapp={storefrontProduct.store.whatsappNumber}
      />
    </StorefrontShell>
  );
}
