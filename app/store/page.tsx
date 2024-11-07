"use client";

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Plus, Users, ShoppingCart, DollarSign, Eye } from 'lucide-react';
import { LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { getUsername } from '@/helpers/getUsername';

// Stat Card Component
const StatCard = ({ title, value, trend, icon: Icon }:any) => (
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
const ActionCard = ({ title, href, icon: Icon, description }:any) => (
  <Link href={href} className="block bg-white rounded-md shadow-md overflow-hidden">
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

// Main Dashboard Component
const StoreDashboard = () => {
  const [stats, setStats] = useState({
    products: null,
    visitors: null,
    sales: null,
    revenue: null,
    visitorData: [],
    mostVisitedProduct: null,
    leastVisitedProduct: null,
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

          // Fetch products, users, and user data
          const productsSnapshot = await getDocs(collection(db, user.uid));
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.exists() ? userDoc.data() : { visitCount: 0 };

          // Get most and least visited products
          const mostVisitedQuery = query(collection(db, user.uid), orderBy("views", "desc"), limit(1));
          const leastVisitedQuery = query(collection(db, user.uid), orderBy("views", "asc"), limit(1));
          const [mostVisitedSnapshot, leastVisitedSnapshot] = await Promise.all([
            getDocs(mostVisitedQuery),
            getDocs(leastVisitedQuery),
          ]);

          const mostVisitedProduct = mostVisitedSnapshot.docs[0]?.data() || null;
          const leastVisitedProduct = leastVisitedSnapshot.docs[0]?.data() || null;

          // Set stats
          setStats({
            products: productsSnapshot.size,
            visitors: userData.visitCount ?? 0,
            sales: userData.sales ?? 0,
            revenue: userData.revenue ?? 0,
            visitorData: userData.visitorData || [],
            mostVisitedProduct,
            leastVisitedProduct,
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
          <StatCard title="Revenue" value={`$${loading ? '...' : stats.revenue}`} trend={10} icon={DollarSign} />
        </div>

        {/* Visitors Chart */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visitors Trend</h2>
          <LineChart width={600} height={300} data={stats.visitorData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Most and Least Visited Products */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Most Visited Product"
              value={loading ? '...' : stats.mostVisitedProduct?.name || 'N/A'}
              icon={Eye}
              trend={stats.mostVisitedProduct?.views || 0}
            />
            <StatCard
              title="Least Visited Product"
              value={loading ? '...' : stats.leastVisitedProduct?.name || 'N/A'}
              icon={Eye}
              trend={stats.leastVisitedProduct?.views || 0}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ActionCard title="Add New Product" href="/add-product" icon={Plus} description="List a new product in your showcase" />
            <ActionCard title="View Catalog" href={`/store/${username ?? ''}`} icon={Package} description="Browse and manage your product listings" />
            <ActionCard title="Manage Orders" href="/manage-orders" icon={ShoppingCart} description="View and process recent orders" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-500">Loading activity...</p>
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
