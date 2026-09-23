export type StoreHeader = {
  layout: "spacious" | "compact";
  enabled: boolean;
  kind: "offer" | "arrival" | "announcement";
  title: string;
  code: string;
  banners: { url: string; alt: string }[];
  autoSlide: boolean;
  slideDelay: number;
};

export function normalizeStoreHeader(value: unknown): StoreHeader {
  const data = value && typeof value === "object" ? value as Partial<StoreHeader> : {};
  return {
    layout: data.layout === "compact" ? "compact" : "spacious",
    enabled: data.enabled !== false,
    kind: data.kind === "offer" || data.kind === "arrival" ? data.kind : "announcement",
    title: typeof data.title === "string" ? data.title.slice(0, 100) : "",
    code: typeof data.code === "string" ? data.code.slice(0, 30) : "",
    autoSlide: data.autoSlide !== false,
    slideDelay: typeof data.slideDelay === "number" && Number.isFinite(data.slideDelay)
      ? Math.min(30, Math.max(1, Math.round(data.slideDelay))) : 3,
    banners: Array.isArray(data.banners) ? data.banners.filter((banner) =>
      banner && typeof banner.url === "string" && /^https?:\/\//.test(banner.url)
    ).slice(0, 3).map((banner) => ({ url: banner.url, alt: typeof banner.alt === "string" ? banner.alt.slice(0, 160) : "" })) : [],
  };
}

// Compatibility for databases that have not added store_header yet.
const HEADER_PREFIX = "productshare:store-header:v1:";

export function unpackStoreNotes(value: string | null | undefined): {
  notes: string; header?: StoreHeader;
} {
  const notes = value ?? "";
  if (!notes.startsWith(HEADER_PREFIX)) return { notes };
  try {
    const data = JSON.parse(notes.slice(HEADER_PREFIX.length));
    if (data && typeof data.notes === "string" && data.header && typeof data.header === "object") {
      return { notes: data.notes, header: normalizeStoreHeader(data.header) };
    }
  } catch { /* Preserve ordinary notes, even if they resemble the prefix. */ }
  return { notes };
}

export function packStoreNotes(notes: string, header: StoreHeader): string {
  return HEADER_PREFIX + JSON.stringify({ notes, header: normalizeStoreHeader(header) });
}
