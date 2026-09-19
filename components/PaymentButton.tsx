"use client";

import React, { useEffect, useState } from "react";
import { FiCheck, FiX, FiZap } from "react-icons/fi";
import { getStoreById, updateStore } from "@/lib/db";
import {
  PLAN_LIST,
  PLANS,
  YEARLY_DISCOUNT_PERCENT,
  formatInrAmount,
  inrLabel,
  planPriceInr,
  razorpayPlanId,
  yearlyEffectiveMonthlyInr,
  yearlyFullPriceInr,
  type BillingCycle,
  type PlanId,
} from "@/lib/pricing";
import toast from "react-hot-toast";

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

interface PricingButtonProps {
  userId: string;
}

const PricingButton: React.FC<PricingButtonProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [planId, setPlanId] = useState<PlanId>("pro");
  const [cycle, setCycle] = useState<BillingCycle>("yearly");
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const selectedPlan = PLANS[planId];
  const price = planPriceInr(selectedPlan, cycle);
  const displayPrice = formatInrAmount(price);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubscription = async () => {
    const razorpayId = razorpayPlanId(planId, cycle);

    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ planId: razorpayId }),
      headers: { "Content-Type": "application/json" },
    });

    const subscription = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
      name: "Product Share",
      description: `${selectedPlan.name} ${cycle} subscription`,
      handler: async () => {
        toast.success("Subscription started 🎉");
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

  useEffect(() => {
    if (!userId) {
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
        Upgrade
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="bg-white rounded-md shadow-2xl">
          <div className="relative p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            >
              <FiX className="h-4 w-4" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Choose Plus or Pro
              </h2>
            </div>

            <div className="mb-4 flex justify-center">
              <div className="inline-flex border border-gray-200 p-1">
                {(["monthly", "yearly"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCycle(option)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                      cycle === option
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    {option === "yearly"
                      ? `Yearly · ${YEARLY_DISCOUNT_PERCENT}% off`
                      : "Monthly"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mb-6">
              {PLAN_LIST.map((plan) => {
                const selected = planId === plan.id;
                const planPrice = planPriceInr(plan, cycle);
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setPlanId(plan.id)}
                    className={`rounded-xl border-2 p-4 text-left transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
                      {plan.id === "pro" && (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xl font-bold text-indigo-600">
                      ₹{formatInrAmount(planPrice)}
                      <span className="ml-1 text-sm font-medium text-gray-500">
                        {cycle === "yearly" ? "/year" : "/month"}
                      </span>
                    </p>
                    {cycle === "yearly" ? (
                      <p className="mt-2 text-xs text-gray-600">
                        <span className="mr-1 line-through">
                          {inrLabel(yearlyFullPriceInr(plan.monthlyPriceInr))}
                        </span>
                        {inrLabel(yearlyEffectiveMonthlyInr(plan.monthlyPriceInr))} / month billed annually
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-gray-600">
                        {plan.productLimit} products · {plan.themeLabel}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-white rounded-md border-2 border-indigo-500 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                  {selectedPlan.name}
                </h3>
                <div className="text-2xl font-bold text-indigo-600">
                  ₹{displayPrice}
                  <span className="text-base text-gray-500 ml-1">
                    {cycle === "yearly" ? "/year" : "/month"}
                  </span>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 mb-6">
                {selectedPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <FiCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Button onClick={handleSubscription} className="w-full">
                  Subscribe {selectedPlan.name} — ₹{displayPrice}
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
