"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package, Eye, TrendingUp, TrendingDown, RefreshCw, AlertTriangle,
  ChevronRight, ExternalLink, ArrowUpRight, Sparkles, BarChart3, ShoppingBag,
} from "lucide-react";
import { getUsername } from "@/helpers/getUsername";
import PaymentButton from "@/components/PaymentButton";
import Image from "next/image";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ─── Skeleton Pulse ─── */
const Pulse = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/60 ${className ?? ""}`} />
);

/* ─── Stat Card ─── */
const StatCard = ({ title, value, trend, icon: Icon, color, loading }: any) => (
  <div className="ds-stat-card">
    <div className="ds-stat-top">
      <div className={`ds-stat-icon-wrap ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      {trend !== undefined && !loading && (
        <span className={`ds-stat-trend ${trend >= 0 ? "up" : "down"}`}>
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    {loading ? <Pulse className="h-8 w-20 mt-3" /> : (
      <p className="ds-stat-value">{value?.toLocaleString() ?? "0"}</p>
    )}
    <p className="ds-stat-label">{title}</p>
  </div>
);

/* ─── Chart ─── */
const SessionChart = ({ visitorData, loading }: any) => {
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
          {!loading && <p className="ds-chart-total">{total} <span>total visits</span></p>}
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
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontSize: 13 }} cursor={{ stroke: "#c7d2fe", strokeDasharray: "4 4" }} />
              <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2.5} fill="url(#viewsGrad)" dot={false} activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="ds-chart-empty">
          <BarChart3 className="w-8 h-8 text-slate-300" />
          <p>No session data yet</p>
          <span>Share your store link to start tracking</span>
        </div>
      )}
    </div>
  );
};

/* ─── Product Insight Row ─── */
const InsightRow = ({ label, labelColor, product, loading }: any) => (
  <div className="ds-insight-row">
    <span className={`ds-insight-badge ${labelColor}`}>{label}</span>
    <div className="ds-insight-product">
      {loading ? <Pulse className="w-11 h-11 rounded-xl" /> : product?.images?.[0] ? (
        <Image alt="" src={product.images[0]} width={44} height={44} quality={50} loading="lazy" className="ds-insight-img" />
      ) : (
        <div className="ds-insight-img-placeholder"><Package className="w-4 h-4 text-slate-400" /></div>
      )}
      <div className="ds-insight-info">
        {loading ? <><Pulse className="h-3.5 w-24" /><Pulse className="h-3 w-14 mt-1.5" /></> : product ? (
          <><p className="ds-insight-name">{product.name}</p><p className="ds-insight-views">{product.views || 0} views</p></>
        ) : <p className="ds-insight-views">No products</p>}
      </div>
    </div>
  </div>
);

/* ═══ MAIN DASHBOARD ═══ */
const StoreDashboard = () => {
  const [stats, setStats] = useState({ products: null as any, visitors: null as any, lowStockItems: null as any, visitorData: [] as any[] });
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [leastViewed, setLeastViewed] = useState<any>(null);
  const [mostViewed, setMostViewed] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

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

  return (
    <>
      <div className="ds-page">
        {/* ── Welcome Banner ── */}
        <div className="ds-welcome">
          <div className="ds-welcome-content">
            <div>
              <h1 className="ds-welcome-title">{greeting()} 👋</h1>
              <p className="ds-welcome-sub">Here&apos;s how your store is performing today</p>
            </div>
            <div className="ds-welcome-actions">
              {username && (
                <Link href={`/store/${username}`} target="_blank" className="ds-btn ds-btn-light">
                  <ExternalLink className="w-4 h-4" /> View Store
                </Link>
              )}
              <button onClick={() => { if (userId) { setRefreshing(true); fetchData(userId); } }} disabled={refreshing} className="ds-btn ds-btn-ghost">
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
          <div className="ds-welcome-decor" />
        </div>

        {/* ── Stat Cards ── */}
        <div className="ds-stats-grid">
          <StatCard title="Total Products" value={stats.products} trend={12} icon={Package} color="indigo" loading={loading} />
          <StatCard title="Store Views" value={stats.visitors} trend={8} icon={Eye} color="emerald" loading={loading} />
          <StatCard title="Low Stock" value={stats.lowStockItems} trend={-4} icon={AlertTriangle} color="amber" loading={loading} />
        </div>

        {/* ── Analytics Row ── */}
        <div className="ds-analytics-row">
          <div className="ds-analytics-chart">
            <SessionChart visitorData={stats.visitorData} loading={loading} />
          </div>
          <div className="ds-analytics-insights">
            <div className="ds-insights-card">
              <div className="ds-insights-header">
                <h3 className="ds-card-title">Product Insights</h3>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <InsightRow label="Top Performer" labelColor="green" product={mostViewed} loading={loading} />
              <InsightRow label="Needs Attention" labelColor="amber" product={leastViewed} loading={loading} />
              {username && (
                <Link href={`/store/${username}`} target="_blank" className="ds-insights-link">
                  View all products <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Quick Actions */}
            <div className="ds-quick-card">
              <h3 className="ds-card-title">Quick Actions</h3>
              <div className="ds-quick-grid">
                <Link href="/store/add-product" className="ds-quick-action">
                  <ShoppingBag className="w-5 h-5 text-indigo-500" />
                  <span>Add Product</span>
                </Link>
                <Link href="/store/reviews" className="ds-quick-action">
                  <BarChart3 className="w-5 h-5 text-emerald-500" />
                  <span>Reviews</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="ds-payment-row">
          <PaymentButton userId={userId} />
        </div>
      </div>

      {/* ═══ PAGE STYLES ═══ */}
      <style jsx>{`
        .ds-page { display: flex; flex-direction: column; gap: 20px; }
        @media (min-width: 768px) { .ds-page { gap: 24px; } }

        /* Welcome */
        .ds-welcome {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          padding: 28px 24px;
          overflow: hidden;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        @media (min-width: 768px) { .ds-welcome { padding: 36px 32px; border-radius: 24px; } }
        .ds-welcome-content { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 640px) { .ds-welcome-content { flex-direction: row; align-items: center; justify-content: space-between; } }
        .ds-welcome-title { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
        @media (min-width: 768px) { .ds-welcome-title { font-size: 26px; } }
        .ds-welcome-sub { font-size: 14px; color: #475569; margin-top: 4px; }
        .ds-welcome-actions { display: flex; align-items: center; gap: 8px; }
        .ds-welcome-decor {
          position: absolute; top: -40px; right: -40px; width: 200px; height: 200px;
          border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0) 70%);
        }

        /* Buttons */
        .ds-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 18px; border-radius: 12px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          border: none; text-decoration: none; transition: all 0.2s; white-space: nowrap;
        }
        .ds-btn-light { background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .ds-btn-light:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .ds-btn-ghost { background: #f8fafc; color: #475569; padding: 9px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .ds-btn-ghost:hover { background: #f1f5f9; color: #0f172a; }
        .ds-btn-ghost:disabled { opacity: 0.5; }

        /* Stats */
        .ds-stats-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 640px) { .ds-stats-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }

        .ds-stat-card {
          background: #fff; border-radius: 16px; padding: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 14px rgba(0,0,0,0.02);
          transition: all 0.2s;
        }
        .ds-stat-card:hover { box-shadow: 0 12px 24px rgba(0,0,0,0.06); transform: translateY(-3px); border-color: #cbd5e1; }
        .ds-stat-top { display: flex; align-items: center; justify-content: space-between; }
        .ds-stat-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .ds-stat-icon-wrap.indigo { background: #eef2ff; color: #6366f1; }
        .ds-stat-icon-wrap.emerald { background: #ecfdf5; color: #10b981; }
        .ds-stat-icon-wrap.amber { background: #fffbeb; color: #f59e0b; }
        .ds-stat-trend {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 8px;
        }
        .ds-stat-trend.up { background: #ecfdf5; color: #059669; }
        .ds-stat-trend.down { background: #fef2f2; color: #dc2626; }
        .ds-stat-value { font-size: 28px; font-weight: 700; color: #0f172a; margin-top: 12px; letter-spacing: -0.02em; }
        .ds-stat-label { font-size: 13px; color: #64748b; margin-top: 2px; font-weight: 500; }

        /* Analytics Row */
        .ds-analytics-row { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 1024px) { .ds-analytics-row { grid-template-columns: 5fr 3fr; gap: 20px; } }
        .ds-analytics-insights { display: flex; flex-direction: column; gap: 16px; }

        /* Chart */
        .ds-chart-card { background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; height: 100%; display: flex; flex-direction: column; box-shadow: 0 4px 14px rgba(0,0,0,0.02); }
        @media (min-width: 768px) { .ds-chart-card { padding: 24px; } }
        .ds-chart-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .ds-card-title { font-size: 15px; font-weight: 700; color: #0f172a; }
        .ds-chart-total { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 4px; }
        .ds-chart-total span { font-size: 13px; font-weight: 500; color: #94a3b8; }
        .ds-toggle-group { display: flex; background: #f1f5f9; border-radius: 10px; padding: 3px; }
        .ds-toggle {
          padding: 6px 14px; border-radius: 8px; border: none; background: transparent;
          font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s;
        }
        .ds-toggle.active { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .ds-chart-area { flex: 1; min-height: 260px; width: 100%; margin-top: 16px; }
        .ds-chart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 40px 0; }
        .ds-chart-empty p { font-size: 14px; font-weight: 600; color: #475569; }
        .ds-chart-empty span { font-size: 13px; color: #94a3b8; }

        /* Insights */
        .ds-insights-card { background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.02); }
        .ds-insights-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .ds-insight-row { margin-bottom: 14px; }
        .ds-insight-row:last-of-type { margin-bottom: 0; }
        .ds-insight-badge {
          display: inline-block; font-size: 10.5px; font-weight: 700;
          padding: 3px 10px; border-radius: 6px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em;
        }
        .ds-insight-badge.green { background: #ecfdf5; color: #059669; }
        .ds-insight-badge.amber { background: #fffbeb; color: #d97706; }
        .ds-insight-product { display: flex; align-items: center; gap: 10px; }
        .ds-insight-img { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid #f1f5f9; }
        .ds-insight-img-placeholder { width: 44px; height: 44px; border-radius: 10px; background: #f8fafc; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; }
        .ds-insight-info { flex: 1; min-width: 0; }
        .ds-insight-name { font-size: 13.5px; font-weight: 600; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ds-insight-views { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .ds-insights-link {
          display: flex; align-items: center; justify-content: center; gap: 4px;
          margin-top: 16px; padding: 10px; border-radius: 10px; background: #f8fafc;
          font-size: 13px; font-weight: 600; color: #6366f1; text-decoration: none; transition: all 0.2s;
        }
        .ds-insights-link:hover { background: #eef2ff; }

        /* Quick Actions */
        .ds-quick-card { background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.02); }
        .ds-quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
        .ds-quick-action {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 16px 12px; border-radius: 12px; background: #f8fafc;
          border: 1px solid #e2e8f0; text-decoration: none; transition: all 0.2s;
        }
        .ds-quick-action span { font-size: 12px; font-weight: 600; color: #334155; }
        .ds-quick-action:hover { background: #ffffff; border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transform: translateY(-2px); }

        .ds-payment-row { display: flex; justify-content: flex-end; }
      `}</style>
    </>
  );
};

export default StoreDashboard;
