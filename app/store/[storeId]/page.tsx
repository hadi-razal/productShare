import { Metadata } from 'next';
import StoreProducts from '@/components/StoreProducts';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserId } from '@/helpers/getUserId';

// Interface for store data
interface StoreData {
  name: string;
  description: string;
  image?: string;
}

// Function to fetch store data from Firestore
async function getStoreData(storeId: string): Promise<StoreData | null> {
  try {
    const userId = await getUserId(storeId); 
    const storeRef = doc(db, 'users', userId as string); 
    const storeSnap = await getDoc(storeRef);

    if (storeSnap.exists()) {
      const storeData = storeSnap.data() as StoreData;
      return storeData;
    } else {
      console.error('Store not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching store data:', error);
    return null;
  }
}

// Correctly type the props for the `generateMetadata` function
export async function generateMetadata({ params }: { params: { storeId: string } }): Promise<Metadata> {
  const { storeId } = params;

  // Fetch store data to get store name and description
  const storeData = await getStoreData(storeId);

  const title = storeData?.name ?? 'Store Not Found';
  const description = storeData?.description ?? 'This store offers a variety of products.';

  // Return dynamic metadata
  return {
    title,
    description,
    keywords: storeData ? `store, ${storeData.name}, products, shop` : 'store, shop',
    openGraph: {
      title,
      description,
      images: storeData?.image ? [storeData.image] : [], // Add image if available
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: storeData?.image ? [storeData.image] : [],
    },
  };
}

// Page component to render store products
export default async function Page({ params }: { params: { storeId: string } }) {
  const { storeId } = params;

  // Fetch store data to render products
  const storeData = await getStoreData(storeId);

  return (
    <>
      {/* Render the store's products */}
      <StoreProducts storeId={storeId} />
    </>
  );
}
