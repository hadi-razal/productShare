import ProductPage from '@/components/ProductPage';
import { getUserId } from '@/helpers/getUserId';
import { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductType } from '@/type';


// Define the type for params
// interface Params {
//   params: {
//     productId: string;
//     storeId: string;
//   };
// }

// Function to fetch product data based on ID
async function getProductData(productId: string, storeId: string): Promise<ProductType | null> {
  try {
    const userId = await getUserId(storeId);
    
    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const productRef = doc(db, userId, productId);
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
export async function generateMetadata({ params }:any): Promise<Metadata> {
  const { productId, storeId } = params; // No need to await params here
  
  const productData = await getProductData(productId, storeId);

  const title = productData?.name ?? "Product Not Found";
  const description = productData?.description ?? "No description available";
  const image = productData?.images[0] ?? null;

  return {
    title,
    description,
    keywords: productData
      ? `ProductShare, ${productData.name}, product catalog, small business`
      : "ProductShare",
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
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
