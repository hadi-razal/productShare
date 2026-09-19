export const STORE_FONT_IDS = [
  "default",
  "modern",
  "classic",
  "serif",
  "soft",
  "luxury",
  "geometric",
  "display",
] as const;

export type StoreFontId = (typeof STORE_FONT_IDS)[number];

export type StoreFont = {
  id: StoreFontId;
  name: string;
  description: string;
  body: string;
  title: string;
  titleTracking?: string;
  googleFamilies?: string[];
};

export const DEFAULT_STORE_FONT: StoreFontId = "default";

export const STORE_FONTS: StoreFont[] = [
  {
    id: "default",
    name: "Default",
    description: "Current Product Share catalog type.",
    body: 'var(--font-poppins), Poppins, sans-serif',
    title: 'var(--font-poppins), Poppins, sans-serif',
  },
  {
    id: "modern",
    name: "Modern",
    description: "Neutral Inter for a clean shop.",
    body: "Inter, ui-sans-serif, system-ui, sans-serif",
    title: "Inter, ui-sans-serif, system-ui, sans-serif",
    titleTracking: "-0.03em",
    googleFamilies: ["Inter:wght@400;500;600;700"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional serif, no extra download.",
    body: 'Georgia, "Iowan Old Style", "Times New Roman", serif',
    title: 'Georgia, "Iowan Old Style", "Times New Roman", serif',
    titleTracking: "-0.02em",
  },
  {
    id: "serif",
    name: "Serif",
    description: "Playfair titles with a reading serif.",
    body: '"Source Serif 4", Georgia, serif',
    title: '"Playfair Display", Georgia, serif',
    titleTracking: "-0.03em",
    googleFamilies: [
      "Playfair+Display:wght@500;600;700",
      "Source+Serif+4:wght@400;600;700",
    ],
  },
  {
    id: "soft",
    name: "Soft",
    description: "Rounded Nunito for a friendly store.",
    body: "Nunito, ui-sans-serif, sans-serif",
    title: "Nunito, ui-sans-serif, sans-serif",
    googleFamilies: ["Nunito:wght@400;500;600;700"],
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Cormorant for boutiques and gifts.",
    body: '"Cormorant Garamond", Georgia, serif',
    title: '"Cormorant Garamond", Georgia, serif',
    titleTracking: "-0.02em",
    googleFamilies: ["Cormorant+Garamond:wght@400;500;600;700"],
  },
  {
    id: "geometric",
    name: "Geometric",
    description: "Outfit for a modern product grid.",
    body: "Outfit, ui-sans-serif, sans-serif",
    title: "Outfit, ui-sans-serif, sans-serif",
    titleTracking: "-0.03em",
    googleFamilies: ["Outfit:wght@400;500;600;700"],
  },
  {
    id: "display",
    name: "Display",
    description: "Fraunces titles with a soft body.",
    body: "Nunito, ui-sans-serif, sans-serif",
    title: "Fraunces, Georgia, serif",
    titleTracking: "-0.03em",
    googleFamilies: [
      "Fraunces:wght@500;600;700",
      "Nunito:wght@400;500;600;700",
    ],
  },
];

export const STORE_FONT_MAP = Object.fromEntries(
  STORE_FONTS.map((font) => [font.id, font]),
) as Record<StoreFontId, StoreFont>;

export const fontIdFromStoredTheme = (value?: string | null): StoreFontId | null => {
  const fontId = String(value ?? "").split("::")[1];
  return STORE_FONT_IDS.includes(fontId as StoreFontId)
    ? (fontId as StoreFontId)
    : null;
};

export const normalizeStoreFont = (value?: string | null): StoreFontId =>
  STORE_FONT_IDS.includes(value as StoreFontId)
    ? (value as StoreFontId)
    : DEFAULT_STORE_FONT;

export const packedStoreThemeValue = (theme: string, font: string) =>
  font && font !== DEFAULT_STORE_FONT ? `${theme}::${font}` : theme;

export const storeFontCssVars = (
  font: StoreFont,
): Record<`--${string}`, string> => ({
  "--sf-font-body": font.body,
  "--sf-font-title": font.title,
  "--sf-title-tracking": font.titleTracking ?? "inherit",
});

const uniqueFamilies = (families: string[]) => [...new Set(families)];

export const googleFontsHref = (families: string[]) => {
  const list = uniqueFamilies(families).filter(Boolean);
  if (!list.length) return null;
  return `https://fonts.googleapis.com/css2?${list
    .map((family) => `family=${family}`)
    .join("&")}&display=swap`;
};

export const storeFontStylesheetHref = (id: StoreFontId) =>
  googleFontsHref(STORE_FONT_MAP[id].googleFamilies ?? []);

export const STORE_FONTS_CATALOG_STYLESHEET = googleFontsHref(
  STORE_FONTS.flatMap((font) => font.googleFamilies ?? []),
);

const FONT_LINK_ID = "ps-store-font-link";

export const ensureStoreFontStylesheet = (href: string | null) => {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!href) {
    existing?.remove();
    return;
  }
  if (existing) {
    if (existing.getAttribute("href") !== href) existing.href = href;
    return;
  }
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};
