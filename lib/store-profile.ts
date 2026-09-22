import { isValidUsername, normalizeUsername } from "@/lib/username-rules";
import { isValidWhatsappNumber, whatsappDigits } from "@/lib/whatsapp";

export const STORE_SETTINGS_PATH = "/store/settings";
export const STORE_SETUP_EVENT = "productshare:store-setup";

export type StoreProfileFields = {
  id?: string | null;
  username?: string | null;
  name?: string | null;
  whatsappNumber?: string | null;
  logoImage?: string | null;
  additionalNotes?: string | null;
  onboardingCompleted?: boolean | null;
};

export const storeWhatsappDigits = (value?: string | null) => whatsappDigits(value);

export const isValidOptionalWhatsapp = (value?: string | null) =>
  isValidWhatsappNumber(value);

export const missingStoreProfileFields = (store?: StoreProfileFields | null) => {
  const missing: string[] = [];
  if (!isValidUsername(normalizeUsername(store?.username || ""))) {
    missing.push("Username");
  }
  if (!String(store?.name || "").trim()) {
    missing.push("Store name");
  }
  if (!isValidWhatsappNumber(store?.whatsappNumber)) {
    missing.push("WhatsApp number");
  }
  return missing;
};

export const isStoreProfileComplete = (store?: StoreProfileFields | null) =>
  missingStoreProfileFields(store).length === 0;

const onboardingStorageKey = (storeId: string) =>
  `productshare:onboarding-complete:${storeId}`;

export const markOnboardingLocallyComplete = (storeId: string) => {
  if (typeof window === "undefined" || !storeId) return;
  try {
    localStorage.setItem(onboardingStorageKey(storeId), "1");
  } catch {
    /* ignore */
  }
};

export const isOnboardingLocallyComplete = (storeId?: string | null) => {
  if (!storeId || typeof window === "undefined") return false;
  try {
    return localStorage.getItem(onboardingStorageKey(storeId)) === "1";
  } catch {
    return false;
  }
};

export const needsStoreOnboarding = (store?: StoreProfileFields | null) => {
  if (!store) return true;
  if (store.onboardingCompleted === true) return false;
  if (isOnboardingLocallyComplete(store.id)) return false;
  return true;
};

export const emitStoreSetupComplete = (detail?: StoreProfileFields) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STORE_SETUP_EVENT, { detail }));
};

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
