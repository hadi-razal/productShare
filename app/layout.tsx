import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
// @ts-ignore: global CSS imports are handled by Next.js
import "./globals.css";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Script from "next/script";
import { headers } from "next/headers";
import { defaultOgImage, siteConfig } from "@/lib/site";
import { storefrontRequestContext } from "@/lib/storefront-url";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "@/components/JsonLd";
import {
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/json-ld";

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
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "Product Share — Digital Catalog & Catalogue Builder for Shops, Restaurants & WhatsApp Sellers",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [
    { name: siteConfig.parentOrganization.name, url: siteConfig.parentOrganization.url },
    { name: siteConfig.name, url: siteConfig.url },
  ],
  creator: siteConfig.parentOrganization.name,
  publisher: siteConfig.name,
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
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: siteConfig.locale,
    alternateLocale: [...siteConfig.alternateLocales],
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} digital catalog preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `${siteConfig.name} — Digital Catalog Builder`,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      "x-default": siteConfig.url,
      en: siteConfig.url,
    },
    types: {
      "text/plain": "/llms.txt",
    },
  },
  category: siteConfig.category,
  classification: siteConfig.classification,
  verification: {
    google: "7UEcbn5_qF1bDyC5u5OG7oJtXv7R_cx6AB7CGVMByXE",
  },
  other: {
    "msapplication-TileColor": "#2563eb",
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username: storefrontUsername } = storefrontRequestContext(await headers());
  const isStorefront = Boolean(storefrontUsername);

  return (
    <html lang={siteConfig.language} dir="ltr">
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LRPNWNH0W1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LRPNWNH0W1');
          `}
        </Script>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={softwareApplicationJsonLd()} />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
        >
          Skip to main content
        </a>
        {!isStorefront && <Header />}
        <Toaster />
        <ProgressBar />
        <main id="main-content" role="main">
          {children}
        </main>
        {!isStorefront && <Footer />}
        <Analytics />
      </body>
    </html>
  );
}
