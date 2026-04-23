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
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { getUsername } from "@/helpers/getUsername";
import PaymentButton from "@/components/PaymentButton";
import Image from "next/image";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ title, value, trend, icon: Icon, loading }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className="text-gray-500 font-medium text-sm">{title}</div>
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
    </div>
    <div className="space-y-2">
      {loading ? (
        <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">
          {value?.toLocaleString() ?? "0"}
        </p>
      )}
      {trend !== undefined && !loading && (
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
          <span className="text-xs text-gray-400">from last month</span>
        </div>
      )}
    </div>
  </div>
);

// ─── Visitor Analytics with Recharts ───────────────────────────────────────
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

  // Build chart data
  const chartData = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const count = visitorData?.filter((v: any) => {
      const visitDate = new Date(v.timestamp?.toDate?.() || v.timestamp);
      return visitDate.toDateString() === d.toDateString();
    }).length ?? 0;
    
    return {
      name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: count,
    };
  });

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Store Sessions</h3>
          <p className="text-sm text-gray-500 mt-0.5">Your visitor traffic over time</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {["week", "month"].map((p) => (
            <button
              key={p}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeframe === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setTimeframe(p)}
            >
              {p === "week" ? "Last 7 days" : "Last 30 days"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 min-h-[250px] bg-gray-50 rounded-lg animate-pulse" />
      ) : visitorData?.length > 0 ? (
        <>
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            <span className={`ml-2 text-sm font-medium ${stats.change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.change >= 0 ? "↑" : "↓"} {Math.abs(stats.change)}%
            </span>
          </div>

          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  dy={10}
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "#9ca3af" }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  cursor={{ stroke: "#e5e7eb", strokeWidth: 1, strokeDasharray: "3 3" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No session data yet</p>
          <p className="text-sm text-gray-500 mt-1 max-w-[200px]">Share your store link to start tracking visitor sessions.</p>
        </div>
      )}
    </div>
  );
};

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
  const [leastViewedProduct, setLeastViewedProduct] = useState<any>(null);
  const [mostViewedProduct, setMostViewedProduct] = useState<any>(null);
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
      setLeastViewedProduct(
        leastSnap.docs[0]
          ? { id: leastSnap.docs[0].id, ...leastSnap.docs[0].data() }
          : null
      );
      setMostViewedProduct(
        mostSnap.docs[0]
          ? { id: mostSnap.docs[0].id, ...mostSnap.docs[0].data() }
          : null
      );
    } catch (error) {
      console.log("Error fetching product views:", error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Overview
            <button
              onClick={() => {
                if(userId) {
                  setRefreshing(true);
                  fetchDashboardData(userId);
                }
              }}
              disabled={refreshing}
              className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {username && (
            <Link
              href={`/store/${username}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              View Store
            </Link>
          )}
          <PaymentButton userId={userId} />
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Products"
          value={stats.products}
          trend={12}
          icon={Package}
          loading={loading}
        />
        <StatCard
          title="Total Store Views"
          value={stats.visitors}
          trend={8}
          icon={Eye}
          loading={loading}
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockItems}
          trend={-4}
          icon={AlertTriangle}
          loading={loading}
        />
      </div>

      {/* ── Analytics & Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VisitorStats visitorData={stats.visitorData} loading={loading} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Product Insights</h3>
            </div>
            
            <div className="p-0">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-md">Top Performer</span>
                </div>
                <div className="flex items-center gap-3">
                  {loading ? (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ) : mostViewedProduct?.images?.[0] ? (
                    <Image
                      alt="Product"
                      src={mostViewedProduct.images[0]}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                        <div className="h-3 w-16 bg-gray-100 rounded" />
                      </div>
                    ) : mostViewedProduct ? (
                      <>
                        <p className="font-medium text-sm text-gray-900 truncate">{mostViewedProduct.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{mostViewedProduct.views || 0} views</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No products</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-md">Needs Attention</span>
                </div>
                <div className="flex items-center gap-3">
                  {loading ? (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ) : leastViewedProduct?.images?.[0] ? (
                    <Image
                      alt="Product"
                      src={leastViewedProduct.images[0]}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                        <div className="h-3 w-16 bg-gray-100 rounded" />
                      </div>
                    ) : leastViewedProduct ? (
                      <>
                        <p className="font-medium text-sm text-gray-900 truncate">{leastViewedProduct.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{leastViewedProduct.views || 0} views</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No products</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {username && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <Link href={`/store/${username}`} target="_blank" className="text-sm font-medium text-gray-900 hover:text-black flex items-center justify-center gap-1 w-full">
                  View all products <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StoreDashboard;
