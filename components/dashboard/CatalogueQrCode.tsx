"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

export default function CatalogueQrCode({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const download = () => {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "productshare-catalogue-qr.svg";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    toast.success("QR code downloaded");
  };
  return (
    <details className="ps-qr-details">
      <summary>Share with a QR code</summary>
      <div className="ps-qr-content">
        <div ref={ref}><QRCodeSVG value={url} size={148} marginSize={4} level="M" title="Scan to open your ProductShare catalogue" /></div>
        <div><h3>Your catalogue, a scan away</h3><p>Add this QR code to packaging, business cards, or your shop counter.</p><button type="button" className="ds-catalog-btn" onClick={download}><Download size={16} /> Download QR code</button></div>
      </div>
    </details>
  );
}
