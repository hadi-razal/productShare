import { Metadata } from 'next';
import StoreProducts from '@/components/StoreProducts';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserId } from '@/helpers/getUserId';


// Function to fetch store data from Firestore
async function getStoreData(storeId: string): Promise<any | null> {
  try {
    const userId = await getUserId(storeId);

    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const storeRef = doc(db, 'users', userId as string);
    const storeSnap = await getDoc(storeRef);

    if (storeSnap.exists()) {
      return storeSnap.data();
    } else {
      console.error('Store not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching store data:', error);
    return null;
  }
}

// Metadata generation function with improved type safety and error handling
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { storeId } = params;

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
      images: [
        {
          url: storeData?.image || "https://productshare.vercel.app/logo.png",
          width: 800,
          height: 600,
          alt: storeData?.name || "ProductShare - Showcase Your Products",
        },
      ],
    },
  };
}

// Page component with improved conditional rendering
export default async function Page({ params }: any) {
  const { storeId } = params;

  const storeData = await getStoreData(storeId);

  if (!storeData) {
    return <p>Store not found.</p>;
  }

  return (
    <>
      <StoreProducts storeId={storeId} />
    </>
  );
}
