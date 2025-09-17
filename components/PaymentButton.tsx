"use client";

import React, { useEffect, useState } from "react";
import { Check, X, Zap } from "lucide-react";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

// -----------------------------
// UI COMPONENTS
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
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
      checked ? "bg-indigo-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
        checked ? "translate-x-5" : "translate-x-0.5"
      }`}
    />
  </button>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary";
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    secondary: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

// -----------------------------
// PLAN CONFIG
// -----------------------------

const plan = {
  name: "Pro Plan",
  monthlyPrice: 1000, // 100 = ₹1, so 10000 = ₹100
  yearlyPrice: 999900, // ₹9999
  features: [
    "Up to 100 products",
    "Advanced analytics & reporting",
    "Videos can be added to the product display",
    "Priority support",
    "Unlimited product images per item",
    "Shareable catalog link for easy distribution",
    "User-friendly product search and filtering",
    "Integration with social media sharing",
    "Add-to-cart or wishlist options for users",
    "Customer feedback and review section",
    "SEO-friendly URLs for better online visibility",
    "Password-protected catalog for privacy",
    "Display sale and discount tags on products",
  ],
};

// -----------------------------
// MAIN COMPONENT
// -----------------------------

interface PricingButtonProps {
  userId: string;
}

const PricingButton: React.FC<PricingButtonProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // ✅ Load Razorpay script on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK loaded ✅");
    script.onerror = () => console.error("Failed to load Razorpay SDK ❌");
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
  const amount = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  // create order on backend
  const res = await fetch("/api/create-order", {
    method: "POST",
    body: JSON.stringify({ amount }),
    headers: { "Content-Type": "application/json" },
  });
  const order = await res?.json();

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public key
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: "Product Share",
    description: `${plan.name} - ${isYearly ? "Annual" : "Monthly"} Subscription`,
    image: "/logo.png",
    handler: async (response: any) => {
      toast.success("Payment Successful 🎉");
      // update Firestore etc.
    },
    theme: { color: "#4F46E5" },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};


  useEffect(() => {
    if (!userId) {
      console.warn("userId is undefined");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        const userData = userDoc.exists()
          ? userDoc.data()
          : { isPremiumUser: false };
        setIsPremiumUser(userData.isPremiumUser);
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
        <Zap className="w-4 h-4 mr-2" />
        Upgrade to Pro
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="relative p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Choose Your Growth Plan
              </h2>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className={`text-sm ${
                  !isYearly ? "text-indigo-600 font-medium" : "text-gray-600"
                }`}
              >
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    isYearly ? "text-indigo-600 font-medium" : "text-gray-600"
                  }`}
                >
                  Yearly
                </span>
                <Badge variant="secondary">Save 20%</Badge>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-xl border-2 border-indigo-500 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                  {plan.name}
                </h3>
                <div className="text-2xl font-bold text-indigo-600">
                  ₹{((isYearly ? plan.yearlyPrice : plan.monthlyPrice) / 100).toFixed(2)}
                  <span className="text-base text-gray-500 ml-1">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Button onClick={handlePayment} className="w-full">
                  Subscribe {isYearly ? "Yearly" : "Monthly"} - ₹
                  {((isYearly ? plan.yearlyPrice : plan.monthlyPrice) / 100).toFixed(2)}
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
