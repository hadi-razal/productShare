"use client";

import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { User, Package, PlusCircle, Users, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';
import { getUsername } from '@/helpers/getUsername';
import { useRouter } from 'next/navigation';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

type StatCardProps = {
  title: string;
  value: number | string | null;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
};

const StatCard = ({ title, value, subtitle, icon: Icon, bgColor }: StatCardProps) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-slate-950">{value ?? (<span className='font-normal text-sm'>calculating...</span>)}</h3>
        <p className="text-green-500 text-sm">{subtitle}</p>
      </div>
      <div className={`${bgColor} p-3 rounded-full`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </Card>
);

type ActionCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
};

const ActionCard = ({ title, description, icon: Icon, iconColor, primaryAction, secondaryAction }: ActionCardProps) => (
  <Card className="hover:shadow-md transition duration-300">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="bg-gray-100 p-3 rounded-full">
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="w-full space-y-2">
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  </Card>
);

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "purple";
  className?: string;
  onClick?: () => void;
};

const Button = ({ children, variant = "primary", className = "", ...props }: ButtonProps) => {
  const baseClasses = "w-full px-4 py-2 rounded-md transition";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "border border-purple-600 text-purple-600 hover:bg-purple-50",
    purple: "bg-purple-600 text-white hover:bg-purple-700"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

type LinkButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
};

const LinkButton = ({ children, href, variant = "primary", className = "" }: LinkButtonProps) => {
  const baseClasses = "w-full px-4 py-2 rounded-md transition text-center";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "border border-purple-600 text-purple-600 hover:bg-purple-50"
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
};

const UserDashboard = () => {

  const [numberOfProducts, setNumberOfProducts] = useState<number | null>(null);
  const [numberOfStoreVisit, setNumberOfStoreVisit] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (!user) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);


  useEffect(() => {
    const fetchProductCount = async (userId: string) => {
      try {
        const productsCollection = collection(db, userId);
        const productsSnapshot = await getDocs(productsCollection);
        setNumberOfProducts(productsSnapshot.size);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchStoreVisit = async (userId: string) => {
      try {
        const userDocRef = doc(db, "users", userId);
        const snapshotUser = await getDoc(userDocRef);

        if (snapshotUser.exists()) {
          const data = snapshotUser.data();
          setNumberOfStoreVisit(data.visitCount ?? 0);
        }
      } catch (error) {
        console.error("Error fetching store visit count:", error);
      }
    };

    const updateUsername = async (user: FirebaseUser) => {
      try {
        const fetchedUsername = await getUsername(user.uid);
        setUsername(fetchedUsername);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        updateUsername(user);
        fetchProductCount(user.uid);
        fetchStoreVisit(user.uid);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <main className="max-w-7xl mx-auto p-6">
        {/* Welcome Message */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-950 mb-2">Product Showcase Dashboard</h2>
          <p className="text-gray-600">Share your products and track visitor engagement</p>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={loading ? null : numberOfProducts}
            subtitle="Active in catalog"
            icon={Package}
            bgColor="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Total Visitors"
            value={loading ? null : numberOfStoreVisit}
            subtitle="This week"
            icon={Users}
            bgColor="bg-purple-50 text-purple-600"
          />
          <StatCard
            title="Total Shares"
            value="286"
            subtitle="Product links shared"
            icon={Share2}
            bgColor="bg-green-50 text-green-600"
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Add Product"
            description="Add a new product to your showcase"
            icon={PlusCircle}
            iconColor="text-green-600"
            primaryAction={
              <LinkButton href="/add-product">
                Add New Product
              </LinkButton>
            }
          />

          <ActionCard
            title="My Catalog"
            description="View and manage your products"
            icon={Package}
            iconColor="text-blue-600"
            primaryAction={
              <LinkButton href={`/store/${username ?? ''}`}>
                View Catalog
              </LinkButton>
            }
          />

          <ActionCard
            title="Profile"
            description="Manage your showcase profile"
            icon={User}
            iconColor="text-purple-600"
            primaryAction={
              <Button variant="purple">
                Edit Profile
              </Button>
            }
            secondaryAction={
              <Button variant="secondary">
                Profile Settings
              </Button>
            }
          />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
