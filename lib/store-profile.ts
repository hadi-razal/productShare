import { isValidUsername, normalizeUsername } from "@/lib/username-rules";

export const STORE_SETTINGS_PATH = "/store/settings";

export type StoreProfileFields = {
  username?: string | null;
  name?: string | null;
  whatsappNumber?: string | null;
};

export const missingStoreProfileFields = (store?: StoreProfileFields | null) => {
  const missing: string[] = [];
  if (!isValidUsername(normalizeUsername(store?.username || ""))) {
    missing.push("Username");
  }
  if (!String(store?.name || "").trim()) {
    missing.push("Store name");
  }
  if (!/^\d{10}$/.test(String(store?.whatsappNumber || "").trim())) {
    missing.push("WhatsApp number");
  }
  return missing;
};

export const isStoreProfileComplete = (store?: StoreProfileFields | null) =>
  missingStoreProfileFields(store).length === 0;

const formatFieldList = (fields: string[]) => {
  if (fields.length <= 1) return fields[0] || "";
  if (fields.length === 2) return `${fields[0]} and ${fields[1]}`;
  return `${fields.slice(0, -1).join(", ")}, and ${fields[fields.length - 1]}`;
};

export const storeProfileIncompleteMessage = (
  store?: StoreProfileFields | null,
) => {
  const missing = missingStoreProfileFields(store);
  if (!missing.length) return "";
  return `Set up your ${formatFieldList(missing)} in Store settings before creating products or categories.`;
};

export const ensureStoreProfileComplete = (store?: StoreProfileFields | null) => {
  const message = storeProfileIncompleteMessage(store);
  if (message) throw new Error(message);
};
