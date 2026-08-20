import { supabase } from "@/lib/supabase";
import { asCategoryList } from "@/lib/product-categories";
import { ensureStoreProfileComplete } from "@/lib/store-profile";
import { deletePublicFiles } from "@/lib/storage";
import type { ProductType, userType } from "@/type";

export type StoreRecord = userType & {
  id: string;
  visitCount?: number;
  visitorData?: unknown[];
  lowStockItems?: number;
  isPremiumUser?: boolean;
  premiumUser?: boolean;
  subscriptionId?: string;
  subscribedAt?: string | null;
  description?: string;
  createdAt?: string;
};

export type ProductRecord = ProductType & { id: string };

type StoreRow = {
  id: string;
  uid?: string | null;
  username?: string | null;
  name?: string | null;
  email?: string | null;
  whatsapp_number?: string | null;
  additional_notes?: string | null;
  logo_image?: string | null;
  image?: string | null;
  theme_color?: string | null;
  store_theme?: string | null;
  description?: string | null;
  visit_count?: number | null;
  visitor_data?: unknown;
  low_stock_items?: number | null;
  is_premium_user?: boolean | null;
  subscription_id?: string | null;
  subscribed_at?: string | null;
  is_offline?: boolean | null;
  product_categories?: unknown;
  created_at?: string | null;
};

type ProductRow = {
  id: string;
  store_id: string;
  name?: string | null;
  description?: string | null;
  category?: string | null;
  colors?: unknown;
  sizes?: unknown;
  images?: unknown;
  regular_price?: string | number | null;
  discount_price?: string | number | null;
  video?: string | null;
  is_new?: boolean | null;
  is_in_stock?: boolean | null;
  is_best_selling?: boolean | null;
  is_hidden?: boolean | null;
  is_featured?: boolean | null;
  is_most_selling?: boolean | null;
  is_free_delivery?: boolean | null;
  views?: number | null;
  rating?: number | null;
  total_reviews?: number | null;
  rating_count?: number | null;
  available_stock?: string | null;
  tags?: string | null;
  created_at?: string | null;
};

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : [];

const storeFromRow = (row: StoreRow): StoreRecord => ({
  id: row.id,
  uid: row.uid ?? row.id,
  username: row.username ?? "",
  name: row.name ?? "",
  email: row.email ?? "",
  whatsappNumber: row.whatsapp_number ?? "",
  additionalNotes: row.additional_notes ?? "",
  logoImage: row.logo_image ?? undefined,
  image: row.image ?? undefined,
  themeColor: row.theme_color ?? "#000000",
  storeTheme: row.store_theme ?? "minimal",
  description: row.description ?? undefined,
  visitCount: row.visit_count ?? 0,
  visitorData: Array.isArray(row.visitor_data) ? row.visitor_data : [],
  lowStockItems: row.low_stock_items ?? undefined,
  isPremiumUser: Boolean(row.is_premium_user),
  premiumUser: Boolean(row.is_premium_user),
  subscriptionId: row.subscription_id ?? undefined,
  subscribedAt: row.subscribed_at ?? null,
  isOffline: Boolean(row.is_offline),
  productCategories: asCategoryList(row.product_categories),
  createdAt: row.created_at ?? undefined,
  isVisitedCount: String(row.visit_count ?? 0),
});

const productFromRow = (row: ProductRow): ProductRecord => ({
  id: row.id,
  name: row.name ?? "",
  description: row.description ?? "",
  category: row.category ?? "",
  colors: asStringArray(row.colors),
  sizes: asStringArray(row.sizes),
  images: asStringArray(row.images),
  regularPrice: row.regular_price ?? "",
  discountPrice: row.discount_price ?? "",
  video: row.video ?? "",
  isNew: Boolean(row.is_new),
  isInStock: row.is_in_stock ?? false,
  isBestSelling: Boolean(row.is_best_selling),
  isHidden: Boolean(row.is_hidden),
  isFeatured: Boolean(row.is_featured),
  isMostSelling: Boolean(row.is_most_selling),
  isFreeDelivery: Boolean(row.is_free_delivery),
  views: row.views ?? 0,
  rating: row.rating ?? 0,
  totalReviews: row.total_reviews ?? 0,
  ratingCount: row.rating_count ?? 0,
  availableStock: row.available_stock ?? undefined,
  tags: row.tags ?? "",
  createdAt: row.created_at ? new Date(row.created_at).getTime() : null,
});

const productToRow = (storeId: string, product: Partial<ProductType>) => ({
  store_id: storeId,
  name: product.name ?? "",
  description: product.description ?? "",
  category: product.category ?? "",
  colors: product.colors ?? [],
  sizes: product.sizes ?? [],
  images: product.images ?? [],
  regular_price:
    product.regularPrice === undefined || product.regularPrice === null
      ? null
      : String(product.regularPrice),
  discount_price:
    product.discountPrice === undefined || product.discountPrice === null
      ? null
      : String(product.discountPrice),
  video: product.video ?? "",
  is_new: Boolean(product.isNew),
  is_in_stock: product.isInStock ?? true,
  is_best_selling: Boolean(product.isBestSelling),
  is_hidden: Boolean(product.isHidden),
  is_featured: Boolean(product.isFeatured),
  is_most_selling: Boolean(product.isMostSelling),
  is_free_delivery: Boolean(product.isFreeDelivery),
  views: Number(product.views || 0),
  rating: product.rating ?? null,
  total_reviews: product.totalReviews ?? null,
  rating_count: product.ratingCount ?? null,
  available_stock: product.availableStock ?? null,
  tags: product.tags ?? "",
});

export const getStoreById = async (id: string): Promise<StoreRecord | null> => {
  const { data, error } = await supabase.from("stores").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? storeFromRow(data as StoreRow) : null;
};

export const getStoreByEmail = async (email: string): Promise<StoreRecord | null> => {
  if (!email) return null;
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data ? storeFromRow(data as StoreRow) : null;
};

export const getStoreByUsername = async (
  username: string,
): Promise<StoreRecord | null> => {
  if (!username) return null;
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data ? storeFromRow(data as StoreRow) : null;
};

export const listStores = async (): Promise<StoreRecord[]> => {
  const { data, error } = await supabase.from("stores").select("*");
  if (error) throw error;
  return (data ?? []).map((row) => storeFromRow(row as StoreRow));
};

export const listProductCountsByStore = async (): Promise<Record<string, number>> => {
  const { data, error } = await supabase.from("products").select("store_id");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const id = String((row as { store_id?: string }).store_id || "");
    if (!id) continue;
    counts[id] = (counts[id] || 0) + 1;
  }
  return counts;
};

export const createStore = async (
  id: string,
  input: {
    username: string;
    name?: string | null;
    email?: string | null;
    premiumUser?: boolean;
  },
): Promise<void> => {
  const { error } = await supabase.from("stores").insert({
    id,
    uid: id,
    username: input.username,
    name: input.name ?? "",
    email: input.email ?? "",
    is_premium_user: Boolean(input.premiumUser),
  });
  if (error) throw error;
};

export const updateStore = async (
  id: string,
  input: Partial<StoreRecord> & Record<string, unknown>,
): Promise<void> => {
  const row: Record<string, unknown> = {};
  if (input.username !== undefined) row.username = input.username;
  if (input.name !== undefined) row.name = input.name;
  if (input.email !== undefined) row.email = input.email;
  if (input.whatsappNumber !== undefined) row.whatsapp_number = input.whatsappNumber;
  if (input.additionalNotes !== undefined) row.additional_notes = input.additionalNotes;
  if (input.logoImage !== undefined) row.logo_image = input.logoImage;
  if (input.image !== undefined) row.image = input.image;
  if (input.themeColor !== undefined) row.theme_color = input.themeColor;
  if (input.storeTheme !== undefined) row.store_theme = input.storeTheme;
  if (input.description !== undefined) row.description = input.description;
  if (input.visitCount !== undefined) row.visit_count = input.visitCount;
  if (input.visitorData !== undefined) row.visitor_data = input.visitorData;
  if (input.lowStockItems !== undefined) row.low_stock_items = input.lowStockItems;
  if (input.isPremiumUser !== undefined) row.is_premium_user = input.isPremiumUser;
  if (input.premiumUser !== undefined) row.is_premium_user = input.premiumUser;
  if (input.subscriptionId !== undefined) row.subscription_id = input.subscriptionId;
  if (input.subscribedAt !== undefined) row.subscribed_at = input.subscribedAt;
  if (input.isOffline !== undefined) row.is_offline = input.isOffline;
  if (input.productCategories !== undefined) {
    row.product_categories = asCategoryList(input.productCategories);
  }

  const { error } = await supabase.from("stores").update(row).eq("id", id);
  if (error) {
    const missingOptionalColumn =
      /store_theme|is_offline|product_categories/i.test(error.message) ||
      error.code === "PGRST204";
    if (missingOptionalColumn) {
      delete row.store_theme;
      delete row.is_offline;
      delete row.product_categories;
      const retry = await supabase.from("stores").update(row).eq("id", id);
      if (retry.error) throw retry.error;
      return;
    }
    throw error;
  }
};

export const incrementStoreVisits = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc("increment_store_visits", { p_id: id });
  if (error) throw error;
};

export const listProductsByStore = async (storeId: string): Promise<ProductRecord[]> => {
  const { data, error } = await supabase.from("products").select("*").eq("store_id", storeId);
  if (error) throw error;
  return (data ?? []).map((row) => productFromRow(row as ProductRow));
};

export const getProduct = async (
  storeId: string,
  productId: string,
): Promise<ProductRecord | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .eq("id", productId)
    .maybeSingle();
  if (error) throw error;
  return data ? productFromRow(data as ProductRow) : null;
};

export const createProduct = async (
  storeId: string,
  product: Partial<ProductType>,
): Promise<string> => {
  const store = await getStoreById(storeId);
  ensureStoreProfileComplete(store);

  const id = crypto.randomUUID();
  const { error } = await supabase.from("products").insert({
    id,
    ...productToRow(storeId, product),
  });
  if (error) throw error;
  return id;
};

export const updateProduct = async (
  storeId: string,
  productId: string,
  product: Partial<ProductType>,
): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .update(productToRow(storeId, product))
    .eq("store_id", storeId)
    .eq("id", productId);
  if (error) throw error;
};

export const reassignProductCategory = async (
  storeId: string,
  from: string[],
  to: string,
): Promise<void> => {
  const keys = new Set(from.map((value) => value.trim().toLowerCase()).filter(Boolean));
  if (!keys.size) return;

  const products = await listProductsByStore(storeId);
  const matches = products.filter((product) =>
    keys.has(String(product.category || "").trim().toLowerCase()),
  );

  await Promise.all(
    matches.map(async (product) => {
      const { error } = await supabase
        .from("products")
        .update({ category: to })
        .eq("store_id", storeId)
        .eq("id", product.id);
      if (error) throw error;
    }),
  );
};

export const deleteProduct = async (storeId: string, productId: string): Promise<void> => {
  const product = await getProduct(storeId, productId);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("store_id", storeId)
    .eq("id", productId);
  if (error) throw error;

  if (!product) return;

  try {
    await deletePublicFiles([...(product.images || []), product.video]);
  } catch (storageError) {
    console.error("Product deleted, but files could not be removed from storage:", storageError);
  }
};

export const deleteStore = async (storeId: string): Promise<void> => {
  const [store, products] = await Promise.all([
    getStoreById(storeId),
    listProductsByStore(storeId),
  ]);

  for (const product of products) {
    await deleteProduct(storeId, product.id);
  }

  const { error } = await supabase.from("stores").delete().eq("id", storeId);
  if (error) throw error;

  if (!store) return;
  try {
    await deletePublicFiles([store.logoImage, store.image]);
  } catch (storageError) {
    console.error("Store deleted, but logo could not be removed from storage:", storageError);
  }
};

export const incrementProductViews = async (productId: string): Promise<void> => {
  const { error } = await supabase.rpc("increment_product_views", { p_id: productId });
  if (error) throw error;
};

export const isUsernameTaken = async (
  username: string,
  excludeUserId?: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("stores")
    .select("id")
    .eq("username", username);
  if (error) throw error;
  if (!data?.length) return false;
  return !(excludeUserId && data.length === 1 && data[0].id === excludeUserId);
};

export type ContactMessageSource = "website" | "store";

export type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  message: string;
  source: ContactMessageSource;
  storeId: string;
  storeName: string;
  topic: string;
  createdAt: string;
  updatedAt: string;
};

type ContactMessageRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  message?: string | null;
  source?: string | null;
  store_id?: string | null;
  store_name?: string | null;
  topic?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const contactFromRow = (row: ContactMessageRow): ContactMessageRecord => ({
  id: row.id,
  name: row.name ?? "",
  email: row.email ?? "",
  message: row.message ?? "",
  source: row.source === "store" ? "store" : "website",
  storeId: row.store_id ?? "",
  storeName: row.store_name ?? "",
  topic: row.topic ?? "",
  createdAt: row.created_at ?? "",
  updatedAt: row.updated_at ?? row.created_at ?? "",
});

const contactTableMissing = (error: { message?: string; code?: string } | null) =>
  Boolean(
    error &&
      (/contact_messages/i.test(error.message || "") ||
        error.code === "42P01" ||
        error.code === "PGRST205"),
  );

const contactOptionalColumnMissing = (error: { message?: string; code?: string } | null) =>
  Boolean(
    error &&
      (/source|store_id|store_name|topic/i.test(error.message || "") ||
        error.code === "PGRST204"),
  );

const contactSetupError =
  "Messages are not set up yet. Run the latest contact_messages SQL in Supabase.";

export const submitContactMessage = async (input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ updated: boolean }> => {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const message = input.message.trim();
  if (!name || !email || !message) {
    throw new Error("Name, email, and message are required.");
  }

  const now = new Date().toISOString();
  const lookup = async (withSource: boolean) => {
    let query = supabase.from("contact_messages").select("id").eq("email", email);
    if (withSource) query = query.eq("source", "website");
    return query.maybeSingle();
  };

  let existing = await lookup(true);
  if (existing.error && contactOptionalColumnMissing(existing.error)) {
    existing = await lookup(false);
  }
  if (existing.error) {
    if (contactTableMissing(existing.error)) throw new Error(contactSetupError);
    throw existing.error;
  }

  if (existing.data?.id) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ name, message, updated_at: now })
      .eq("id", existing.data.id);
    if (error) throw error;
    return { updated: true };
  }

  const insertRow: Record<string, string> = {
    name,
    email,
    message,
    source: "website",
    created_at: now,
    updated_at: now,
  };
  let { error } = await supabase.from("contact_messages").insert(insertRow);
  if (error && contactOptionalColumnMissing(error)) {
    delete insertRow.source;
    const retry = await supabase.from("contact_messages").insert(insertRow);
    error = retry.error;
  }
  if (error) {
    if (error.code === "23505") {
      const retry = await supabase
        .from("contact_messages")
        .update({ name, message, updated_at: now })
        .eq("email", email);
      if (retry.error) throw retry.error;
      return { updated: true };
    }
    if (contactTableMissing(error)) throw new Error(contactSetupError);
    throw error;
  }
  return { updated: false };
};

export const submitStoreMessage = async (input: {
  name: string;
  email: string;
  message: string;
  topic?: string;
  storeId?: string;
  storeName?: string;
}): Promise<void> => {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const message = input.message.trim();
  const topic = (input.topic || "").trim();
  if (!name || !email || !message) {
    throw new Error("Name, email, and message are required.");
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
    source: "store",
    store_id: input.storeId || null,
    store_name: (input.storeName || "").trim() || null,
    topic,
    created_at: now,
    updated_at: now,
  });
  if (error) {
    if (contactTableMissing(error) || contactOptionalColumnMissing(error) || error.code === "23505") {
      throw new Error(contactSetupError);
    }
    throw error;
  }
};

export const listContactMessages = async (
  source?: ContactMessageSource,
): Promise<ContactMessageRecord[]> => {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) {
    if (contactTableMissing(error)) return [];
    throw error;
  }
  const rows = (data || []).map((row) => contactFromRow(row as ContactMessageRow));
  return source ? rows.filter((row) => row.source === source) : rows;
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
};
