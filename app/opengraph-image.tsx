import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef2ff 45%, #dbeafe 100%)",
          color: "#0f172a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            fontWeight: 700,
            color: "#4338ca",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: "#6366f1",
            }}
          />
          {siteConfig.shortName}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: "fit-content",
              borderRadius: 9999,
              background: "rgba(99, 102, 241, 0.12)",
              color: "#4338ca",
              padding: "10px 18px",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Digital catalog builder for modern businesses
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 70,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Create catalog pages that are easy to share and built to sell.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#334155",
          }}
        >
          <div style={{ display: "flex" }}>WhatsApp sharing, QR codes, mobile-ready pages</div>
          <div style={{ display: "flex", color: "#4338ca", fontWeight: 700 }}>
            productshare.in
          </div>
        </div>
      </div>
    ),
    size
  );
}
