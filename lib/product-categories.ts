export type ProductCategoryOption = {
  value: string;
  label: string;
};

export const DEFAULT_PRODUCT_CATEGORIES: ProductCategoryOption[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home & Garden" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "autoMobiles", label: "Automobiles" },
  { value: "books", label: "Books" },
  { value: "toys", label: "Toys & Games" },
  { value: "accessories", label: "Accessories" },
  { value: "footwear", label: "Footwear" },
];

export const normalizeCategoryName = (value: string) =>
  value.trim().replace(/\s+/g, " ");

export const asCategoryList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const list: string[] = [];
  for (const item of value) {
    const name = normalizeCategoryName(String(item || ""));
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    list.push(name);
  }
  return list;
};

const defaultMatch = (name: string) => {
  const key = name.trim().toLowerCase();
  return DEFAULT_PRODUCT_CATEGORIES.find(
    (category) =>
      category.value.toLowerCase() === key || category.label.toLowerCase() === key,
  );
};

export const resolveCategoryValue = (name: string) => {
  const trimmed = normalizeCategoryName(name);
  if (!trimmed) return "";
  return defaultMatch(trimmed)?.value || trimmed;
};

export const addCustomCategory = (existing: string[], name: string) => {
  const trimmed = normalizeCategoryName(name);
  if (!trimmed) return asCategoryList(existing);
  return asCategoryList([...existing, trimmed]);
};

export const removeCustomCategory = (existing: string[], name: string) => {
  const key = normalizeCategoryName(name).toLowerCase();
  return asCategoryList(existing).filter((item) => item.toLowerCase() !== key);
};

const toCategoryOptions = (names: string[]): ProductCategoryOption[] => {
  const options: ProductCategoryOption[] = [];
  const seen = new Set<string>();

  for (const raw of names) {
    const name = normalizeCategoryName(raw);
    if (!name) continue;
    const option = defaultMatch(name) || { value: name, label: name };
    const keys = [option.value, option.label].map((item) => item.toLowerCase());
    if (keys.some((key) => seen.has(key))) continue;
    keys.forEach((key) => seen.add(key));
    options.push(option);
  }

  return options;
};

export const mergeProductCategories = (
  custom: string[] = [],
  currentValue = "",
): ProductCategoryOption[] => {
  const names = asCategoryList(custom);
  const includeDefaults = !names.some((name) => defaultMatch(name));
  const source = includeDefaults
    ? [...DEFAULT_PRODUCT_CATEGORIES.map((category) => category.label), ...names]
    : names;
  return toCategoryOptions([...source, currentValue]);
};

export const categoryLabel = (value?: string | null) => {
  if (!value) return "";
  return defaultMatch(value)?.label || value;
};

export const categoryKeys = (value: string) => {
  const label = categoryLabel(value);
  return Array.from(new Set([value, label].map((item) => normalizeCategoryName(item)).filter(Boolean)));
};

export const renameCategory = (list: string[], from: string, to: string) => {
  const next = normalizeCategoryName(to);
  if (!next) return null;
  const fromKeys = new Set(categoryKeys(from).map((item) => item.toLowerCase()));
  const duplicate = list.some((item) => {
    const key = item.toLowerCase();
    if (fromKeys.has(key) || fromKeys.has(categoryLabel(item).toLowerCase())) return false;
    return key === next.toLowerCase() || categoryLabel(item).toLowerCase() === next.toLowerCase();
  });
  if (duplicate) return null;
  return asCategoryList(
    list.map((item) =>
      fromKeys.has(item.toLowerCase()) || fromKeys.has(categoryLabel(item).toLowerCase())
        ? next
        : item,
    ),
  );
};

export const isClothingCategory = (value?: string | null) => {
  const key = String(value || "").trim().toLowerCase();
  return key === "clothing" || key === "apparel";
};
