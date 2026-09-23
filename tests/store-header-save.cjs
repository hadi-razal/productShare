const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

function load(file, dependencies = {}) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function("require", "module", "exports", source)(
    (name) => dependencies[name] || {}, module, module.exports,
  );
  return module.exports;
}

const header = load("lib/store-header.ts");
let row = { id: "test", additional_notes: "Original message" };
let missing = new Set(["store_header", "store_font"]);
let failure = null;
const supabase = { from: () => ({
  update: (payload) => ({ eq: async () => {
    if (failure) return { error: failure };
    const column = Object.keys(payload).find((key) => missing.has(key));
    if (column) return { error: { code: "PGRST204", message: `Could not find the '${column}' column of 'stores' in the schema cache` } };
    row = { ...row, ...payload };
    return { error: null };
  } }),
  select: () => ({ eq: () => ({
    single: async () => ({ data: row, error: null }),
    maybeSingle: async () => ({ data: row, error: null }),
  }) }),
}) };
const db = load("lib/db.ts", {
  "@/lib/supabase": { supabase },
  "@/lib/store-header": header,
  "@/lib/product-categories": { asCategoryList: () => [] },
  "@/lib/store-fonts": {
    fontIdFromStoredTheme: () => "default",
    packedStoreThemeValue: (theme, font) => `${theme}::${font}`,
  },
});

(async () => {
  assert.equal(header.normalizeStoreHeader({}).slideDelay, 3);
  assert.equal(header.normalizeStoreHeader({}).autoSlide, true);
  assert.equal(header.normalizeStoreHeader({ slideDelay: -5 }).slideDelay, 1);
  assert.equal(header.normalizeStoreHeader({ slideDelay: 50 }).slideDelay, 30);
  const config = header.normalizeStoreHeader({ autoSlide: false, slideDelay: 7, kind: "offer", title: "Weekend offer", code: "SAVE10", banners: [
    { url: "https://example.com/banner.jpg", alt: "Weekend discount" },
  ] });
  assert.equal(header.normalizeStoreHeader({ banners: Array(4).fill(config.banners[0]) }).banners.length, 3);
  assert.equal(header.normalizeStoreHeader({ banners: [{ url: "javascript:alert(1)" }] }).banners.length, 0);
  await db.updateStore("test", { storeHeader: config, additionalNotes: "Save today", storeTheme: "minimal", storeFont: "display" });
  let store = await db.getStoreById("test");
  assert.deepEqual(store.storeHeader, config);
  assert.equal(store.additionalNotes, "Save today");
  assert.equal(row.store_theme, "minimal::display");
  await db.updateStore("test", { additionalNotes: "Updated message" });
  assert.deepEqual((await db.getStoreById("test")).storeHeader, config);
  await db.updateStore("test", { storeHeader: { ...config, enabled: false } });
  assert.equal((await db.getStoreById("test")).additionalNotes, "Updated message");
  assert.equal((await db.getStoreById("test")).storeHeader.enabled, false);
  missing.clear();
  await db.updateStore("test", { storeHeader: config });
  assert.deepEqual((await db.getStoreById("test")).storeHeader, config);
  assert.equal(row.additional_notes, "Updated message");
  await db.updateStore("test", { storeHeader: config, additionalNotes: "After migration" });
  assert.deepEqual(row.store_header, config);
  assert.equal(row.additional_notes, "After migration");
  failure = { code: "42501", message: "Permission denied" };
  await assert.rejects(db.updateStore("test", { name: "Test" }), (error) => error === failure);
  assert.equal(header.unpackStoreNotes("productshare:store-header:v1:invalid").notes, "productshare:store-header:v1:invalid");
  console.log("Store header save regression checks passed");
})().catch((error) => { console.error(error); process.exitCode = 1; });
