"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiPackage, FiEye, FiAlertTriangle, FiRefreshCw, FiExternalLink, FiArrowUpRight,
  FiBarChart2, FiShoppingBag, FiSettings, FiCopy, FiCheck, FiPlus,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { getUsername } from "@/helpers/getUsername";
import PaymentButton from "@/components/PaymentButton";
import Image from "next/image";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

const Pulse = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/60 ${className ?? ""}`} />
);

const StatCard = ({ title, value, icon: Icon, color, loading }: {
  title: string;
  value: number | null;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}) => (
  <div className="ds-stat-card">
    <div className="ds-stat-top">
      <div className={`ds-stat-icon-wrap ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    {loading ? <Pulse className="h-8 w-20 mt-4" /> : (
      <p className="ds-stat-value">{value?.toLocaleString() ?? "0"}</p>
    )}
    <p className="ds-stat-label">{title}</p>
  </div>
);

const SessionChart = ({ visitorData, loading, username }: { visitorData: any[]; loading: boolean; username: string | null }) => {
  const [tf, setTf] = useState("week");
  const days = tf === "week" ? 7 : 30;

  const chartData = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const count = visitorData?.filter((v: any) => {
      const vd = new Date(v.timestamp?.toDate?.() || v.timestamp);
      return vd.toDateString() === d.toDateString();
    }).length ?? 0;
    return { name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), views: count };
  });

  const total = chartData.reduce((s, d) => s + d.views, 0);

  return (
    <div className="ds-chart-card">
      <div className="ds-chart-header">
        <div>
          <h3 className="ds-card-title">Store Sessions</h3>
          {!loading && <p className="ds-chart-total">{total} <span>visits in period</span></p>}
        </div>
        <div className="ds-toggle-group">
          {["week", "month"].map((p) => (
            <button key={p} className={`ds-toggle ${tf === p ? "active" : ""}`} onClick={() => setTf(p)}>
              {p === "week" ? "7 days" : "30 days"}
            </button>
          ))}
        </div>
      </div>
      {loading ? <Pulse className="h-[260px] w-full mt-4" /> : visitorData?.length > 0 ? (
        <div className="ds-chart-area">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dy={8} minTickGap={20} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontSize: 13 }} cursor={{ stroke: "#c7d2fe", strokeDasharray: "4 4" }} />
              <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2.5} fill="url(#viewsGrad)" dot={false} activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="ds-chart-empty">
          <FiBarChart2 className="w-10 h-10 text-slate-300" />
          <p>No session data yet</p>
          <span>Share your store link to start tracking visits</span>
          {username && (
            <Link href={`/store/${username}`} target="_blank" className="ds-empty-cta">
              <FiExternalLink className="w-4 h-4" /> Open your store
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

const InsightRow = ({ label, labelColor, product, loading }: {
  label: string;
  labelColor: string;
  product: any;
  loading: boolean;
}) => (
  <div className="ds-insight-row">
    <span className={`ds-insight-badge ${labelColor}`}>{label}</span>
    <div className="ds-insight-product">
      {loading ? <Pulse className="w-12 h-12 rounded-xl" /> : product?.images?.[0] ? (
        <Image alt="" src={product.images[0]} width={48} height={48} quality={50} loading="lazy" className="ds-insight-img" />
      ) : (
        <div className="ds-insight-img-placeholder"><FiPackage className="w-4 h-4 text-slate-400" /></div>
      )}
      <div className="ds-insight-info">
        {loading ? <><Pulse className="h-3.5 w-24" /><Pulse className="h-3 w-14 mt-1.5" /></> : product ? (
          <><p className="ds-insight-name">{product.name}</p><p className="ds-insight-views">{product.views || 0} views</p></>
        ) : <p className="ds-insight-views">No products yet</p>}
      </div>
    </div>
  </div>
);

const StoreDashboard = () => {
  const [stats, setStats] = useState({ products: null as number | null, visitors: null as number | null, lowStockItems: null as number | null, visitorData: [] as any[] });
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [leastViewed, setLeastViewed] = useState<any>(null);
  const [mostViewed, setMostViewed] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const storeUrl = username ? `${typeof window !== "undefined" ? window.location.origin : ""}/store/${username}` : "";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { if (!u) { router.push("/login"); return; } fetchData(u.uid); });
    return () => unsub();
  }, []);

  const fetchData = async (uid: string) => {
    try {
      setLoading(true);
      const uname = await getUsername(uid);
      setUsername(uname);
      setUserId(uid);
      const [prodSnap, userDoc] = await Promise.all([getDocs(collection(db, "users", uid, "products")), getDoc(doc(db, "users", uid))]);
      const ud = userDoc.exists() ? userDoc.data() : { visitCount: 0 };
      setStats({ products: prodSnap.size, visitors: ud.visitCount ?? 0, lowStockItems: ud.lowStockItems ?? 0, visitorData: ud.visitorData || [] });
      const [lSnap, mSnap] = await Promise.all([
        getDocs(query(collection(db, "users", uid, "products"), orderBy("views"), limit(1))),
        getDocs(query(collection(db, "users", uid, "products"), orderBy("views", "desc"), limit(1))),
      ]);
      setLeastViewed(lSnap.docs[0] ? { id: lSnap.docs[0].id, ...lSnap.docs[0].data() } : null);
      setMostViewed(mSnap.docs[0] ? { id: mSnap.docs[0].id, ...mSnap.docs[0].data() } : null);
    } catch (e) { console.log("Dashboard error:", e); } finally { setLoading(false); setRefreshing(false); }
  };

  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };

  const copyStoreLink = async () => {
    if (!storeUrl) return;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast.success("Store link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="ds-page">
      <div className="ds-welcome">
        <div className="ds-welcome-content">
          <div>
            <h2 className="ds-welcome-title">{greeting()}</h2>
            <p className="ds-welcome-sub">
              {stats.products === 0 && !loading
                ? "Get started by adding your first product to your catalog."
                : "Here's a snapshot of how your store is doing."}
            </p>
            {username && (
              <div className="ds-store-link">
                <code>productshare.in/store/{username}</code>
                <button type="button" onClick={copyStoreLink} className="ds-btn-outline" aria-label="Copy store link">
                  {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
          <div className="ds-welcome-actions">
            {username && (
              <Link href={`/store/${username}`} target="_blank" className="ds-btn ds-btn-light">
                <FiExternalLink className="w-4 h-4" /> View Store
              </Link>
            )}
            <Link href="/store/add-product" className="ds-btn ds-btn-light">
              <FiPlus className="w-4 h-4" /> Add Product
            </Link>
            <button
              onClick={() => { if (userId) { setRefreshing(true); fetchData(userId); } }}
              disabled={refreshing}
              className="ds-btn ds-btn-ghost"
              aria-label="Refresh data"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
        <div className="ds-welcome-decor" />
        <div className="ds-welcome-decor-2" />
      </div>

      <div className="ds-stats-grid">
        <StatCard title="Total Products" value={stats.products} icon={FiPackage} color="indigo" loading={loading} />
        <StatCard title="Store Views" value={stats.visitors} icon={FiEye} color="emerald" loading={loading} />
        <StatCard title="Low Stock Items" value={stats.lowStockItems} icon={FiAlertTriangle} color="amber" loading={loading} />
      </div>

      {!loading && stats.products === 0 && (
        <div className="ds-card" style={{ textAlign: "center", padding: "32px 24px" }}>
          <FiShoppingBag className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
          <h3 className="ds-card-title">Your catalog is empty</h3>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 8, lineHeight: 1.5 }}>
            Add your first product to start selling through your digital storefront.
          </p>
          <Link href="/store/add-product" className="ds-empty-cta" style={{ margin: "16px auto 0" }}>
            <FiPlus className="w-4 h-4" /> Add your first product
          </Link>
        </div>
      )}

      <div className="ds-analytics-row">
        <div className="ds-analytics-chart">
          <SessionChart visitorData={stats.visitorData} loading={loading} username={username} />
        </div>
        <div className="ds-analytics-insights">
          <div className="ds-card">
            <div className="ds-insights-header">
              <h3 className="ds-card-title">Product Insights</h3>
              <HiSparkles className="w-4 h-4 text-amber-400" />
            </div>
            <InsightRow label="Top Performer" labelColor="green" product={mostViewed} loading={loading} />
            <InsightRow label="Needs Attention" labelColor="amber" product={leastViewed} loading={loading} />
            {username && (
              <Link href={`/store/${username}`} target="_blank" className="ds-insights-link">
                View all products <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="ds-card">
            <h3 className="ds-card-title">Quick Actions</h3>
            <div className="ds-quick-grid">
              <Link href="/store/add-product" className="ds-quick-action">
                <FiShoppingBag className="w-5 h-5 text-indigo-500" />
                <span>Add Product</span>
              </Link>
              <Link href="/store/reviews" className="ds-quick-action">
                <FiBarChart2 className="w-5 h-5 text-emerald-500" />
                <span>Reviews</span>
              </Link>
              <Link href="/store/settings" className="ds-quick-action">
                <FiSettings className="w-5 h-5 text-violet-500" />
                <span>Settings</span>
              </Link>
              {username && (
                <Link href={`/store/${username}`} target="_blank" className="ds-quick-action">
                  <FiExternalLink className="w-5 h-5 text-sky-500" />
                  <span>View Store</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ds-payment-row">
        <PaymentButton userId={userId} />
      </div>
    </div>
  );
};

export default StoreDashboard;
