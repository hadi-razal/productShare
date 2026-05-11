// app/layout.tsx or app/root-layout.tsx
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
import { absoluteUrl, defaultOgImage, siteConfig } from "@/lib/site";

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
      "Product Share India - Digital Catalog Builder for Restaurants, Stores, and Small Businesses",
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Create polished digital catalogs, menus, and shareable product pages for your business. Product Share India helps restaurants, retailers, and small businesses publish faster and share anywhere.",
  keywords: [...siteConfig.keywords],
  authors: [{ name: "Duoph Technologies", url: "https://www.duoph.in/" }],
  creator: "Duoph Technologies",
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
    title: siteConfig.name,
    description:
      "Create digital catalogs, menus, and shareable product pages for your business in minutes.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: siteConfig.locale,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} preview image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.name,
    description:
      "Build digital catalogs and menus that look professional and are easy to share.",
    images: [defaultOgImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: siteConfig.category,
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
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Load Razorpay script globally */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: absoluteUrl("/icon.png"),
              description:
                "Digital catalog builder for small businesses, restaurants, and sellers.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: siteConfig.supportPhone,
                email: siteConfig.supportEmail,
                contactType: "customer service",
                availableLanguage: ["English", "Hindi", "Malayalam"],
                areaServed: "IN",
              },
              address: {
                "@type": "PostalAddress",
                addressRegion: "Kerala",
                addressCountry: "IN",
              },
              foundingDate: "2023",
              brand: {
                "@type": "Brand",
                name: siteConfig.name,
              },
              parentOrganization: {
                "@type": "Organization",
                name: "Duoph Technologies",
                url: "https://www.duoph.in/",
              },
              sameAs: [`https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`],
            }),
          }}
        />
        {/* WebSite JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              inLanguage: "en-IN",
            }),
          }}
        />

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
