"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Plus,
  Settings,
  Star,
  Users,
  ArrowRight,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { getUsername } from "@/helpers/getUsername";
import PaymentButton from "@/components/PaymentButton";
import Image from "next/image";

const PRIMARY = "#6c64cb";

// ─── Greeting helper ───────────────────────────────────────────────────────
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

// ─── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ title, value, trend, icon: Icon, loading, iconGradient }: any) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 group">
    <div className="flex items-center justify-between mb-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200"
        style={{ background: iconGradient || `linear-gradient(135deg, ${PRIMARY}, #a78bfa)` }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      {trend !== undefined && !loading && (
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            trend >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      {loading ? (
        <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">
          {value?.toLocaleString() ?? "0"}
        </p>
      )}
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  </div>
);

// ─── Action Card ───────────────────────────────────────────────────────────
const ActionCard = ({ title, href = "#", icon: Icon, description, disabled, gradient }: any) => (
  <Link
    href={disabled ? "#" : href}
    className={`group flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-200 ${
      disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
    }`}
    onClick={(e) => { if (disabled || href === "#") e.preventDefault(); }}
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm"
      style={{ background: gradient || `linear-gradient(135deg, ${PRIMARY}, #a78bfa)` }}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
  </Link>
);

// ─── Product View Card ─────────────────────────────────────────────────────
const ProductViewCard = ({ product, type, loading }: any) => {
  const isMost = type === "Most Viewed";
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isMost ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}
        >
          {isMost ? "🔥 Most Viewed" : "📉 Least Viewed"}
        </span>
        <Eye className="w-4 h-4 text-gray-300" />
      </div>
      <div className="flex gap-3 items-center">
        {loading ? (
          <div className="w-14 h-14 bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />
        ) : product?.images?.[0] ? (
          <Image
            alt={product.name || "Product"}
            src={product.images[0]}
            width={56}
            height={56}
            className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-gray-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : product ? (
            <>
              <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                <span className="font-bold text-gray-700">{product.views || 0}</span> views
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">No products yet</p>
          )}
        </div>
        {!loading && product && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
      </div>
    </div>
  );
};

// ─── Visitor Analytics ─────────────────────────────────────────────────────
const VisitorStats = ({ visitorData, loading }: any) => {
  const [timeframe, setTimeframe] = useState("week");

  const getStats = () => {
    if (!visitorData?.length) return { total: 0, change: 0 };
    const now = new Date();
    const compareDate = new Date();
    if (timeframe === "week") compareDate.setDate(now.getDate() - 7);
    else compareDate.setMonth(now.getMonth() - 1);

    const current = visitorData.filter(
      (v: any) => new Date(v.timestamp?.toDate?.() || v.timestamp) >= compareDate
    ).length;

    const prevStart = new Date(compareDate);
    if (timeframe === "week") prevStart.setDate(prevStart.getDate() - 7);
    else prevStart.setMonth(prevStart.getMonth() - 1);

    const prev = visitorData.filter((v: any) => {
      const d = new Date(v.timestamp?.toDate?.() || v.timestamp);
      return d >= prevStart && d < compareDate;
    }).length;

    const change = prev > 0 ? Math.round(((current - prev) / prev) * 100) : current > 0 ? 100 : 0;
    return { total: current, change };
  };

  const stats = getStats();
  const days = timeframe === "week" ? 7 : 30;

  // Build bar data
  const barData = Array.from({ length: Math.min(days, 14) }, (_, i) => {
    const count = visitorData?.filter((v: any) => {
      const visitDate = new Date(v.timestamp?.toDate?.() || v.timestamp);
      const diff = Math.floor((Date.now() - visitDate.getTime()) / 86400000);
      return diff === i;
    }).length ?? 0;
    return count;
  });
  const maxBar = Math.max(...barData, 1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">Visitor Analytics</h3>
          <p className="text-xs text-gray-500 mt-0.5">Store page views over time</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1">
          {["week", "month"].map((p) => (
            <button
              key={p}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeframe === p ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setTimeframe(p)}
            >
              {p === "week" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />
      ) : visitorData?.length > 0 ? (
        <>
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
            <div className={`flex items-center gap-1 text-sm font-semibold ${stats.change >= 0 ? "text-green-600" : "text-red-500"}`}>
              {stats.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.change)}%
            </div>
            <span className="text-xs text-gray-400">vs prev period</span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-1.5 h-20">
            {barData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${Math.max(4, (val / maxBar) * 100)}%`,
                    background: val > 0
                      ? `linear-gradient(to top, ${PRIMARY}, #a78bfa)`
                      : "#f3f4f6",
                  }}
                />
                {barData.length <= 8 && (
                  <span className="text-[9px] text-gray-400">
                    {i === 0 ? "T" : `${i}d`}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "linear-gradient(135deg, #f3f0ff, #e8e4ff)" }}
          >
            <BarChart3 className="w-6 h-6" style={{ color: PRIMARY }} />
          </div>
          <p className="text-sm font-medium text-gray-700">No visitor data yet</p>
          <p className="text-xs text-gray-400 mt-1">Share your store link to get started</p>
        </div>
      )}
    </div>
  );
};

// ─── Action Cards config ────────────────────────────────────────────────────
const actionCards = [
  {
    title: "Add New Product",
    href: "/store/add-product",
    icon: Plus,
    description: "List a new product in your showcase",
    gradient: `linear-gradient(135deg, ${PRIMARY}, #a78bfa)`,
  },
  {
    title: "View Catalog",
    href: `/store/username`,
    icon: Package,
    description: "Browse and manage your product listings",
    gradient: "linear-gradient(135deg, #059669, #34d399)",
  },
  {
    title: "Store Settings",
    href: "/store/settings",
    icon: Settings,
    description: "Adjust your store preferences and settings",
    gradient: "linear-gradient(135deg, #d97706, #fbbf24)",
  },
  {
    title: "Customer Reviews",
    href: "/store/reviews",
    icon: Star,
    description: "View and manage customer feedback",
    gradient: "linear-gradient(135deg, #dc2626, #f87171)",
  },
];

// ─── Main Dashboard ─────────────────────────────────────────────────────────
const StoreDashboard = () => {
  const [stats, setStats] = useState({
    products: null,
    visitors: null,
    lowStockItems: null,
    visitorData: [] as any[],
  });
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [leastViewedProduct, setLeastViewedProduct] = useState(null);
  const [mostViewedProduct, setMostViewedProduct] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) { router.push("/login"); return; }
      fetchDashboardData(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (uid: string) => {
    try {
      setLoading(true);
      const fetchedUsername = await getUsername(uid);
      setUsername(fetchedUsername);
      setUserId(uid);

      const productsSnapshot = await getDocs(collection(db, "users", uid, "products"));
      const userDoc = await getDoc(doc(db, "users", uid));
      const userData = userDoc.exists() ? userDoc.data() : { visitCount: 0 };

      setStats({
        products: productsSnapshot.size,
        visitors: userData.visitCount ?? 0,
        lowStockItems: userData.lowStockItems ?? 0,
        visitorData: userData.visitorData || [],
      });

      await fetchProductViews(uid);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProductViews = async (uid: string) => {
    try {
      const [leastSnap, mostSnap] = await Promise.all([
        getDocs(query(collection(db, "users", uid, "products"), orderBy("views"), limit(1))),
        getDocs(query(collection(db, "users", uid, "products"), orderBy("views", "desc"), limit(1))),
      ]);
      setLeastViewedProduct(leastSnap.docs[0]?.data() ?? null);
      setMostViewedProduct(mostSnap.docs[0]?.data() ?? null);
    } catch (error) {
      console.log("Error fetching product views:", error);
    }
  };

  const handleRefresh = () => {
    if (!userId) return;
    setRefreshing(true);
    fetchDashboardData(userId);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, #a78bfa)` }}
            >
              {username ? username[0].toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{getGreeting()}</p>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                {loading ? (
                  <div className="h-7 w-36 bg-gray-200 rounded-lg animate-pulse" />
                ) : (
                  <>{username || "Store Owner"}</>
                )}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-gray-400 hover:text-primary transition-colors disabled:opacity-40 ml-1"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/store/${username}`}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-primary/30 hover:text-primary transition-all"
            >
              <Eye className="w-4 h-4" />
              View Store
            </Link>
            <PaymentButton userId={userId} />
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Products"
            value={stats.products}
            trend={12}
            icon={Package}
            loading={loading}
            iconGradient={`linear-gradient(135deg, ${PRIMARY}, #a78bfa)`}
          />
          <StatCard
            title="Store Visitors"
            value={stats.visitors}
            trend={8}
            icon={Users}
            loading={loading}
            iconGradient="linear-gradient(135deg, #059669, #34d399)"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            trend={-4}
            icon={AlertTriangle}
            loading={loading}
            iconGradient="linear-gradient(135deg, #d97706, #fbbf24)"
          />
        </div>

        {/* ── Analytics + Product Performance ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <VisitorStats visitorData={stats.visitorData} loading={loading} />
          </div>
          <div className="space-y-4">
            <ProductViewCard product={mostViewedProduct} type="Most Viewed" loading={loading} />
            <ProductViewCard product={leastViewedProduct} type="Least Viewed" loading={loading} />
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {actionCards.map((card, index) => (
              <ActionCard
                key={index}
                title={card.title}
                href={card.href === "/store/username" ? `/store/${username}` : card.href}
                icon={card.icon}
                description={card.description}
                gradient={card.gradient}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StoreDashboard;
