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

// Define PageProps interface
interface PageProps {
  params: {
    storeId: string;
  };
}

// Function to fetch store data from Firestore
async function getStoreData(storeId: string): Promise<StoreData | null> {
  try {
    const userId = await getUserId(storeId);

    if (!userId) {
      console.error("User ID not found");
      return null;
    }

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

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { storeId } = await params;

  const storeData = await getStoreData(storeId);

  const title = storeData?.name ?? 'Store Not Found';
  const description = storeData?.description ?? 'This store offers a variety of products.';

  return {
    title,
    description,
    keywords: storeData ? `store, ${storeData.name}, products, shop` : 'store, shop',
    openGraph: {
      title,
      description,
      images: storeData?.image ? [storeData.image] : [],
    },
  };
}

export default async function Page({ params }: any) {
  const { storeId } = await params;

  const storeData = await getStoreData(storeId);

  return (
    <>
      {/* Render the store's products */}
      <StoreProducts storeId={storeId} />
    </>
  );
}
