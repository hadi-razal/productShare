import ProductPage from "@/components/ProductPage";
import OfflineStorefront from "@/components/OfflineStorefront";
import StorefrontShell from "@/components/StorefrontShell";
import JsonLd from "@/components/JsonLd";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import { defaultOgImage, siteConfig } from "@/lib/site";
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
    ? `${productName} | ${storeName} catalog`
    : `Product Not Found | ${siteConfig.name}`;
  const description = productData?.description
    ? `${productData.description} View ${productName} in ${storeName}'s catalog on Product Share.`
    : `View details and pricing for ${productName} in ${storeName}'s digital catalog on Product Share.`;
  const image = productData?.images?.[0] ?? null;
  const productUrl = storefrontPublicUrl(storeId, `/${productId}`);

  return {
    title,
    description,
    keywords: productData
      ? [
          productName,
          `${productName} price`,
          `${storeName} ${productName}`,
          `${productName} catalog`,
          siteConfig.name,
          "digital catalog product",
        ]
      : [siteConfig.name],
    alternates: { canonical: productUrl },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: siteConfig.locale,
      images: image
        ? [{ url: image, width: 800, height: 600, alt: productName }]
        : [{ url: defaultOgImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [defaultOgImage],
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
      preferences={storefrontProduct.store}
        theme={storefrontProduct.store.storeTheme}
        font={storefrontProduct.store.storeFont}
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
      preferences={storefrontProduct.store}
      theme={storefrontProduct.store.storeTheme}
      font={storefrontProduct.store.storeFont}
      onSubdomain={onSubdomain}
      apexOrigin={apexOrigin}
    >
      <JsonLd
        data={productJsonLd({
          product: storefrontProduct.product,
          store: storefrontProduct.store,
          url: storefrontPublicUrl(storeId, `/${productId}`),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: storefrontProduct.store.name, path: storefrontPublicUrl(storeId) },
          { name: storefrontProduct.product.name, path: storefrontPublicUrl(storeId, `/${productId}`) },
        ])}
      />
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
