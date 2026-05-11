import ProductPage from "@/components/ProductPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStorefrontProduct } from "@/lib/storefront";

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

  const productName = productData?.name ?? "Product";
  const title = productData
    ? `${productName} — Buy Online | Product Share India`
    : "Product Not Found | Product Share India";
  const description = productData?.description
    ? `${productData.description} — View ${productName} on Product Share India.`
    : `View details and pricing for ${productName} on Product Share India's digital catalog.`;
  const image = productData?.images?.[0] ?? null;
  const productUrl = `https://productshare.in/store/${storeId}/${productId}`;

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
  const storefrontProduct = await getStorefrontProduct(storeId, productId);

  if (!storefrontProduct) {
    notFound();
  }

  return (
    <ProductPage
      productId={productId}
      storeId={storeId}
      initialProduct={storefrontProduct.product}
      initialUserId={storefrontProduct.store.id}
    />
  );
}
