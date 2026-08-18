import { cache } from "react";
import {
  getProduct,
  getStoreByUsername,
  listProductsByStore,
  listStores,
  type ProductRecord,
  type StoreRecord,
} from "@/lib/db";
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

const toStorefrontStore = (store: StoreRecord): StorefrontStore => ({
  ...store,
  id: store.id,
});

const toStorefrontProduct = (product: ProductRecord): StorefrontProduct => product;

export const getStorefrontStore = cache(
  async (username: string): Promise<StorefrontStore | null> => {
    if (!username) {
      return null;
    }

    const store = await getStoreByUsername(username);
    return store ? toStorefrontStore(store) : null;
  }
);

export const getStorefrontProducts = cache(
  async (username: string): Promise<StorefrontProduct[]> => {
    const store = await getStorefrontStore(username);

    if (!store) {
      return [];
    }

    const products = await listProductsByStore(store.id);
    return products.map(toStorefrontProduct);
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

    const product = await getProduct(store.id, productId);

    if (!product) {
      return null;
    }

    return {
      store,
      product: toStorefrontProduct(product),
    };
  }
);

export interface PublicStorefrontEntry {
  store: StorefrontStore;
  products: StorefrontProduct[];
}

export const getPublicStorefrontEntries = cache(
  async (): Promise<PublicStorefrontEntry[]> => {
    const stores = await listStores();

    const entries = await Promise.all(
      stores.map(async (store) => {
        if (!store.username || store.isOffline) {
          return null;
        }

        const products = (await listProductsByStore(store.id)).filter(
          (product) => !product.isHidden && product.name,
        );

        return {
          store: toStorefrontStore(store),
          products: products.map(toStorefrontProduct),
        };
      })
    );

    return entries.filter(Boolean) as PublicStorefrontEntry[];
  }
);
