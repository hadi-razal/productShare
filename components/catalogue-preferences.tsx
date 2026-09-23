"use client";
import { createContext, useContext } from "react";
export type CataloguePreferences = {
  storeHeader?: import("@/lib/store-header").StoreHeader;
  themeColor?: string;
  currency?: string;
  showWhatsappButton?: boolean;
  allowProductEnquiries?: boolean;
  whatsappNumber?: string;
};
export const CataloguePreferencesContext = createContext<CataloguePreferences>({
  currency: "INR",
  showWhatsappButton: true,
  allowProductEnquiries: true,
});
export const useCataloguePreferences = () =>
  useContext(CataloguePreferencesContext);
export const cataloguePrice = (value: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: ["INR", "USD", "EUR", "GBP", "AED"].includes(currency)
      ? currency
      : "INR",
    minimumFractionDigits: 2,
  }).format(value);

export function brandForeground(color: string) {
  const rgb = color
    .slice(1)
    .match(/../g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 > 0.179
    ? "#17171C"
    : "#fff";
}
