import { supabase } from "@/lib/supabase";

export type StoreActivityType =
  | "session"
  | "product_added"
  | "product_updated"
  | "product_deleted"
  | "settings_saved"
  | "store_offline"
  | "store_live"
  | "enquiry";

export type StoreActivityDetail = Record<string, string | number | boolean | null>;

export type StoreActivityRecord = {
  id: string;
  storeId: string;
  type: StoreActivityType;
  detail: StoreActivityDetail;
  createdAt: string;
};

type StoreActivityRow = {
  id: string;
  store_id: string;
  type: string;
  detail?: unknown;
  created_at: string;
};

export const ACTIVITY_LABELS: Record<StoreActivityType, string> = {
  session: "Opened dashboard",
  product_added: "Added a product",
  product_updated: "Edited a product",
  product_deleted: "Deleted products",
  settings_saved: "Saved store settings",
  store_offline: "Took store offline",
  store_live: "Put store live",
  enquiry: "Shopper sent a WhatsApp enquiry",
};

const SESSION_KEY = "MyShop_Activity_Session";

const activityFromRow = (row: StoreActivityRow): StoreActivityRecord => ({
  id: row.id,
  storeId: row.store_id,
  type: row.type as StoreActivityType,
  detail:
    row.detail && typeof row.detail === "object" && !Array.isArray(row.detail)
      ? (row.detail as StoreActivityDetail)
      : {},
  createdAt: row.created_at,
});

/**
 * Records a store activity. Never throws: tracking must not break the action it describes,
 * and stays silent until the store_activity migration has been run.
 */
export const logStoreActivity = async (
  storeId: string | null | undefined,
  type: StoreActivityType,
  detail: StoreActivityDetail = {},
): Promise<void> => {
  if (!storeId) return;
  try {
    const { error } = await supabase.from("store_activity").insert({ store_id: storeId, type, detail });
    if (error) return;
    if (type !== "enquiry") {
      await supabase
        .from("stores")
        .update({ last_active_at: new Date().toISOString() })
        .eq("id", storeId);
    }
  } catch {
    // Tracking is best-effort.
  }
};

/** Logs one "session" per browser tab session for the store owner. */
export const logStoreSession = async (storeId: string | null | undefined) => {
  if (!storeId || typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === storeId) return;
    sessionStorage.setItem(SESSION_KEY, storeId);
  } catch {
    // Storage unavailable; still log the session.
  }
  await logStoreActivity(storeId, "session");
};

export const listStoreActivity = async (
  storeId: string,
  limit = 200,
): Promise<StoreActivityRecord[]> => {
  const { data, error } = await supabase
    .from("store_activity")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []).map((row) => activityFromRow(row as StoreActivityRow));
};
