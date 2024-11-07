"use client";

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Plus, Users, ShoppingCart, DollarSign, Eye, Settings, BarChart2, FileText, Box, Star, CheckCircle, Truck, Percent, Repeat, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { getUsername } from '@/helpers/getUsername';

// Stat Card Component
const StatCard = ({ title, value, trend, icon: Icon }: any) => (
  <div className="bg-white rounded-md shadow-md p-6">
    <div className="flex items-center justify-between">
      <div className="p-3 bg-purple-100 rounded-lg">
        <Icon className="w-6 h-6 text-blue-900" />
      </div>
      {trend && (
        <div className={`flex items-center text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <h3 className="mt-4 text-2xl font-semibold text-gray-800">{value ?? '...'}</h3>
    <p className="mt-1 text-sm text-gray-500">{title}</p>
  </div>
);

// Action Card Component
const ActionCard = ({ title, href = "#", icon: Icon, description }: any) => (
  <Link
    href={href}
    className="block bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    onClick={(e) => {
      if (href === "#") {
        e.preventDefault();
        // Optional: Add a toast notification here for features under development
      }
    }}
  >
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-100 rounded-lg transition-colors duration-200 group-hover:bg-purple-100">
          <Icon className="w-6 h-6 text-blue-900" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-200 group-hover:text-blue-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  </Link>
);

// Define available routes and feature status
const actionCards = [
  { title: "Add New Product", href: "/add-product", icon: Plus, description: "List a new product in your showcase" },
  { title: "View Catalog", href: "/store", icon: Package, description: "Browse and manage your product listings" },
  { title: "Manage Orders", href: "/orders", icon: ShoppingCart, description: "View and process recent orders" },
  { title: "Store Settings", href: "/settings", icon: Settings, description: "Adjust your store preferences and settings" },
  { title: "Customer Reviews", href: "/reviews", icon: Star, description: "View and manage customer feedback" },
  { title: "Product Analytics", href: "/analytics", icon: BarChart2, description: "View product performance and trends" },
  { title: "Share Catalog", href: "#", icon: Eye, description: "Share your product catalog with customers" },
  { title: "Marketing Campaigns", href: "/marketing", icon: TrendingUp, description: "Create and monitor marketing campaigns" },
  { title: "Customer Support", href: "/support", icon: AlertTriangle, description: "Provide support for customer inquiries" },
  { title: "Store Themes", href: "/settings/themes", icon: Settings, description: "Customize your store's visual appearance" },
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
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const fetchData = async () => {
        try {
          const fetchedUsername = await getUsername(user.uid);
          setUsername(fetchedUsername);

          // Fetch various stats and data
          const productsSnapshot = await getDocs(collection(db, user.uid));
          const userDoc = await getDoc(doc(db, "users", user.uid));
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

          setLoading(false);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          setLoading(false);
        }
      };

      fetchData();
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back{username ? `, ${username}` : ''}!</h1>
          <p className="mt-2 text-sm text-gray-600">Here's what's happening with your store today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Products" value={loading ? null : stats.products} trend={12} icon={Package} />
          <StatCard title="Store Visitors" value={loading ? null : stats.visitors} trend={8} icon={Users} />
          <StatCard title="Total Sales" value={loading ? null : stats.sales} trend={15} icon={ShoppingCart} />
          <StatCard title="Orders" value={loading ? '...' : stats.orders} trend={5} icon={CheckCircle} />
        </div>

        {/* Visitors Chart */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visitors Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.visitorData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Action Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actionCards.map((card, index) => (
            <ActionCard
              key={index}
              title={card.title}
              href={card.href}
              icon={card.icon}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;