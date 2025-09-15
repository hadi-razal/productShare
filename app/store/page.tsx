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
  where,
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
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  BarChart3,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  UserCheck,
  Percent,
  Tag,
  RotateCcw,
  Box,
  ChevronRight,
} from "lucide-react";
import { getUsername } from "@/helpers/getUsername";
import PaymentButton from "@/components/PaymentButton";
import Image from "next/image";

// Stat Card Component
const StatCard = ({ title, value, trend, icon: Icon, loading, currency }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-lg ${loading ? 'bg-gray-200 animate-pulse' : 'bg-purple-100'}`}>
        <Icon className="w-5 h-5 text-blue-700" />
      </div>
      {trend !== undefined && !loading && (
        <div
          className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {trend >= 0 ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <h3 className="mt-4 text-2xl font-bold text-gray-800">
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      ) : currency ? (
        `$${value?.toLocaleString() || 0}`
      ) : (
        value?.toLocaleString() ?? "0"
      )}
    </h3>
    <p className="mt-1 text-sm text-gray-500 font-medium">{title}</p>
  </div>
);

// Enhanced Action Card Component with hover effects
const ActionCard = ({ title, href = "#", icon: Icon, description, disabled }: any) => (
  <Link
    href={disabled ? "#" : href}
    className={`block rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5 ${
      disabled ? "opacity-60 cursor-not-allowed" : ""
    }`}
    onClick={(e) => {
      if (disabled || href === "#") {
        e.preventDefault();
      }
    }}
  >
    <div className="relative p-5 bg-white">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 truncate">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  </Link>
);

// Keyword Pill Component
const KeywordPill = ({ keyword, count }: any) => (
  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm">
    <Search className="w-4 h-4 text-gray-500 mr-2" />
    <span className="font-medium text-gray-700">{keyword}</span>
    {count && (
      <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </div>
);

// Product View Card Component
const ProductViewCard = ({ product, type, loading }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-700 capitalize">
        {type} Product
      </span>
      <div className="flex items-center text-xs text-gray-500">
        <Eye className="w-4 h-4 mr-1" />
        <span>Views</span>
      </div>
    </div>
    <div className="flex gap-3 items-center">
      {loading ? (
        <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse"></div>
      ) : product?.images?.[0] ? (
        <Image
          alt={product.name || "Product"}
          src={product.images[0]}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-md"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
          <Package className="w-6 h-6 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {loading ? (
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          ) : product ? (
            product.name
          ) : (
            "No products yet"
          )}
        </p>
        {!loading && product && (
          <div className="flex items-center mt-1">
            <Eye className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{product.views || 0} views</span>
          </div>
        )}
      </div>
      {!loading && product && (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </div>
  </div>
);

// Visitor Stats Component
const VisitorStats = ({ visitorData, loading }: any) => {
  const [timeframe, setTimeframe] = useState("week");
  
  // Calculate stats based on timeframe
  const getStats = () => {
    if (!visitorData || !visitorData.length) return { total: 0, change: 0 };
    
    const now = new Date();
    let compareDate = new Date();
    
    if (timeframe === "week") {
      compareDate.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      compareDate.setMonth(now.getMonth() - 1);
    }
    
    const currentPeriod = visitorData.filter((v: any) => 
      new Date(v.timestamp?.toDate?.() || v.timestamp) >= compareDate
    ).length;
    
    const previousPeriod = visitorData.filter((v: any) => {
      const visitDate = new Date(v.timestamp?.toDate?.() || v.timestamp);
      let startPrevious, endPrevious;
      
      if (timeframe === "week") {
        startPrevious = new Date(compareDate);
        startPrevious.setDate(startPrevious.getDate() - 7);
        endPrevious = new Date(compareDate);
      } else {
        startPrevious = new Date(compareDate);
        startPrevious.setMonth(startPrevious.getMonth() - 1);
        endPrevious = new Date(compareDate);
      }
      
      return visitDate >= startPrevious && visitDate < endPrevious;
    }).length;
    
    const change = previousPeriod > 0 
      ? Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100) 
      : currentPeriod > 0 ? 100 : 0;
    
    return { total: currentPeriod, change };
  };
  
  const stats = getStats();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Visitor Analytics</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {["week", "month"].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 text-xs rounded-md ${
                timeframe === period
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setTimeframe(period)}
            >
              {period === "week" ? "7D" : "30D"}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
      ) : visitorData && visitorData.length > 0 ? (
        <>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
            <div className={`flex items-center text-xs font-medium ${stats.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.change >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(stats.change)}%
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">Total visitors</p>
          
          {/* Simple bar chart visualization */}
          <div className="flex items-end h-12 gap-1 pt-4">
            {[...Array(7)].map((_, i) => {
              const dayData = visitorData.filter((v: any) => {
                const visitDate = new Date(v.timestamp?.toDate?.() || v.timestamp);
                const dayDiff = Math.floor((new Date().getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
                return dayDiff === i;
              });
              
              const height = Math.min(100, (dayData.length / Math.max(1, stats.total)) * 100);
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-md"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    {i === 0 ? 'Today' : i === 1 ? '1d' : `${i}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p>No visitor data yet</p>
        </div>
      )}
    </div>
  );
};

// Define available routes and feature status
const actionCards = [
  {
    title: "Add New Product",
    href: "/store/add-product",
    icon: Plus,
    description: "List a new product in your showcase",
  },
  {
    title: "View Catalog",
    href: `/store/username`,
    icon: Package,
    description: "Browse and manage your product listings",
  },
  {
    title: "Store Settings",
    href: "/store/settings",
    icon: Settings,
    description: "Adjust your store preferences and settings",
  },
  {
    title: "Customer Reviews",
    href: "/store/reviews",
    icon: Star,
    description: "View and manage customer feedback",
  },
  {
    title: "Order Management",
    href: "/store/orders",
    icon: ShoppingCart,
    description: "Process and track orders",
    disabled: true,
  },
  {
    title: "Discount Codes",
    href: "/store/discounts",
    icon: Tag,
    description: "Create and manage promotions",
    disabled: true,
  },
  {
    title: "Customer Messages",
    href: "/store/messages",
    icon: MessageSquare,
    description: "Respond to customer inquiries",
    disabled: true,
  },
  {
    title: "Analytics Report",
    href: "/store/analytics",
    icon: BarChart3,
    description: "Detailed performance insights",
    disabled: true,
  },
];

// Sample trending keywords with counts
const trendingKeywords = [
  { keyword: "Shirt", count: 42 },
  { keyword: "Best mac book under 7k", count: 28 },
  { keyword: "Blue Jeans for users", count: 35 },
  { keyword: "Fancy LED Bulb", count: 19 },
  { keyword: "PS5", count: 56 },
  { keyword: "GTA 5 PS5", count: 31 },
  { keyword: "Women saree under 5000", count: 24 },
  { keyword: "toys", count: 47 },
  { keyword: "gaming pc", count: 39 },
  { keyword: "Best laptop for students", count: 52 },
  { keyword: "Kurta men", count: 33 },
];

// Main Dashboard Component
const StoreDashboard = () => {
  const [stats, setStats] = useState({
    products: null,
    visitors: null,
    sales: null,
    revenue: null,
    orders: null,
    returningCustomers: null,
    reviews: null,
    averageOrderValue: null,
    conversionRate: null,
    lowStockItems: null,
    topCategory: null,
    discountsUsed: null,
    refundsProcessed: null,
    outOfStockProducts: null,
    visitorData: [],
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
      if (!user) {
        router.push("/login");
        return;
      }

      fetchDashboardData(user.uid);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const fetchDashboardData = async (uid: string) => {
    try {
      setLoading(true);
      console.log("User ID:", uid);

      const fetchedUsername = await getUsername(uid);
      setUsername(fetchedUsername);
      setUserId(uid);

      const productsSnapshot = await getDocs(
        collection(db, "users", uid, "products")
      );

      const userDoc = await getDoc(doc(db, "users", uid));
      const userData = userDoc.exists() ? userDoc.data() : { visitCount: 0 };

      setStats({
        products: productsSnapshot.size,
        visitors: userData.visitCount ?? 0,
        sales: userData.sales ?? 0,
        revenue: userData.revenue ?? 0,
        orders: 120,
        returningCustomers: 35,
        reviews: 290,
        averageOrderValue: 34.5,
        conversionRate: 2.5,
        lowStockItems: 15,
        topCategory: "Electronics",
        discountsUsed: 43,
        refundsProcessed: 3,
        outOfStockProducts: 7,
        visitorData: userData.visitorData || [],
      });

      await fetchLeastAndMostViewedProducts(uid);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (userId) {
      fetchDashboardData(userId);
    }
  };

  const fetchLeastAndMostViewedProducts = async (userId: string) => {
    try {
      if (!userId) {
        console.log("User ID is not defined. Cannot fetch product view data.");
        return;
      }

      const leastViewedQuery = query(
        collection(db, "users", userId, "products"),
        orderBy("views"),
        limit(1)
      );
      const mostViewedQuery = query(
        collection(db, "users", userId, "products"),
        orderBy("views", "desc"),
        limit(1)
      );

      const [leastViewedSnapshot, mostViewedSnapshot] = await Promise.all([
        getDocs(leastViewedQuery),
        getDocs(mostViewedQuery),
      ]);

      setLeastViewedProduct(leastViewedSnapshot.docs[0]?.data() ?? null);
      setMostViewedProduct(mostViewedSnapshot.docs[0]?.data() ?? null);
    } catch (error) {
      console.log("Error fetching product view data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Store Dashboard
              </h1>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back{username ? `, ${username}` : ""}! Here's your store performance summary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/store/${username}`}
              className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Store
            </Link>
            <PaymentButton userId={userId} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Products"
            value={stats.products}
            trend={12}
            icon={Package}
            loading={loading}
          />
          <StatCard
            title="Store Visitors"
            value={stats.visitors}
            trend={8}
            icon={Users}
            loading={loading}
          />
          <StatCard
            title="Total Sales"
            value={stats.sales}
            trend={5}
            icon={ShoppingCart}
            loading={loading}
          />
          <StatCard
            title="Revenue"
            value={stats.revenue}
            trend={15}
            icon={DollarSign}
            loading={loading}
            currency={true}
          />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Orders"
            value={stats.orders}
            trend={3}
            icon={ShoppingCart}
            loading={loading}
          />
          <StatCard
            title="Conversion Rate"
            value={stats.conversionRate}
            trend={-2}
            icon={Percent}
            loading={loading}
          />
          <StatCard
            title="Returning Customers"
            value={stats.returningCustomers}
            trend={7}
            icon={UserCheck}
            loading={loading}
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockItems}
            trend={-4}
            icon={AlertTriangle}
            loading={loading}
          />
          <StatCard
            title="Refunds"
            value={stats.refundsProcessed}
            trend={-10}
            icon={RotateCcw}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Visitor Analytics */}
          <div className="lg:col-span-2">
            <VisitorStats visitorData={stats.visitorData} loading={loading} />
          </div>

          {/* Product Performance */}
          <div className="space-y-4">
            <ProductViewCard 
              product={mostViewedProduct} 
              type="Most Viewed" 
              loading={loading}
            />
            <ProductViewCard 
              product={leastViewedProduct} 
              type="Least Viewed" 
              loading={loading}
            />
          </div>
        </div>

        {/* Trending Keywords */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Trending Search Keywords
            </h2>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingKeywords.map((item, index) => (
              <KeywordPill key={index} keyword={item.keyword} count={item.count} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <Link 
              href="/store/settings" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              Manage store <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {actionCards.map((card, index) => (
              <ActionCard
                key={index}
                title={card.title}
                href={
                  card.href === "/store/username"
                    ? `/store/${username}`
                    : card.href
                }
                icon={card.icon}
                description={card.description}
                disabled={card.disabled}
              />
            ))}
        </div>
        </div>

        {/* Recent Activity / Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full mr-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Store visited by 12 new customers</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 p-2 bg-green-100 rounded-full mr-3">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">New order received #ORD-2189</p>
                    <p className="text-sm text-gray-600">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-full mr-3">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-8 00">New 5-star review for "Wireless Headphones"</p>
                    <p className="text-sm text-gray-600">Yesterday</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;