"use client";

import Image from "next/image";
import StoreBannerSlider from "./StoreBannerSlider";
import { FiArrowUpRight, FiMessageCircle, FiTag } from "react-icons/fi";
import { normalizeStoreHeader } from "@/lib/store-header";

export default function StoreHeader({ name, logo, description, note, header, whatsapp }: {
  name: string; logo?: string | null; description?: string; note?: string;
  header?: unknown; whatsapp?: string;
}) {
  const config = normalizeStoreHeader(header);
  const label = { offer: "Special offer", arrival: "New arrivals", announcement: "Store update" }[config.kind];
  return <div className={`sf-welcome sf-welcome-${config.layout}`}>
    <div className="sf-welcome-top">
      <div className="sf-store-identity">
        {logo ? <Image src={logo} alt="" width={64} height={64} unoptimized className="sf-store-mark-image" /> : <div className="sf-store-mark" aria-hidden="true">{name.charAt(0).toUpperCase()}</div>}
        <div className="sf-store-copy"><span className="sf-welcome-eyebrow">Welcome to our store</span><h1>{name}</h1>{description?.trim() && <p>{description}</p>}</div>
      </div>
      {whatsapp && /^[1-9]\d{7,14}$/.test(whatsapp) && <a className="sf-contact" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"><FiMessageCircle aria-hidden="true" /> Chat with us <FiArrowUpRight aria-hidden="true" /></a>}
    </div>
    <StoreBannerSlider banners={config.banners} autoSlide={config.autoSlide} delay={config.slideDelay} />
    {!config.banners.length && config.enabled && (config.title.trim() || note?.trim()) && <section className="sf-spotlight" aria-label={label}>
      <div className="sf-spotlight-copy"><span className="sf-welcome-eyebrow"><FiTag aria-hidden="true" /> {label}</span>{config.title.trim() && <h2>{config.title}</h2>}{note?.trim() && <p>{note}</p>}</div>
      {config.kind === "offer" && config.code.trim() && <div className="sf-promo-code"><span>Use code</span><strong>{config.code}</strong></div>}
    </section>}
  </div>;
}
