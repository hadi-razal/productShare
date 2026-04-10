import { Metadata } from "next";
import StoreProducts from "@/components/StoreProducts";
import { notFound } from "next/navigation";
import { getStorefrontProducts, getStorefrontStore } from "@/lib/storefront";

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
  const title = storeData
    ? `${storeName} — Online Catalog | Product Share India`
    : "Store Not Found | Product Share India";
  const description = storeData?.description
    ? `${storeData.description} — Browse ${storeName}'s product catalog on Product Share India.`
    : `Browse ${storeName}'s digital product catalog on Product Share India. Discover products, prices, and more.`;
  const storeImage = storeData?.image || "https://productshare.in/og-image.png";
  const storeUrl = `https://productshare.in/store/${storeId}`;

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

  const [storeData, initialProducts] = await Promise.all([
    getStorefrontStore(storeId),
    getStorefrontProducts(storeId),
  ]);

  if (!storeData) {
    notFound();
  }

  return (
    <>
      <StoreProducts
        storeId={storeId}
        initialProducts={initialProducts}
        storeOwnerId={storeData.id}
      />
    </>
  );
}
