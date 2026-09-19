export type PlanId = "plus" | "pro";
export type BillingCycle = "monthly" | "yearly";

export const YEARLY_DISCOUNT_PERCENT = 15;

export type CatalogPlan = {
  id: PlanId;
  name: string;
  description: string;
  monthlyPriceInr: number;
  productLimit: number;
  themeLimit: number;
  themeLabel: string;
  features: string[];
};

export const PLANS: Record<PlanId, CatalogPlan> = {
  plus: {
    id: "plus",
    name: "Plus",
    description: "For growing catalogs that need a clean storefront.",
    monthlyPriceInr: 249,
    productLimit: 30,
    themeLimit: 3,
    themeLabel: "3 storefront themes",
    features: [
      "Up to 30 product listings",
      "3 storefront themes",
      "Public catalog link",
      "Theme customization",
      "Catalog analytics",
      "WhatsApp sharing",
      "Standard support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "More products, more themes, and the full catalog toolkit.",
    monthlyPriceInr: 499,
    productLimit: 120,
    themeLimit: 12,
    themeLabel: "10+ storefront themes",
    features: [
      "Up to 120 product listings",
      "10+ storefront themes",
      "Everything in Plus",
      "Advanced analytics",
      "Product videos",
      "Custom alert banners",
      "Sales and engagement charts",
      "AI customer insights",
      "Bulk product editing",
      "Bulk CSV/Excel upload",
      "Team access",
      "Priority support",
    ],
  },
};

export const PLAN_LIST = [PLANS.plus, PLANS.pro] as const;

export const yearlyFullPriceInr = (monthlyPriceInr: number) => monthlyPriceInr * 12;

export const yearlyPriceInr = (monthlyPriceInr: number) =>
  Math.round(yearlyFullPriceInr(monthlyPriceInr) * (1 - YEARLY_DISCOUNT_PERCENT / 100));

export const yearlyEffectiveMonthlyInr = (monthlyPriceInr: number) =>
  yearlyPriceInr(monthlyPriceInr) / 12;

export const planPriceInr = (plan: CatalogPlan, cycle: BillingCycle) =>
  cycle === "yearly" ? yearlyPriceInr(plan.monthlyPriceInr) : plan.monthlyPriceInr;

export const razorpayPlanEnvKey = (planId: PlanId, cycle: BillingCycle) => {
  const keys = {
    plus: {
      monthly: "NEXT_PUBLIC_RZP_PLUS_MONTHLY_PLAN_ID",
      yearly: "NEXT_PUBLIC_RZP_PLUS_YEARLY_PLAN_ID",
    },
    pro: {
      monthly: "NEXT_PUBLIC_RZP_PRO_MONTHLY_PLAN_ID",
      yearly: "NEXT_PUBLIC_RZP_PRO_YEARLY_PLAN_ID",
    },
  } as const;
  return keys[planId][cycle];
};

export const razorpayPlanId = (planId: PlanId, cycle: BillingCycle) => {
  const specific = process.env[razorpayPlanEnvKey(planId, cycle)];
  if (specific) return specific;
  return cycle === "yearly"
    ? process.env.NEXT_PUBLIC_RZP_YEARLY_PLAN_ID
    : process.env.NEXT_PUBLIC_RZP_MONTHLY_PLAN_ID;
};

export const formatInrAmount = (amount: number) =>
  amount.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });

export const inrLabel = (amount: number) => `₹${formatInrAmount(amount)}`;
