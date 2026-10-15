import { useMemo } from "react";
import type { ContactMessageRecord, ProductRecord, StoreRecord } from "@/lib/db";
import { ACTIVITY_LABELS, type StoreActivityRecord } from "@/lib/activity";
import { missingStoreProfileFields } from "@/lib/store-profile";

const DAY_MS = 24 * 60 * 60 * 1000;

const dateTime = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
};

export const relativeTime = (value?: string | null) => {
  if (!value) return "Never";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Never";
  const diff = Date.now() - time;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < DAY_MS) return `${Math.floor(diff / 3_600_000)}h ago`;
  const days = Math.floor(diff / DAY_MS);
  return days < 30 ? `${days}d ago` : new Date(time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const productTime = (product: ProductRecord) => {
  const value = product.createdAt;
  if (value && typeof value === "object") return value.toMillis();
  const time = value ? new Date(value as string | number).getTime() : NaN;
  return Number.isNaN(time) ? null : time;
};

const activityDetail =(item: StoreActivityRecord) => {
  const { productName, count } = item.detail;
  if (item.type === "product_deleted" && Number(count) > 1) return `${count} products`;
  return productName ? String(productName) : "";
};

export default function StoreBehaviour({
  store,
  products,
  activity,
  messages,
}: {
  store: StoreRecord;
  products: ProductRecord[];
  activity: StoreActivityRecord[];
  messages: ContactMessageRecord[];
}) {
  const summary = useMemo(() => {
    const since = Date.now() - 30 * DAY_MS;
    const recent = activity.filter((item) => new Date(item.createdAt).getTime() >= since);
    const count = (items: StoreActivityRecord[], type: StoreActivityRecord["type"]) =>
      items.filter((item) => item.type === type).length;

    const enquiriesByProduct = new Map<string, { name: string; count: number }>();
    for (const item of activity) {
      if (item.type !== "enquiry") continue;
      const key = String(item.detail.productId || item.detail.productName || "unknown");
      const entry = enquiriesByProduct.get(key) ?? { name: String(item.detail.productName || "Unknown product"), count: 0 };
      entry.count += 1;
      enquiriesByProduct.set(key, entry);
    }

    const latestProduct = [...products]
      .filter((product) => productTime(product) !== null)
      .sort((a, b) => (productTime(b) ?? 0) - (productTime(a) ?? 0))[0];
    const ownerActivity = activity.find((item) => item.type !== "enquiry");

    return {
      lastActive: store.lastActiveAt || ownerActivity?.createdAt || null,
      sessions30: count(recent, "session"),
      added30: count(recent, "product_added"),
      edited30: count(recent, "product_updated"),
      deleted30: recent
        .filter((item) => item.type === "product_deleted")
        .reduce((sum, item) => sum + (Number(item.detail.count) || 1), 0),
      enquiries30: count(recent, "enquiry"),
      enquiriesAll: count(activity, "enquiry"),
      productViews: products.reduce((sum, product) => sum + Number(product.views || 0), 0),
      hidden: products.filter((product) => product.isHidden).length,
      outOfStock: products.filter((product) => product.isInStock === false).length,
      latestProduct,
      topViewed: [...products].sort((a, b) => Number(b.views || 0) - Number(a.views || 0)).slice(0, 5),
      topEnquired: [...enquiriesByProduct.values()].sort((a, b) => b.count - a.count).slice(0, 5),
      missingProfile: missingStoreProfileFields(store),
      lastMessage: messages[0],
    };
  }, [activity, messages, products, store]);

  const timeline = activity.slice(0, 50);

  return (
    <section className="ds-catalog-card ps-behaviour" style={{ marginBottom: 16 }}>
      <div className="ds-catalog-toolbar">
        <strong style={{ fontSize: 14 }}>Owner behaviour</strong>
        <span className="ps-behaviour-hint">Last 30 days unless noted</span>
      </div>

      <div className="ps-behaviour-body">
        <div className="ds-admin-meta">
          <div><span>Last active</span><strong title={dateTime(summary.lastActive)}>{relativeTime(summary.lastActive)}</strong></div>
          <div><span>Dashboard sessions</span><strong>{summary.sessions30}</strong></div>
          <div><span>Products added</span><strong>{summary.added30}</strong></div>
          <div><span>Products edited</span><strong>{summary.edited30}</strong></div>
          <div><span>Products deleted</span><strong>{summary.deleted30}</strong></div>
          <div><span>WhatsApp enquiries</span><strong>{summary.enquiries30} <small>({summary.enquiriesAll} all time)</small></strong></div>
          <div><span>Store visits (all time)</span><strong>{Number(store.visitCount || 0).toLocaleString("en-IN")}</strong></div>
          <div><span>Product views (all time)</span><strong>{summary.productViews.toLocaleString("en-IN")}</strong></div>
          <div><span>Hidden / out of stock</span><strong>{summary.hidden} / {summary.outOfStock}</strong></div>
          <div>
            <span>Last product added</span>
            <strong>{summary.latestProduct ? dateTime(productTime(summary.latestProduct)) : "—"}</strong>
            {summary.latestProduct ? <small className="ps-behaviour-sub">{summary.latestProduct.name}</small> : null}
          </div>
          <div>
            <span>Messages to ProductShare</span>
            <strong>{messages.length}</strong>
            {summary.lastMessage ? <small className="ps-behaviour-sub">Last {relativeTime(summary.lastMessage.createdAt)}</small> : null}
          </div>
          <div>
            <span>Profile</span>
            <strong>{summary.missingProfile.length ? "Incomplete" : "Complete"}</strong>
            {summary.missingProfile.length ? <small className="ps-behaviour-sub">Missing: {summary.missingProfile.join(", ")}</small> : null}
          </div>
        </div>

        <div className="ds-admin-meta ps-behaviour-setup">
          <div><span>Logo</span><strong>{store.logoImage || store.image ? "Uploaded" : "None"}</strong></div>
          <div><span>WhatsApp button</span><strong>{store.showWhatsappButton === false ? "Off" : "On"}</strong></div>
          <div><span>Enquiries</span><strong>{store.allowProductEnquiries === false ? "Off" : "On"}</strong></div>
          <div><span>Theme</span><strong>{store.storeTheme || "minimal"}</strong></div>
          <div><span>Currency</span><strong>{store.currency || "INR"}</strong></div>
          <div><span>Categories</span><strong>{store.productCategories?.length ?? 0}</strong></div>
        </div>

        <div className="ps-behaviour-lists">
          <div>
            <h3>Most viewed products</h3>
            {summary.topViewed.length ? (
              <ol>
                {summary.topViewed.map((product) => (
                  <li key={product.id}><span>{product.name || "Untitled"}</span><b>{Number(product.views || 0).toLocaleString("en-IN")}</b></li>
                ))}
              </ol>
            ) : <p>No products yet.</p>}
          </div>
          <div>
            <h3>Most enquired products</h3>
            {summary.topEnquired.length ? (
              <ol>
                {summary.topEnquired.map((entry) => (
                  <li key={entry.name}><span>{entry.name}</span><b>{entry.count}</b></li>
                ))}
              </ol>
            ) : <p>No enquiries recorded yet.</p>}
          </div>
        </div>

        <div className="ps-behaviour-timeline">
          <h3>Activity timeline</h3>
          {timeline.length ? (
            <ul>
              {timeline.map((item) => (
                <li key={item.id} className={item.type === "enquiry" ? "is-shopper" : ""}>
                  <time dateTime={item.createdAt}>{dateTime(item.createdAt)}</time>
                  <span>
                    {ACTIVITY_LABELS[item.type] ?? item.type}
                    {activityDetail(item) ? <em> · {activityDetail(item)}</em> : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No activity recorded yet. Tracking starts once the store_activity migration is run.</p>
          )}
        </div>
      </div>
    </section>
  );
}
