export const STORE_THEME_IDS = [
  "minimal",
  "editorial",
  "studio",
  "boutique",
  "noir",
  "ocean",
  "botanical",
  "luxe",
  "bazaar",
  "canvas",
  "ember",
  "harbor",
] as const;

export type StoreThemeId = (typeof STORE_THEME_IDS)[number];

export type StoreTheme = {
  id: StoreThemeId;
  name: string;
  description: string;
  accent: string;
  accentSoft: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  radius: string;
  radiusSm: string;
  dark?: boolean;
  serif?: boolean;
  previewBg: string;
  previewSurface: string;
};

export const STORE_THEMES: StoreTheme[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean catalog with soft cards and a violet accent.",
    accent: "#7c3aed",
    accentSoft: "#ede9fe",
    bg: "#f6f7fb",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0",
    radius: "24px",
    radiusSm: "12px",
    previewBg: "#f6f7fb",
    previewSurface: "#ffffff",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Warm magazine layout with sharp edges and serif titles.",
    accent: "#c45c26",
    accentSoft: "#fde8d8",
    bg: "#f3eee4",
    surface: "#fffaf2",
    text: "#1c1917",
    muted: "#78716c",
    border: "#e7e0d4",
    radius: "2px",
    radiusSm: "2px",
    serif: true,
    previewBg: "#f3eee4",
    previewSurface: "#fffaf2",
  },
  {
    id: "studio",
    name: "Studio",
    description: "Dark gallery look with teal highlights.",
    accent: "#14b8a6",
    accentSoft: "#134e4a",
    bg: "#101418",
    surface: "#181e24",
    text: "#f1f5f9",
    muted: "#94a3b8",
    border: "#2a333c",
    radius: "14px",
    radiusSm: "10px",
    dark: true,
    previewBg: "#101418",
    previewSurface: "#181e24",
  },
  {
    id: "boutique",
    name: "Boutique",
    description: "Blush fashion look with rose accents and rounded cards.",
    accent: "#e11d48",
    accentSoft: "#ffe4e8",
    bg: "#fff5f7",
    surface: "#ffffff",
    text: "#3f272c",
    muted: "#9f7a82",
    border: "#f4d5db",
    radius: "20px",
    radiusSm: "12px",
    previewBg: "#fff5f7",
    previewSurface: "#ffffff",
  },
  {
    id: "noir",
    name: "Noir",
    description: "Black luxury catalog with gold highlights and sharp edges.",
    accent: "#d4a017",
    accentSoft: "#3a3010",
    bg: "#0b0b0b",
    surface: "#161616",
    text: "#f5f5f4",
    muted: "#a8a29e",
    border: "#2c2c2c",
    radius: "2px",
    radiusSm: "2px",
    dark: true,
    previewBg: "#0b0b0b",
    previewSurface: "#161616",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool coastal catalog with teal-blue cards.",
    accent: "#0e7490",
    accentSoft: "#e0f2fe",
    bg: "#eef4f8",
    surface: "#ffffff",
    text: "#0f2a38",
    muted: "#5b7382",
    border: "#cfe0ea",
    radius: "16px",
    radiusSm: "10px",
    previewBg: "#eef4f8",
    previewSurface: "#ffffff",
  },
  {
    id: "botanical",
    name: "Botanical",
    description: "Sage and cream for natural, handmade brands.",
    accent: "#4d7c4d",
    accentSoft: "#e7f0e4",
    bg: "#f3f6f1",
    surface: "#fbfdf8",
    text: "#243126",
    muted: "#6b7a6c",
    border: "#d5e0d2",
    radius: "18px",
    radiusSm: "12px",
    previewBg: "#f3f6f1",
    previewSurface: "#fbfdf8",
  },
  {
    id: "luxe",
    name: "Luxe",
    description: "Cream and burgundy with elegant serif titles.",
    accent: "#7a1f3d",
    accentSoft: "#f3e4ea",
    bg: "#f7f1e8",
    surface: "#fffdf8",
    text: "#2b1c16",
    muted: "#8a7368",
    border: "#e6d7c6",
    radius: "4px",
    radiusSm: "4px",
    serif: true,
    previewBg: "#f7f1e8",
    previewSurface: "#fffdf8",
  },
  {
    id: "bazaar",
    name: "Bazaar",
    description: "Warm marketplace feel with saffron highlights.",
    accent: "#e05a00",
    accentSoft: "#ffedd5",
    bg: "#fffaf5",
    surface: "#ffffff",
    text: "#3b2414",
    muted: "#8d6b52",
    border: "#f0ddc8",
    radius: "10px",
    radiusSm: "8px",
    previewBg: "#fffaf5",
    previewSurface: "#ffffff",
  },
  {
    id: "canvas",
    name: "Canvas",
    description: "Soft gallery whites with a slate accent.",
    accent: "#475569",
    accentSoft: "#e2e8f0",
    bg: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0",
    radius: "12px",
    radiusSm: "8px",
    previewBg: "#f8fafc",
    previewSurface: "#ffffff",
  },
  {
    id: "ember",
    name: "Ember",
    description: "Warm terracotta catalog with cream surfaces.",
    accent: "#c2410c",
    accentSoft: "#ffedd5",
    bg: "#fff7ed",
    surface: "#fffdfb",
    text: "#431407",
    muted: "#9a3412",
    border: "#fed7aa",
    radius: "16px",
    radiusSm: "10px",
    previewBg: "#fff7ed",
    previewSurface: "#fffdfb",
  },
  {
    id: "harbor",
    name: "Harbor",
    description: "Deep navy storefront with sky-blue highlights.",
    accent: "#38bdf8",
    accentSoft: "#0c4a6e",
    bg: "#0b1220",
    surface: "#111827",
    text: "#e2e8f0",
    muted: "#94a3b8",
    border: "#1e293b",
    radius: "14px",
    radiusSm: "10px",
    dark: true,
    previewBg: "#0b1220",
    previewSurface: "#111827",
  },
];

export const STORE_THEME_MAP = Object.fromEntries(
  STORE_THEMES.map((theme) => [theme.id, theme]),
) as Record<StoreThemeId, StoreTheme>;

export const DEFAULT_STORE_THEME: StoreThemeId = "minimal";

export const DASHBOARD_THEME_EVENT = "productshare:store-theme";
export const DASHBOARD_THEME_STORAGE_KEY = "ps-store-theme";

export const normalizeStoreTheme = (value?: string | null): StoreThemeId =>
  STORE_THEME_IDS.includes(value as StoreThemeId)
    ? (value as StoreThemeId)
    : DEFAULT_STORE_THEME;

const parseHex = (hex: string): [number, number, number] | null => {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((char) => char + char)
          .join("")
      : raw;
  if (full.length !== 6) return null;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return null;
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0"))
    .join("")}`;

const shadeHex = (hex: string, percent: number) => {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const adj = (channel: number) => channel * (1 + percent);
  return toHex(adj(rgb[0]), adj(rgb[1]), adj(rgb[2]));
};

const mixHex = (hexA: string, hexB: string, amountA: number) => {
  const a = parseHex(hexA);
  const b = parseHex(hexB);
  if (!a || !b) return hexA;
  const mix = (left: number, right: number) => left * amountA + right * (1 - amountA);
  return toHex(mix(a[0], b[0]), mix(a[1], b[1]), mix(a[2], b[2]));
};

export const emitStoreThemeChange = (id: StoreThemeId) => {
  try {
    localStorage.setItem(DASHBOARD_THEME_STORAGE_KEY, id);
  } catch {
    /* ignore quota / private mode */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DASHBOARD_THEME_EVENT, { detail: id }));
  }
};

export const storeThemeCssVars = (
  theme: StoreTheme,
): Record<`--${string}`, string> => ({
  "--sf-bg": theme.bg,
  "--sf-surface": theme.surface,
  "--sf-text": theme.text,
  "--sf-muted": theme.muted,
  "--sf-border": theme.border,
  "--sf-accent": theme.accent,
  "--sf-accent-soft": theme.accentSoft,
  "--sf-radius": theme.radius,
  "--sf-radius-sm": theme.radiusSm,
});

export const dashboardThemeCssVars = (
  theme: StoreTheme,
): Record<`--${string}`, string> => {
  const soft = theme.dark
    ? mixHex(theme.accent, theme.surface, 0.28)
    : theme.accentSoft;
  const accentText = theme.dark ? theme.accent : shadeHex(theme.accent, -0.16);

  return {
    "--ds-violet": theme.accent,
    "--ds-violet-dark": accentText,
    "--ds-violet-soft": soft,
    "--ds-ink": theme.text,
    "--ds-muted": theme.muted,
    "--ds-border": theme.border,
    "--ds-canvas": theme.bg,
    "--ds-surface": theme.surface,
    "--ds-sidebar": theme.dark ? mixHex(theme.surface, theme.bg, 0.65) : theme.surface,
    "--ds-teal": theme.accent,
    "--ds-teal-soft": soft,
  };
};
