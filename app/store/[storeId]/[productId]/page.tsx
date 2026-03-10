import ProductPage from "@/components/ProductPage";
import { getUserId } from "@/helpers/getUserId";
import { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProductType } from "@/type";

// Define the type for params
// interface Params {
//   params: {
//     productId: string;
//     storeId: string;
//   };
// }

// Function to fetch product data based on ID
async function getProductData(
  productId: string,
  storeId: string
): Promise<ProductType | null> {
  try {
    const userId = await getUserId(storeId);

    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const productRef = doc(db, "users", userId, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return productSnap.data() as ProductType;
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
  return null;
}

// Generate metadata for the page
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { productId, storeId } = params;

  const productData = await getProductData(productId, storeId);

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
export default async function Page({ params }: any) {
  const { productId, storeId } = await params; // No need to await params here

  // Fetch the product data here if needed
  const productData = await getProductData(productId, storeId);

  if (!productData) {
    // You might want to handle the not-found case
    return <div>Product not found</div>;
  }

  return <ProductPage productId={productId} storeId={storeId} />;
}
