import type { Metadata, ResolvingMetadata } from 'next';
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

// Define props type according to Next.js structure
type Props = {
  params: { storeId: string }
  searchParams: { [key: string]: string | string[] | undefined }
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

// Generate metadata with parent metadata support
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Get store data
  const storeData = await getStoreData(params.storeId);

  // Get parent metadata images
  const previousImages = (await parent).openGraph?.images || [];

  const title = storeData?.name ?? 'Store Not Found';
  const description = storeData?.description ?? 'This store offers a variety of products.';

  return {
    title,
    description,
    keywords: storeData ? `store, ${storeData.name}, products, shop` : 'store, shop',
    openGraph: {
      title,
      description,
      images: storeData?.image
        ? [storeData.image, ...previousImages]
        : [...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: storeData?.image ? [storeData.image] : [],
    },
  };
}

// Page component with correct Props type
export default async function Page({ params, searchParams }: Props) {
  const storeData = await getStoreData(params.storeId);

  return (
    <>
      <StoreProducts storeId={params.storeId} />
    </>
  );
}