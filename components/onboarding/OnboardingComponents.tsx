"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";
import {
  Check,
  CheckCheck,
  ArrowLeft,
  ArrowRight,
  Monitor,
  Smartphone,
  LockKeyhole,
  MessageCircle,
  MapPin,
  Upload,
  Sparkles,
  Mail,
  Globe,
  Clock3,
} from "lucide-react";
import { motion } from "framer-motion";
import type { OnboardingData } from "@/lib/onboarding";

export function Brand() {
  return (
    <div className="ob-brand">
      <Image
        src="/productShareLV-cropped.svg"
        alt="ProductShare"
        width={145}
        height={38}
        priority
      />
    </div>
  );
}
export function OnboardingProgress({
  step,
  status,
}: {
  step: number;
  status: string;
}) {
  return (
    <div className="ob-progress">
      <div>
        <span>
          Step {step + 1} <span className="ob-muted">of 7</span>
        </span>
        <span role="status">
          <CheckCheck size={14} /> {status}
        </span>
      </div>
      <div
        className="ob-progress-track"
        role="progressbar"
        aria-label="Setup progress"
        aria-valuemin={0}
        aria-valuemax={7}
        aria-valuenow={step + 1}
      >
        <motion.div
          initial={false}
          animate={{ width: `${((step + 1) / 7) * 100}%` }}
        />
      </div>
    </div>
  );
}
export function OnboardingNavigation({
  step,
  busy,
  valid,
  back,
  retry,
}: {
  step: number;
  busy: boolean;
  valid: boolean;
  back: () => void;
  retry: boolean;
}) {
  return (
    <footer className="ob-navigation">
      <button
        type="button"
        className="ob-back"
        onClick={back}
        disabled={step === 0 || busy}
      >
        <ArrowLeft size={17} /> Back
      </button>
      <button className="ob-primary" disabled={!valid || busy} type="submit">
        {busy ? (
          <>
            <span className="ob-spinner" /> Saving…
          </>
        ) : (
          <>
            {step === 0
              ? "Get started"
              : step === 6
                ? retry
                  ? "Retry creating catalogue"
                  : "Create my catalogue"
                : "Continue"}
            <ArrowRight size={17} />
          </>
        )}
      </button>
    </footer>
  );
}
export function SelectableCard({
  selected,
  children,
  onClick,
  multiple = false,
}: {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
  multiple?: boolean;
}) {
  return (
    <button
      type="button"
      className={`ob-choice ${selected ? "is-selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span>{children}</span>
      <span className={`ob-choice-check ${multiple ? "square" : ""}`}>
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
    </button>
  );
}
export function StoreLogoUploader({
  url,
  name,
  busy,
  onUpload,
}: {
  url: string;
  name: string;
  busy: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="ob-upload">
      <span className="ob-avatar">
        {url ? (
          <Image
            src={url}
            alt="Store logo"
            width={58}
            height={58}
            unoptimized
          />
        ) : (
          initials(name)
        )}
      </span>
      <label className="ob-upload-label">
        {busy ? (
          "Uploading…"
        ) : (
          <>
            <Upload size={16} /> Upload store logo
          </>
        )}
        <input
          aria-label="Upload store logo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = "";
          }}
        />
        <small>Optional · JPG, PNG or WebP · max 1 MB</small>
      </label>
    </div>
  );
}
export const initials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "YS";
export function StorePreview({ data }: { data: OnboardingData }) {
  const [mobile, setMobile] = useState(false);
  const color = /^#[0-9a-f]{6}$/i.test(data.brand_color)
    ? data.brand_color
    : "#6860C9";
  const rgb = color
    .slice(1)
    .match(/../g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const foreground =
    rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 > 0.179
      ? "#17171C"
      : "#fff";
  return (
    <div
      className="ob-preview-content"
      style={
        {
          "--store-color": color,
          "--store-foreground": foreground,
        } as CSSProperties
      }
    >
      <div className="ob-preview-toolbar">
        <span>
          <i /> LIVE PREVIEW
        </span>
        <div>
          <button
            type="button"
            aria-label="Desktop preview"
            aria-pressed={!mobile}
            onClick={() => setMobile(false)}
          >
            <Monitor size={17} />
          </button>
          <button
            type="button"
            aria-label="Mobile preview"
            aria-pressed={mobile}
            onClick={() => setMobile(true)}
          >
            <Smartphone size={17} />
          </button>
        </div>
      </div>
      <div className={`ob-browser ${mobile ? "ob-browser-mobile" : ""}`}>
        <div className="ob-browser-bar">
          <span className="ob-browser-dots">
            <i />
            <i />
            <i />
          </span>
          <span>
            <LockKeyhole size={11} /> productshare.in/store/
            {data.store_slug || "your-store"}
          </span>
          <span>↗</span>
        </div>
        <div className="ob-store-cover">
          <span>Thoughtfully curated. Simply shared.</span>
          <Sparkles size={30} />
        </div>
        <div className="ob-store-content">
          <div className="ob-store-identity">
            <span className="ob-store-logo">
              {data.store_logo_url ? (
                <Image
                  src={data.store_logo_url}
                  alt=""
                  width={66}
                  height={66}
                  unoptimized
                />
              ) : (
                initials(data.store_name || data.full_name)
              )}
            </span>
            <span className="ob-store-category">
              {data.business_category === "Other"
                ? data.custom_business_category || "Your category"
                : data.business_category || "Your business, beautifully online"}
            </span>
          </div>
          <h2>{data.store_name || "Your store, your story."}</h2>
          <p>
            {data.store_description ||
              "A little collection of things you’ll love. Explore our catalogue and find your next favourite."}
          </p>
          <div className="ob-store-meta">
            <span>
              <MapPin size={12} />{" "}
              {[data.city, data.state].filter(Boolean).join(", ") ||
                "Made for your customers"}
            </span>
            {data.full_name && <span>By {data.full_name}</span>}
          </div>
          <div className="ob-store-actions">
            {data.allow_product_enquiries && (
              <button
                type="button"
                title="Preview only — enabled on your published store"
              >
                Contact store <ArrowRight size={13} />
              </button>
            )}
            {data.show_whatsapp_button && (
              <button
                type="button"
                title={
                  data.whatsapp_number
                    ? `WhatsApp +${data.whatsapp_number}`
                    : "Your WhatsApp enquiry button"
                }
              >
                <MessageCircle size={14} /> WhatsApp
              </button>
            )}
          </div>
          <div className="ob-products-heading">
            <h3>Our collection</h3>
            <span>Sample products</span>
          </div>
          <div className="ob-products">
            {[
              {
                name: "Sandstone vase",
                image: "sandstone-vase.png",
                price: 1299,
                label: "BESTSELLER",
              },
              {
                name: "Everyday tote",
                image: "handwoven-tote.png",
                price: 899,
                label: "",
              },
              {
                name: "Linen table runner",
                image: "linen-table-runner.png",
                price: 1499,
                label: "NEW",
              },
            ].map((product) => (
              <div className="ob-product" key={product.name}>
                <div>
                  <Image
                    src={`/dashboard/${product.image}`}
                    alt={product.name}
                    width={260}
                    height={300}
                  />
                  {product.label && <span>{product.label}</span>}
                </div>
                <h4>{product.name}</h4>
                <p>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: data.currency,
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </p>
              </div>
            ))}
          </div>
          <div className="ob-store-footer">
            Made with <strong>ProductShare</strong>
            <span>One link. Endless possibilities.</span>
          </div>
        </div>
      </div>
      <div className="ob-preview-caption">
        <span>
          <Sparkles size={16} />
        </span>
        <div>
          <strong>A little preview of what’s next</strong>
          <p>Watch your catalogue come to life as you make it yours.</p>
        </div>
      </div>
      <p className="ob-sample-note">
        Sample products are for illustration. Add your own after setup.
      </p>
    </div>
  );
}
export function SetupSummary({
  data,
  edit,
}: {
  data: OnboardingData;
  edit: (step: number) => void;
}) {
  const sections = [
    {
      step: 1,
      title: "Your details",
      lines: [
        data.full_name,
        `${data.country_code} ${data.contact_number}`,
        data.email,
      ],
    },
    {
      step: 2,
      title: "Your store",
      lines: [
        data.store_name,
        [data.city, data.state].join(", "),
        data.store_description,
      ],
    },
    {
      step: 3,
      title: "Business category",
      lines: [
        data.business_category === "Other"
          ? data.custom_business_category
          : data.business_category,
      ],
    },
    {
      step: 4,
      title: "Your catalogue",
      lines: [
        `${data.product_count_range} products`,
        data.catalogue_sharing_methods.join(", "),
      ],
    },
    {
      step: 5,
      title: "Catalogue identity",
      lines: [
        `productshare.in/store/${data.store_slug}`,
        `${data.currency} · ${data.brand_color}`,
        `WhatsApp ${data.show_whatsapp_button ? `on · +${data.whatsapp_number}` : "off"} · Product enquiries ${data.allow_product_enquiries ? "on" : "off"}`,
      ],
    },
  ];
  return (
    <div className="ob-summary">
      {sections.map((section) => (
        <section key={section.step}>
          <div>
            <h3>{section.title}</h3>
            <button
              type="button"
              onClick={() => edit(section.step)}
              aria-label={`Edit ${section.title.toLowerCase()}`}
            >
              Edit
            </button>
          </div>
          {section.lines.filter(Boolean).map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
export function ProductShareSupportCard() {
  return (
    <div className="ob-support-card">
      <Brand />
      <h2>Need help setting up your catalogue?</h2>
      <p>Our team is ready to help you get started.</p>
      <div className="ob-support-links">
        <a href="tel:+919400244731">
          <MessageCircle size={16} /> +91 94002 44731
        </a>
        <a href="mailto:admin@duoph.in">
          <Mail size={16} /> admin@duoph.in
        </a>
        <a
          href="https://productshare.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe size={16} /> productshare.in
        </a>
      </div>
      <a
        className="ob-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        href="https://wa.me/919400244731?text=Hi%20ProductShare%20Team%2C%20I%20need%20help%20setting%20up%20my%20product%20catalogue."
      >
        <MessageCircle size={18} /> Chat with us on WhatsApp
      </a>
      <small>
        <Clock3 size={13} /> We usually respond during business hours.
      </small>
    </div>
  );
}
