import { cache } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProductType, userType } from "@/type";

export interface StorefrontStore extends userType {
  id: string;
  description?: string;
  logoImage?: string;
  whatsappNumber?: string;
}

export interface StorefrontProduct extends ProductType {
  id: string;
}

const mapProduct = (
  productId: string,
  data: Partial<ProductType>
): StorefrontProduct => ({
  id: productId,
  name: data.name ?? "",
  description: data.description ?? "",
  category: data.category ?? "",
  colors: data.colors ?? [],
  sizes: data.sizes ?? [],
  images: data.images ?? [],
  regularPrice: data.regularPrice ?? null,
  discountPrice: data.discountPrice ?? null,
  createdAt:
    typeof data.createdAt?.toMillis === "function"
      ? data.createdAt.toMillis()
      : data.createdAt ?? null,
  video: data.video,
  isNew: data.isNew ?? false,
  isInStock: data.isInStock ?? false,
  isBestSelling: data.isBestSelling ?? false,
  views: data.views ?? 0,
  rating: data.rating ?? 0,
  totalReviews: data.totalReviews ?? 0,
  ratingCount: data.ratingCount ?? 0,
  availableStock: data.availableStock,
  tags: data.tags ?? "",
  isHidden: data.isHidden ?? false,
  isFeatured: data.isFeatured ?? false,
  isMostSelling: data.isMostSelling ?? false,
  isFreeDelivery: data.isFreeDelivery ?? false,
});

export const getStorefrontStore = cache(
  async (username: string): Promise<StorefrontStore | null> => {
    if (!username) {
      return null;
    }

    const storeQuery = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const storeSnapshot = await getDocs(storeQuery);

    if (storeSnapshot.empty) {
      return null;
    }

    return {
      id: storeSnapshot.docs[0].id,
      ...(storeSnapshot.docs[0].data() as userType),
    };
  }
);

export const getStorefrontProducts = cache(
  async (username: string): Promise<StorefrontProduct[]> => {
    const store = await getStorefrontStore(username);

    if (!store) {
      return [];
    }

    const productsSnapshot = await getDocs(
      collection(db, "users", store.id, "products")
    );

    return productsSnapshot.docs.map((productDoc) =>
      mapProduct(productDoc.id, productDoc.data() as Partial<ProductType>)
    );
  }
);

export const getStorefrontProduct = cache(
  async (
    username: string,
    productId: string
  ): Promise<{ store: StorefrontStore; product: StorefrontProduct } | null> => {
    const store = await getStorefrontStore(username);

    if (!store) {
      return null;
    }

    const productRef = doc(db, "users", store.id, "products", productId);
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return null;
    }

    return {
      store,
      product: mapProduct(
        productSnapshot.id,
        productSnapshot.data() as Partial<ProductType>
      ),
    };
  }
);

export interface PublicStorefrontEntry {
  store: StorefrontStore;
  products: StorefrontProduct[];
}

export const getPublicStorefrontEntries = cache(
  async (): Promise<PublicStorefrontEntry[]> => {
    const storesSnapshot = await getDocs(collection(db, "users"));

    const entries = await Promise.all(
      storesSnapshot.docs.map(async (storeDoc) => {
        const storeData = storeDoc.data() as Partial<StorefrontStore>;

        if (!storeData.username) {
          return null;
        }

        const productsSnapshot = await getDocs(
          collection(db, "users", storeDoc.id, "products")
        );

        const products = productsSnapshot.docs
          .map((productDoc) =>
            mapProduct(productDoc.id, productDoc.data() as Partial<ProductType>)
          )
          .filter((product) => !product.isHidden && product.name);

        return {
          store: {
            id: storeDoc.id,
            ...(storeData as StorefrontStore),
          },
          products,
        };
      })
    );

    return entries.filter(Boolean) as PublicStorefrontEntry[];
  }
);
