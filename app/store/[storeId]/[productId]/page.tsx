// app/product/[productId]/page.tsx
import ProductPage from '@/components/ProductPage';
import { getUserId } from '@/helpers/getUserId';
import { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { db } from '@/lib/firebase'; // Adjust import based on your Firebase setup

// Function to fetch product data based on ID
async function getProductData(productId: string, storeId: string) {
  const userId = await getUserId(storeId); // Ensure you use the correct variable name

  try {
    const productRef = doc(db, userId as string, productId as string);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return productSnap.data(); // Return the actual product data
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
  }

  return null; // Return null if no product found or on error
}

// Server component that can fetch metadata for SSR
export async function generateMetadata({ params }: { params: { productId: string; storeId: string } }): Promise<Metadata> {
  const { productId, storeId } = await params; // Await the params

  // Fetch product data based on ID
  const productData = await getProductData(productId, storeId);

  const title = productData ? productData.name : "Product Not Found";
  const description = productData ? productData.description : "No description available";
  const image = productData && productData.image ? productData.image : null;

  return {
    title,
    description,
    keywords: productData ? `ProductShare, ${productData.name}, product catalog, small business` : "ProductShare",
    openGraph: {
      title,
      description,
      images: image ? [image] : [], // Include the product image if available
    },
    twitter: {
      card: 'summary_large_image', // Use the summary card with large image
      title,
      description,
      images: image ? [image] : [], // Include the product image if available
    },
  };
}

// Server component that renders the page
export default async function Page({ params }: { params: { productId: string; storeId: string } }) {
  const { productId, storeId } = await params; // Await the params
  
  // Fetch the product data to pass to the component
  const productData = await getProductData(productId, storeId); 

  // Render the ProductPage component with the fetched data
  return <ProductPage productId={productId} storeId={storeId}  />;
}

