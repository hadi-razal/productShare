import { siteConfig } from "@/lib/site";

export const TRIAL_DAYS = 30;

// Stores created before the trial launched get a full trial from this date.
export const TRIAL_LAUNCH_DATE = "2026-10-14T00:00:00Z";

const DAY_MS = 24 * 60 * 60 * 1000;

export type PlanState = "premium" | "trial" | "expired";

export type PlanStatus = {
  state: PlanState;
  trialEndsAt: Date | null;
  daysLeft: number;
};

type PlanStore = {
  isPremiumUser?: boolean;
  premiumUser?: boolean;
  trialEndsAt?: string | null;
  createdAt?: string | null;
};

const validDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const defaultTrialEndsAt = (from = new Date()) =>
  new Date(from.getTime() + TRIAL_DAYS * DAY_MS).toISOString();

export const storeTrialEndsAt = (store: PlanStore): Date => {
  const stored = validDate(store.trialEndsAt);
  if (stored) return stored;
  const launch = new Date(TRIAL_LAUNCH_DATE);
  const created = validDate(store.createdAt);
  const start = created && created > launch ? created : launch;
  return new Date(start.getTime() + TRIAL_DAYS * DAY_MS);
};

export const storePlanStatus = (
  store: PlanStore | null | undefined,
  now = new Date(),
): PlanStatus => {
  if (!store) return { state: "trial", trialEndsAt: null, daysLeft: TRIAL_DAYS };
  const trialEndsAt = storeTrialEndsAt(store);
  if (store.isPremiumUser || store.premiumUser) {
    return { state: "premium", trialEndsAt, daysLeft: 0 };
  }
  const remainingMs = trialEndsAt.getTime() - now.getTime();
  if (remainingMs <= 0) return { state: "expired", trialEndsAt, daysLeft: 0 };
  return { state: "trial", trialEndsAt, daysLeft: Math.ceil(remainingMs / DAY_MS) };
};

export const isStorePlanExpired = (store: PlanStore | null | undefined, now = new Date()) =>
  storePlanStatus(store, now).state === "expired";

export const planStatusLabel = (status: PlanStatus) =>
  status.state === "premium"
    ? "Premium"
    : status.state === "expired"
      ? "Trial ended"
      : `Trial · ${status.daysLeft}d left`;

// Extends from the current end date, or from now if the trial already ended.
export const extendedTrialEndsAt = (store: PlanStore, now = new Date()) => {
  const end = storeTrialEndsAt(store);
  return defaultTrialEndsAt(end > now ? end : now);
};

export const formatTrialDate =(date: Date | null) =>
  date
    ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

export const planPurchaseWhatsappUrl = (input: {
  planName?: string;
  storeName?: string;
  username?: string;
  email?: string;
}) => {
  const lines = [
    input.planName
      ? `Hi ProductShare Team, I'd like to purchase the ${input.planName} plan.`
      : "Hi ProductShare Team, I'd like to purchase a plan.",
    input.storeName ? `Store: ${input.storeName}` : "",
    input.username ? `Username: ${input.username}` : "",
    input.email ? `Email: ${input.email}` : "",
  ];
  return `https://wa.me/${siteConfig.supportWhatsAppNumber}?text=${encodeURIComponent(
    lines.filter(Boolean).join("\n"),
  )}`;
};
