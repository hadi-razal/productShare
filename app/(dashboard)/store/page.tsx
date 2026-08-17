"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthChange } from "@/lib/auth";
import { getStoreById, listProductsByStore } from "@/lib/db";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiCopy,
  FiExternalLink,
  FiEye,
  FiMessageCircle,
  FiPackage,
  FiRefreshCw,
  FiShare2,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getUsername } from "@/helpers/getUsername";
import type { ProductType } from "@/type";

type DashboardProduct = Partial<ProductType> & { id: string };
type ChartPoint = { name: string; views: number };

const fallbackImages = [
  "/dashboard/handwoven-tote.png",
  "/dashboard/sandstone-vase.png",
  "/dashboard/linen-table-runner.png",
];

const demoProducts: DashboardProduct[] = [
  {
    id: "preview-tote",
    name: "Handwoven Tote",
    regularPrice: 1299,
    views: 362,
    isInStock: true,
    availableStock: "18",
    images: [fallbackImages[0]],
  },
  {
    id: "preview-vase",
    name: "Sandstone Vase",
    regularPrice: 899,
    views: 278,
    isInStock: true,
    availableStock: "3",
    images: [fallbackImages[1]],
  },
  {
    id: "preview-linen",
    name: "Linen Table Runner",
    regularPrice: 699,
    views: 194,
    isInStock: true,
    availableStock: "12",
    images: [fallbackImages[2]],
  },
];

const demoChart: ChartPoint[] = [
  { name: "Jul 28", views: 204 },
  { name: "Jul 29", views: 282 },
  { name: "Jul 30", views: 356 },
  { name: "Jul 31", views: 486 },
  { name: "Aug 1", views: 521 },
  { name: "Aug 2", views: 342 },
  { name: "Aug 3", views: 298 },
];

const Pulse = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />
);

const priceLabel = (product: DashboardProduct) => {
  const value = Number(product.discountPrice || product.regularPrice || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const stockCount = (product: DashboardProduct) => {
  const parsed = Number(product.availableStock);
  return Number.isFinite(parsed) ? parsed : null;
};

function StoreTraffic({
  visitorData,
  previewChart,
  loading,
  totalViews,
}: {
  visitorData: any[];
  previewChart: ChartPoint[] | null;
  loading: boolean;
  totalViews: number | null;
}) {
  const chartData = useMemo(() => {
    if (previewChart) return previewChart;
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - index));
      const views = visitorData.filter((visit: any) => {
        const timestamp = visit?.timestamp?.toDate?.() || visit?.timestamp;
        if (!timestamp) return false;
        const visitDate = new Date(timestamp);
        return !Number.isNaN(visitDate.getTime()) && visitDate.toDateString() === day.toDateString();
      }).length;
      return {
        name: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        views,
      };
    });
  }, [previewChart, visitorData]);

  const hasChartData = chartData.some((point) => point.views > 0);

  return (
    <section className="ds-weekly-panel">
      <div className="ds-weekly-chart-column">
        <div className="ds-section-heading">
          <div>
            <span className="ds-eyebrow">This week</span>
            {loading ? (
              <Pulse className="mt-2 h-7 w-64" />
            ) : (
              <h2>Your store has reached <strong>{(totalViews || 0).toLocaleString("en-IN")}</strong> people.</h2>
            )}
          </div>
          <span className="ds-period-pill">Last 7 days</span>
        </div>

        {loading ? (
          <Pulse className="h-[226px] w-full" />
        ) : hasChartData ? (
          <div className="ds-traffic-chart" aria-label="Store views for the last seven days">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="#e8ebf2" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#748096", fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: "#98a1b2", fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: "rgba(102, 87, 232, 0.05)" }}
                  contentStyle={{ border: "1px solid #e2e5ed", borderRadius: 12, boxShadow: "0 10px 28px rgba(33, 39, 55, .1)", fontSize: 12 }}
                />
                <Bar dataKey="views" fill="#6657e8" radius={[7, 7, 2, 2]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="ds-traffic-empty">
            <span><FiTrendingUp /></span>
            <div><strong>Your traffic chart is ready</strong><p>Share your storefront to start seeing daily visits here.</p></div>
          </div>
        )}
      </div>
    </section>
  );
}

function Readiness({
  score,
  lowStock,
  loading,
}: {
  score: number;
  lowStock: number | null;
  loading: boolean;
}) {
  const chartData = [{ name: "readiness", value: score, fill: "#159a8a" }];
  return (
    <aside className="ds-readiness-panel">
      <div className="ds-readiness-summary">
        {loading ? (
          <Pulse className="h-[104px] w-[104px] rounded-full" />
        ) : (
          <div className="ds-readiness-chart">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="80%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: "#edf0f4" }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <strong>{score}%</strong>
          </div>
        )}
        <div>
          <h3>Store readiness</h3>
          <p>{score >= 75 ? "Great progress. Keep going." : "A few quick steps will help your store stand out."}</p>
        </div>
      </div>
      <div className="ds-next-steps">
        <span className="ds-eyebrow">Next steps</span>
        <Link href="/store/settings" className="ds-next-step">
          <span className="teal"><FiMessageCircle /></span>
          <div><strong>Add WhatsApp contact</strong><p>Let customers reach you easily</p></div>
          <FiArrowRight />
        </Link>
        <Link href="/store/add-product" className="ds-next-step">
          <span className="amber"><FiPackage /></span>
          <div><strong>{lowStock ? `Review ${lowStock} low-stock item${lowStock === 1 ? "" : "s"}` : "Add your next product"}</strong><p>{lowStock ? "Keep your catalog ready to sell" : "Keep your storefront growing"}</p></div>
          <FiArrowRight />
        </Link>
      </div>
    </aside>
  );
}

export default function StoreDashboard() {
  const [stats, setStats] = useState({
    products: null as number | null,
    visitors: null as number | null,
    lowStockItems: null as number | null,
    visitorData: [] as any[],
  });
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [readiness, setReadiness] = useState(50);
  const [previewChart, setPreviewChart] = useState<ChartPoint[] | null>(null);
  const router = useRouter();

  const storeUrl = username
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/store/${username}`
    : "";

  const loadPreview = () => {
    setUsername("nira-home");
    setStats({ products: 48, visitors: 1284, lowStockItems: 3, visitorData: [] });
    setProducts(demoProducts);
    setReadiness(75);
    setPreviewChart(demoChart);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const localPreview =
      window.location.hostname === "localhost" &&
      new URLSearchParams(window.location.search).get("preview") === "dashboard";
    if (localPreview) {
      loadPreview();
      return;
    }

    const unsubscribe = onAuthChange((user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.uid);
      void fetchData(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async (uid: string) => {
    try {
      setLoading(true);
      const [uname, fetchedProducts, store] = await Promise.all([
        getUsername(uid),
        listProductsByStore(uid),
        getStoreById(uid),
      ]);
      const userData = store;
      const sortedProducts = [...fetchedProducts].sort((a, b) => Number(b.views || 0) - Number(a.views || 0));
      const derivedLowStock = fetchedProducts.filter((product) => {
        const count = stockCount(product);
        return product.isInStock === false || (count !== null && count <= 3);
      }).length;
      const readinessFields = [uname, userData?.name, userData?.whatsappNumber, userData?.logoImage];
      const readinessScore = 40 + readinessFields.filter(Boolean).length * 15;

      setUsername(uname);
      setProducts(sortedProducts);
      setReadiness(Math.min(100, readinessScore));
      setPreviewChart(null);
      setStats({
        products: fetchedProducts.length,
        visitors: Number(userData?.visitCount || 0),
        lowStockItems: Number(userData?.lowStockItems ?? derivedLowStock),
        visitorData: Array.isArray(userData?.visitorData) ? userData.visitorData : [],
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("We could not refresh your dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const copyStoreLink = async () => {
    if (!storeUrl) return;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast.success("Store link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const topProduct = products[0];
  const lowStockProduct = products.find((product) => {
    const count = stockCount(product);
    return product.isInStock === false || (count !== null && count <= 3);
  });
  const visibleProducts = products.slice(0, 3);

  return (
    <div className="ds-page ds-dashboard-page">
      <div className="ds-overview-grid">
        <StoreTraffic
          visitorData={stats.visitorData}
          previewChart={previewChart}
          loading={loading}
          totalViews={stats.visitors}
        />
        <Readiness score={readiness} lowStock={stats.lowStockItems} loading={loading} />
      </div>

      <section className="ds-metrics-band" aria-label="Store metrics">
        {[
          { label: "Products", value: stats.products, icon: FiPackage, tone: "violet" },
          { label: "Store views", value: stats.visitors, icon: FiEye, tone: "teal" },
          { label: "Low stock", value: stats.lowStockItems, icon: FiAlertTriangle, tone: "amber" },
        ].map((metric) => (
          <div className="ds-metric" key={metric.label}>
            <span className={`ds-metric-icon ${metric.tone}`}><metric.icon /></span>
            {loading ? <Pulse className="h-8 w-20" /> : <strong>{(metric.value || 0).toLocaleString("en-IN")}</strong>}
            <span>{metric.label}</span>
          </div>
        ))}
        <button
          type="button"
          className="ds-refresh"
          disabled={refreshing || !userId}
          onClick={() => {
            if (!userId) return;
            setRefreshing(true);
            void fetchData(userId);
          }}
          aria-label="Refresh dashboard"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
        </button>
      </section>

      <div className="ds-dashboard-lower-grid">
        <section className="ds-products-panel">
          <div className="ds-panel-header">
            <div><h2>Your products</h2><p>Performance and stock at a glance</p></div>
            {username ? (
              <Link href="/store/products">View all <FiArrowRight /></Link>
            ) : (
              <Link href="/store/add-product">Add product <FiArrowRight /></Link>
            )}
          </div>

          {loading ? (
            <div className="ds-product-skeletons">
              {[0, 1, 2].map((item) => <Pulse key={item} className="h-[72px] w-full" />)}
            </div>
          ) : visibleProducts.length ? (
            <div className="ds-product-table">
              <div className="ds-product-table-head"><span>Product</span><span>Price</span><span>Views</span><span>Stock</span></div>
              {visibleProducts.map((product, index) => {
                const count = stockCount(product);
                const low = product.isInStock === false || (count !== null && count <= 3);
                const image = product.images?.[0] || fallbackImages[index % fallbackImages.length];
                const content = (
                  <>
                    <span className="ds-product-cell">
                      <Image src={image} alt="" width={56} height={56} sizes="56px" unoptimized={image.startsWith("http")} />
                      <span><strong>{product.name || "Untitled product"}</strong><small>{product.category || "Product"}</small></span>
                    </span>
                    <span className="ds-product-price">{priceLabel(product)}</span>
                    <span>{Number(product.views || 0).toLocaleString("en-IN")}</span>
                    <span><i className={`ds-stock-chip ${low ? "low" : "in-stock"}`}>{low ? "Low stock" : "In stock"}</i></span>
                  </>
                );
                return username ? (
                  <Link key={product.id} href={`/store/${username}/${product.id}`} className="ds-product-row">{content}</Link>
                ) : (
                  <div key={product.id} className="ds-product-row">{content}</div>
                );
              })}
            </div>
          ) : (
            <div className="ds-products-empty">
              <span><FiPackage /></span>
              <div><strong>Your catalog is ready for its first product</strong><p>Add photos, pricing, and details in a few minutes.</p></div>
              <Link href="/store/add-product">Add product <FiArrowRight /></Link>
            </div>
          )}
        </section>

        <aside className="ds-activity-panel">
          <div className="ds-panel-header"><div><h2>Recent activity</h2><p>What needs your attention</p></div></div>
          <div className="ds-activity-list">
            <div className="ds-activity-item">
              <span className="violet"><FiStar /></span>
              <div><strong>{topProduct ? `${topProduct.name} is leading` : "Your product insights will appear here"}</strong><p>{topProduct ? `${Number(topProduct.views || 0).toLocaleString("en-IN")} total views` : "Add products to start tracking performance."}</p></div>
            </div>
            <div className="ds-activity-item">
              <span className="teal"><FiTrendingUp /></span>
              <div><strong>Store views milestone</strong><p>{stats.visitors ? `Your storefront has reached ${stats.visitors.toLocaleString("en-IN")} views.` : "Share your link to grow store traffic."}</p></div>
            </div>
            <div className="ds-activity-item">
              <span className={lowStockProduct ? "amber" : "teal"}>{lowStockProduct ? <FiAlertTriangle /> : <FiCheckCircle />}</span>
              <div><strong>{lowStockProduct ? "Low stock alert" : "Inventory looks healthy"}</strong><p>{lowStockProduct ? `${lowStockProduct.name} needs a stock check.` : "No low-stock products need attention."}</p></div>
            </div>
          </div>
          <Link href="/store/reviews" className="ds-activity-link"><FiMessageCircle /> Open customer reviews <FiArrowRight /></Link>
        </aside>
      </div>

      <section className="ds-share-panel">
        <span className="ds-share-icon"><FiShare2 /></span>
        <div className="ds-share-copy">
          <strong>Share your store</strong>
          <code>{username ? `productshare.in/store/${username}` : "Your store link will appear here"}</code>
        </div>
        <div className="ds-share-actions">
          <button type="button" onClick={copyStoreLink} disabled={!username}>
            {copied ? <FiCheck /> : <FiCopy />} {copied ? "Copied" : "Copy link"}
          </button>
          {username && <Link href={`/store/${username}`} target="_blank"><FiExternalLink /> Open store</Link>}
        </div>
      </section>
    </div>
  );
}
