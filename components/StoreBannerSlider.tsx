"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { StoreHeader } from "@/lib/store-header";

export default function StoreBannerSlider({ banners, autoSlide = true, delay = 3 }: { banners: StoreHeader["banners"]; autoSlide?: boolean; delay?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = Math.min(index, banners.length - 1);
  const playing = autoSlide && !paused && !hovered && !focused && banners.length > 1;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(current => (Math.min(current, banners.length - 1) + 1) % banners.length);
    }, (Number.isFinite(delay) ? Math.min(30, Math.max(1, delay)) : 3) * 1000);
    return () => window.clearInterval(timer);
  }, [playing, delay, banners.length, index]);
  if (!banners.length) return null;
  const move = (step: number) => setIndex((active + step + banners.length) % banners.length);
  return <section className="sf-banner-slider" aria-label="Store banners" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="sf-banner-image" aria-roledescription="slide" aria-label={`${active + 1} of ${banners.length}`}>
      <Image src={banners[active].url} alt={banners[active].alt || `Store banner ${active + 1}`} fill unoptimized sizes="100vw" style={{ objectFit: "contain" }} />
    </div>
    {banners.length > 1 && <div className="sf-banner-controls">
      <button type="button" onClick={() => move(-1)} aria-label="Previous banner"><FiChevronLeft /></button>
      <div className="sf-banner-dots">{banners.map((banner, slide) => <button key={`${banner.url}-${slide}`} type="button" aria-label={`Show banner ${slide + 1}`} aria-current={active === slide ? "true" : undefined} onClick={() => setIndex(slide)}><span /></button>)}</div>
      <span className="sr-only" aria-live={playing ? "off" : "polite"}>Banner {active + 1} of {banners.length}</span>
      {autoSlide && <button type="button" onClick={() => setPaused(current => !current)} aria-label={paused ? "Resume auto-slide" : "Pause auto-slide"} className="text-xs">{paused ? "Play" : "Pause"}</button>}
      <button type="button" onClick={() => move(1)} aria-label="Next banner"><FiChevronRight /></button>
    </div>}
  </section>;
}
