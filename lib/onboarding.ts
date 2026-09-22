import { z } from "zod";
import { isValidUsername } from "@/lib/username-rules";
import { isValidWhatsappNumber } from "@/lib/whatsapp";

export const categories = [
  "Fashion & Clothing",
  "Jewellery",
  "Furniture",
  "Electronics",
  "Home Décor",
  "Beauty & Cosmetics",
  "Food Products",
  "Building Materials",
  "Automobile Accessories",
  "Industrial Products",
  "Wholesale & Distribution",
  "Other",
] as const;
export const sharingMethods = [
  "WhatsApp images",
  "PDF catalogues",
  "Excel or spreadsheets",
  "Printed catalogues",
  "Social media",
  "Website",
  "I don’t have a catalogue yet",
] as const;
export const productRanges = [
  "Fewer than 20",
  "20–50",
  "51–100",
  "101–500",
  "More than 500",
] as const;
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
export const onboardingSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Please enter at least two characters.")
      .max(100),
    email: z.string().email("Enter a valid email address."),
    country_code: z.enum(["+91", "+1", "+44", "+971", "+61"]),
    contact_number: z
      .string()
      .regex(/^\d{7,14}$/, "Enter a valid contact number."),
    store_name: z.string().trim().min(2, "Enter your store name.").max(100),
    store_description: z.string().max(160),
    store_logo_url: z.union([
      z.literal(""),
      z.string().url().startsWith("https://"),
    ]),
    city: z.string().trim().min(1, "Enter your city.").max(80),
    state: z.string().trim().min(1, "Enter your state.").max(80),
    business_category: z
      .enum([...categories, ""])
      .refine((value): boolean => value !== "", "Choose a business category."),
    custom_business_category: z.string().max(80),
    catalogue_sharing_methods: z
      .array(z.enum(sharingMethods))
      .min(1, "Choose at least one option."),
    product_count_range: z
      .enum([...productRanges, ""])
      .refine((value): boolean => value !== "", "Choose your product range."),
    store_slug: z
      .string()
      .refine(
        isValidUsername,
        "Use 3–30 letters, numbers or hyphens. Start and end with a letter or number.",
      ),
    brand_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    whatsapp_number: z.string().max(16),
    show_whatsapp_button: z.boolean(),
    allow_product_enquiries: z.boolean(),
    currency: z.enum(["INR", "USD", "EUR", "GBP", "AED"]),
  })
  .superRefine((data, ctx) => {
    if (
      data.country_code === "+91" &&
      !/^[6-9]\d{9}$/.test(data.contact_number)
    )
      ctx.addIssue({
        code: "custom",
        path: ["contact_number"],
        message: "Enter a 10-digit Indian mobile number starting with 6–9.",
      });
    if (
      data.business_category === "Other" &&
      data.custom_business_category.trim().length < 2
    )
      ctx.addIssue({
        code: "custom",
        path: ["custom_business_category"],
        message: "Tell us your business category.",
      });
    if (
      (data.show_whatsapp_button || data.whatsapp_number) &&
      (!/^[1-9]\d{7,14}$/.test(data.whatsapp_number) ||
        !isValidWhatsappNumber(data.whatsapp_number))
    )
      ctx.addIssue({
        code: "custom",
        path: ["whatsapp_number"],
        message: "Enter a valid number with country code, e.g. 919876543210.",
      });
  });
export type OnboardingData = z.infer<typeof onboardingSchema>;
export const defaults: OnboardingData = {
  full_name: "",
  email: "",
  country_code: "+91",
  contact_number: "",
  store_name: "",
  store_description: "",
  store_logo_url: "",
  city: "",
  state: "",
  business_category: "",
  custom_business_category: "",
  catalogue_sharing_methods: [],
  product_count_range: "",
  store_slug: "",
  brand_color: "#6860C9",
  whatsapp_number: "",
  show_whatsapp_button: true,
  allow_product_enquiries: true,
  currency: "INR",
};
export const stepFields: (keyof OnboardingData)[][] = [
  [],
  ["full_name", "country_code", "contact_number", "email"],
  ["store_name", "store_description", "store_logo_url", "city", "state"],
  ["business_category", "custom_business_category"],
  ["catalogue_sharing_methods", "product_count_range"],
  [
    "store_slug",
    "brand_color",
    "whatsapp_number",
    "show_whatsapp_button",
    "allow_product_enquiries",
    "currency",
  ],
  [],
];
export function stepErrors(data: OnboardingData, step: number) {
  const result = onboardingSchema.safeParse(data);
  return result.success
    ? []
    : result.error.issues.filter(
        (issue) =>
          step === 6 ||
          stepFields[step].includes(issue.path[0] as keyof OnboardingData),
      );
}
