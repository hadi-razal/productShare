// app/layout.tsx or app/root-layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Product Share India - Free Digital Catalog Builder | Menu Creator for Restaurants, Stores & Dropshippers",
  description:
    "Create stunning digital catalogs and menus instantly with Product Share India. Perfect for restaurants, retail stores, dropshippers, and small businesses. Build professional product catalogs, restaurant menus, and business listings in minutes. Free catalog maker with WhatsApp sharing, QR codes, and mobile-friendly design.",
  keywords:
    [
      "digital catalog builder India",
      "restaurant menu creator",
      "product catalog maker",
      "dropshipping catalog tool",
      "business catalog creator India",
      "free online catalog builder for small business",
      "restaurant digital menu maker India",
      "WhatsApp catalog sharing tool",
      "QR code menu generator",
      "mobile catalog builder",
      "catalog maker Mumbai Delhi Bangalore",
      "Indian restaurant menu app",
      "small business tools India",
      "dropshipper product showcase",
      "retail store catalog online",
      "food menu digital creator",
      "business listing maker",
      "product showcase platform India",
      "catalog with price list",
      "shareable product catalog",
      "professional menu design",
      "inventory management tool",
      "customer ordering system",
    ].join(", "),
  authors: [{ name: "Duoph Technologies", url: "https://www.duoph.in/" }],
  creator: "Duoph Technologies",
  publisher: "Product Share India",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [
      { url: "/apple-icon-114x114.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title:
      "Product Share India - Digital Catalog Builder for Restaurants & Stores",
    description:
      "Create professional digital catalogs and restaurant menus instantly. Perfect for Indian businesses, dropshippers, and food establishments. Free catalog maker with WhatsApp integration and QR code sharing.",
    url: "https://productshare.in",
    siteName: "Product Share India",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://productshare.in/favicon-32x32.png",
        width: 1200,
        height: 630,
        alt: "Product Share India - Digital Catalog Builder for Restaurants and Stores",
        type: "image/jpeg",
      },
      {
        url: "https://productshare.in/favicon-32x32.png",
        width: 800,
        height: 600,
        alt: "Product Share India Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Hadi_Razal",
    creator: "@Hadi_Razal",
    title: "Product Share India - Free Digital Catalog & Menu Builder",
    description:
      "Build stunning catalogs and restaurant menus in minutes. Perfect for Indian businesses, dropshippers, and food establishments. Start creating your digital catalog today!",
    images: ["https://productshare.in/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://productshare.in",
    languages: {
      "en-IN": "https://productshare.in",
      "hi-IN": "https://productshare.in/hi",
    },
  },
  category: "Business Tools",
  classification: "Digital Catalog Builder",
  other: {
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" dir="ltr">
      <head />
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
        >
          Skip to main content
        </a>
        <Header />
        <Toaster />
        <ProgressBar />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
      </body>  
    </html>
  );
}
