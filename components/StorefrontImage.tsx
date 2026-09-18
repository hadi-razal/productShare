"use client";

import { useEffect, useRef, useState } from "react";

type StorefrontImageProps = {
  src: string;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  onClick?: () => void;
};

export const usableMediaSrc = (src?: string | null) => {
  const value = String(src || "").trim();
  return /^(https?:|blob:|data:|\/)/i.test(value) ? value : "";
};

export default function StorefrontImage({
  src,
  alt,
  className = "",
  fit = "cover",
  priority = false,
  onClick,
}: StorefrontImageProps) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const clean = usableMediaSrc(src);

  useEffect(() => {
    setReady(false);
    setFailed(false);
  }, [clean]);

  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;
    if (node.complete) {
      if (node.naturalWidth > 0) setReady(true);
      else setFailed(true);
    }
  }, [clean]);

  if (!clean || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center text-sm ${className}`}
        style={{ color: "var(--sf-muted)", background: "var(--sf-bg)" }}
      >
        No image
      </div>
    );
  }

  return (
    <>
      {!ready && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: "var(--sf-bg)" }}
        />
      )}
      <img
        ref={imgRef}
        src={clean}
        alt={alt}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        draggable={false}
        onClick={onClick}
        onLoad={() => setReady(true)}
        onError={() => setFailed(true)}
        className={`relative z-[1] h-full w-full ${
          fit === "contain" ? "object-contain" : "object-cover"
        } ${className}`}
      />
    </>
  );
}
