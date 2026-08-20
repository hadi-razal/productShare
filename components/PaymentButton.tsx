"use client";

import React, { useEffect, useState } from "react";
import { FiCheck, FiX, FiZap } from "react-icons/fi";
import { getStoreById, updateStore } from "@/lib/db";
import toast from "react-hot-toast";

// -----------------------------
// UI Components (same as before)
// -----------------------------
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}
const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-3xl mx-4">{children}</div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  className?: string;
}
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-white hover:bg-indigo-700",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// -----------------------------
// Plan Config
// -----------------------------
const starterPlan = {
  key: "starter" as const,
  name: "Starter Plan",
  pricePaise: 49900,
  features: [
    "Up to 25 product listings",
    "5 prebuilt themes",
    "Customer behavior analytics",
    "Public sharing link",
    "Theme customization",
    "Priority support",
    "Custom alert banners",
    "Sales & engagement charts",
    "Product videos",
    "Performance graphs",
    "AI customer insights",
    "Bulk product editing",
  ],
};

const proPlan = {
  key: "pro" as const,
  name: "Pro Plan",
  pricePaise: 99900,
  features: [
    "Up to 150 product listings",
    "12 prebuilt themes",
    "Advanced analytics",
    "Public sharing link",
    "Theme customization",
    "Priority support",
    "Custom alert banners",
    "Sales & engagement charts",
    "Product videos",
    "Performance graphs",
    "AI customer insights",
    "Bulk product editing",
    "Team access",
    "Bulk CSV/Excel upload",
  ],
};

// -----------------------------
// Main Component
// -----------------------------
interface PricingButtonProps {
  userId: string;
}

const PricingButton: React.FC<PricingButtonProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<"starter" | "pro">("starter");
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const selectedPlan = selectedKey === "pro" ? proPlan : starterPlan;
  const displayPrice = (selectedPlan.pricePaise / 100).toLocaleString("en-IN");

  // ✅ Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK loaded ✅");
    document.body.appendChild(script);
  }, []);

  // ✅ Handle subscription flow
  const handleSubscription = async () => {
    const planId =
      selectedKey === "pro"
        ? process.env.NEXT_PUBLIC_RZP_YEARLY_PLAN_ID
        : process.env.NEXT_PUBLIC_RZP_MONTHLY_PLAN_ID;

    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ planId }),
      headers: { "Content-Type": "application/json" },
    });

    const subscription = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
      name: "Product Share",
      description: `${selectedPlan.name} subscription`,
      handler: async (response: any) => {
        toast.success("Subscription started 🎉");
        // ✅ Save subscription to Firestore
        await updateStore(userId, {
          isPremiumUser: true,
          subscriptionId: subscription.id,
          subscribedAt: new Date().toISOString(),
        });
        setIsOpen(false);
      },
      theme: { color: "#4F46E5" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // ✅ Fetch user to check premium status
  useEffect(() => {
    if (!userId) {
      console.warn("userId is undefined");
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const userData = (await getStoreById(userId)) ?? { isPremiumUser: false };
        setIsPremiumUser(Boolean(userData.isPremiumUser));
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading || isPremiumUser) return null;

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        <FiZap className="w-4 h-4 mr-2" />
        Upgrade to Pro
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="relative p-6">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            >
              <FiX className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Choose Your Growth Plan
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              {[starterPlan, proPlan].map((plan) => {
                const selected = selectedKey === plan.key;
                const price = (plan.pricePaise / 100).toLocaleString("en-IN");
                return (
                  <button
                    key={plan.key}
                    type="button"
                    onClick={() => setSelectedKey(plan.key)}
                    className={`rounded-xl border-2 p-4 text-left transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
                    <p className="mt-1 text-xl font-bold text-indigo-600">
                      ₹{price}
                      <span className="ml-1 text-sm font-medium text-gray-500">/ month</span>
                    </p>
                    <p className="mt-2 text-xs text-gray-600">
                      {plan.key === "starter"
                        ? "25 products · 5 themes"
                        : "150 products · 12 themes"}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-xl border-2 border-indigo-500 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                  {selectedPlan.name}
                </h3>
                <div className="text-2xl font-bold text-indigo-600">
                  ₹{displayPrice}
                  <span className="text-base text-gray-500 ml-1">/month</span>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 mb-6">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FiCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Button onClick={handleSubscription} className="w-full">
                  Subscribe {selectedPlan.name} - ₹{displayPrice}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PricingButton;
