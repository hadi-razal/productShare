import { supabase } from "@/lib/supabase";
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

  const { error } = await supabase.from("stores").update(row).eq("id", id);
  if (error) {
    const missingOptionalColumn =
      /store_theme|is_offline/i.test(error.message) || error.code === "PGRST204";
    if (missingOptionalColumn) {
      delete row.store_theme;
      delete row.is_offline;
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

export const deleteProduct = async (storeId: string, productId: string): Promise<void> => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("store_id", storeId)
    .eq("id", productId);
  if (error) throw error;
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
