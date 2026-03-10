import { Metadata } from "next";
import StoreProducts from "@/components/StoreProducts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getUserId } from "@/helpers/getUserId";
import AlertMessageSlider from "@/components/AlertSlider";

// Function to fetch store data from Firestore
async function getStoreData(storeId: string): Promise<any | null> {
  try {
    const userId = await getUserId(storeId);

    console.log(userId);

    if (!userId) {
      console.error("User ID not found");
      return null;
    }

    const storeRef = doc(db, "users", userId as string);
    const storeSnap = await getDoc(storeRef);

    if (storeSnap.exists()) {
      return storeSnap.data();
    } else {
      console.error("Store not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching store data:", error);
    return null;
  }
}

// Metadata generation function with improved type safety and error handling
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { storeId } = await params;

  const storeData = await getStoreData(storeId);

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
