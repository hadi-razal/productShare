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
import { Package, Plus, Settings, Star, Users, ArrowRight } from "lucide-react";
import { getUsername } from "@/helpers/getUsername";
import PaymentButton from "@/components/PaymentButton";
import Image from "next/image";

// Stat Card Component
const StatCard = ({ title, value, trend, icon: Icon }: any) => (
  <div className="bg-white rounded-md shadow-md p-6">
    <div className="flex items-center justify-between">
      <div className="p-3 bg-purple-100 rounded-lg">
        <Icon className="w-6 h-6 text-blue-900" />
      </div>
      {trend && (
        <div
          className={`flex items-center text-sm ${
            trend >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <h3 className="mt-4 text-2xl font-semibold text-gray-800">
      {value ?? "..."}
    </h3>
    <p className="mt-1 text-sm text-gray-500">{title}</p>
  </div>
);

// Enhanced Action Card Component with hover effects
const ActionCard = ({ title, href = "#", icon: Icon, description }: any) => (
  <Link
    href={href}
    className={`block rounded-2xl overflow-hidden shadow-xl `}
    onClick={(e) => {
      if (href === "#") {
        e.preventDefault();
      }
    }}
  >
    <div className="relative p-6">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
      <div className="relative flex items-center space-x-4">
        <div className="p-3 bg-white/80 rounded-xl shadow-inner">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  </Link>
);

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

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const fetchData = async () => {
        try {
          const fetchedUsername = await getUsername(user.uid);
          setUsername(fetchedUsername);
          setUserId(user.uid);

          // Fetch various stats and data
          const productsSnapshot = await getDocs(collection(db, user.uid));
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.exists()
            ? userDoc.data()
            : { visitCount: 0 };

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

          await fetchLeastAndMostViewedProducts(user.uid);

          setLoading(false);
        } catch (error) {
          console.log("Error fetching dashboard data:", error);
          setLoading(false);
        }
      };

      fetchData();
    });

    return () => unsubscribe();
  }, []);

  const fetchLeastAndMostViewedProducts = async (userId: string) => {
    try {
      if (!userId) {
        console.log("User ID is not defined. Cannot fetch product view data.");
        return;
      }

      const leastViewedQuery = query(
        collection(db, userId),
        orderBy("views"),
        limit(1)
      );
      const mostViewedQuery = query(
        collection(db, userId),
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex gap-3 flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{username ? `, ${username}` : ""}!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Here's what's happening with your store today
            </p>
          </div>

          <div className="flex items-center justify-center">
            <PaymentButton userId={userId} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
            title="Total Products"
            value={loading ? null : stats.products}
            trend={12}
            icon={Package}
          />
          <StatCard
            title="Store Visitors"
            value={loading ? null : stats.visitors}
            trend={8}
            icon={Users}
          />
          <StatCard
            title="Customer Reviews"
            value={loading ? null : stats.reviews}
            trend={stats.reviews ? (stats.reviews > 200 ? 10 : 2) : null}
            icon={Star}
          />
          <StatCard
            title="Customer Reviews"
            value={loading ? null : stats.reviews}
            trend={stats.reviews ? (stats.reviews > 200 ? 10 : 2) : null}
            icon={Star}
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Latest Searched Keywords
        </h2>
        <div className="bg-white rounded-md shadow-md p-6 mb-10 flex gap-2 flex-wrap">
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">Shirt</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">Best mac book under 7k</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">Blue Jeans for users</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">Fancy LED Bulb</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">PS5</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">GTA 5 PS5</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">Women saree under 5000</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">toys</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">gaming pc</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">Best laptop for students</span>
          <span className="flex items-center justify-between bg-gray-100 rounded-md shadow-md px-4 py-2">Kurta men</span>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>
        <div className="grid gap-4 sm:grid-cols-2 pb-10">
          {/* Most Viewed Product */}
          <div className="bg-white rounded-md shadow-md p-6 flex flex-col gap-3">
            <span className="text-gray-700 font-bold">Most Viewed Product</span>
            <div className="flex gap-3 items-center cursor-pointer">
              {mostViewedProduct &&
                mostViewedProduct.images &&
                mostViewedProduct.images[0] && (
                  <Image
                    alt="Most Viewed Product"
                    src={mostViewedProduct.images[0]}
                    width={100} // Adjust width and height as needed
                    height={100} // Adjust width and height as needed
                    className="w-24 h-24 object-cover rounded-md" // Style for image
                  />
                )}
              <div>
                <p className="font-semibold text-gray-800 line-clamp-3">
                  {mostViewedProduct ? mostViewedProduct.name : "Loading..."}
                </p>
                {mostViewedProduct && (
                  <p className="text-sm text-gray-600">
                    Views: {mostViewedProduct.views}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Least Viewed Product */}
          <div className="bg-white rounded-md shadow-md p-6 flex flex-col gap-3">
            <span className="text-gray-700 font-bold">
              Least Viewed Product
            </span>
            <div className="flex gap-3 items-center cursor-pointer">
              {leastViewedProduct &&
                leastViewedProduct.images &&
                leastViewedProduct.images[0] && (
                  <Image
                    alt="Least Viewed Product"
                    src={leastViewedProduct.images[0]}
                    width={100} // Adjust width and height as needed
                    height={100} // Adjust width and height as needed
                    className="w-24 h-24 object-cover rounded-md" // Style for image
                  />
                )}
              <div>
                <p className="font-semibold text-gray-800 line-clamp-3">
                  {leastViewedProduct ? leastViewedProduct.name : "Loading..."}
                </p>
                {leastViewedProduct && (
                  <p className="text-sm text-gray-600">
                    Views: {leastViewedProduct.views}
                  </p>
                )}
              </div>
            </div>
          </div>

          <span className="text-sm -pt-6 text-gray-400">
            For more detailed product information, including view counts, visit
            each product's page.
          </span>
        </div>

        {/* Action Cards Grid */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
