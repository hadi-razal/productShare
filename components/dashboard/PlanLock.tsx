import Link from "next/link";
import { Check, Lock, MessageCircle } from "lucide-react";
import type { StoreRecord } from "@/lib/db";
import { inrLabel, PLAN_LIST } from "@/lib/pricing";
import { formatTrialDate, planPurchaseWhatsappUrl, type PlanStatus } from "@/lib/subscription";

export function TrialBanner({ status }: { status: PlanStatus }) {
  if (status.state !== "trial" || !status.trialEndsAt) return null;
  const days = status.daysLeft === 1 ? "1 day" : `${status.daysLeft} days`;
  return (
    <div className="ds-profile-banner ps-trial-banner" role="status">
      <p>
        <strong>Free trial: {days} left.</strong> Your trial ends on {formatTrialDate(status.trialEndsAt)}.
        Choose a plan to keep your catalogue online after that.
      </p>
      <Link href="/pricing">View plans</Link>
    </div>
  );
}

export function PlanExpiredScreen({ store, status }: { store: StoreRecord | null; status: PlanStatus }) {
  const contact = { storeName: store?.name, username: store?.username, email: store?.email };
  return (
    <section className="ps-plan-lock" aria-labelledby="plan-lock-title">
      <span className="ps-plan-lock-icon"><Lock size={22} /></span>
      <h1 id="plan-lock-title">Your free trial has ended</h1>
      <p>
        Your 1-month free trial ended{status.trialEndsAt ? ` on ${formatTrialDate(status.trialEndsAt)}` : ""}.
        Your products and settings are safe, but your catalogue is hidden from customers until you choose a plan.
      </p>
      <div className="ps-plan-lock-grid">
        {PLAN_LIST.map((plan) => (
          <div key={plan.id} className={`ps-plan-lock-card ${plan.id === "pro" ? "is-featured" : ""}`}>
            <strong>{plan.name}</strong>
            <p className="ps-plan-lock-price">
              {inrLabel(plan.monthlyPriceInr)}<span> / month</span>
            </p>
            <p>{plan.description}</p>
            <ul>
              {plan.features.slice(0, 4).map((feature) => (
                <li key={feature}><Check size={14} /> {feature}</li>
              ))}
            </ul>
            <a
              href={planPurchaseWhatsappUrl({ ...contact, planName: plan.name })}
              target="_blank"
              rel="noreferrer"
              className={plan.id === "pro" ? "ds-catalog-btn-primary" : "ds-catalog-btn"}
            >
              <MessageCircle size={16} /> Buy {plan.name} on WhatsApp
            </a>
          </div>
        ))}
      </div>
      <p className="ps-plan-lock-note">
        After payment, our team activates your plan and your catalogue goes live again.{" "}
        <Link href="/pricing">Compare plans</Link> · <Link href="/store/message">Contact support</Link>
      </p>
    </section>
  );
}
