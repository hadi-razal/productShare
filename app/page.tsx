import HomePage from "@/components/HomePage";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const baseUrl = "https://productshare.in";
  
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Product Share | #1 Catalog Builder for Indian Businesses | Hadi Razal",
      template: "%s | Product Share"
    },
    description: "Revolutionize your business with Product Share - India's most powerful AI-driven catalog creation and sharing platform. Founded by Hadi Razal, empowering small businesses to showcase products professionally.",
    keywords: [
      "Product Share",
      "Hadi Razal",
      "catalog builder india",
      "product catalog software",
      "small business app",
      "online catalog creator",
      "digital product sharing",
      "catalog management",
      "business marketing tool",
      "e-commerce solution"
    ],
    applicationName: "Product Share",
    authors: [{ name: "Hadi Razal", url: baseUrl }],
    generator: "Next.js",
    referrer: "origin",
    
    openGraph: {
      title: "Product Share - Revolutionary Catalog Management Platform",
      description: "Transform your business with AI-powered catalog creation. Easy, professional, and designed for Indian entrepreneurs.",
      url: baseUrl,
      siteName: "Product Share",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Product Share - Catalog Builder for Indian Businesses"
        }
      ]
    },
    
    twitter: {
      card: "summary_large_image",
      title: "Product Share | AI Catalog Builder for Indian Businesses",
      description: "Create stunning product catalogs in minutes. Designed for Indian entrepreneurs by Hadi Razal.",
      creator: "@Hadi_Razal",
      site: "@ProductShare",
      images: [`${baseUrl}/twitter-image.png`]
    },
    
    verification: {
      google: "your-google-site-verification-code",
      yandex: "your-yandex-verification-code",
      other: {
        "facebook-domain-verification": "your-facebook-domain-verification"
      }
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    
    icons: {
      icon: [
        { url: `${baseUrl}/favicon.ico` },
        { url: `${baseUrl}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
        { url: `${baseUrl}/favicon-32x32.png`, sizes: "32x32", type: "image/png" }
      ],
      apple: [
        { url: `${baseUrl}/apple-touch-icon.png` }
      ],
      other: [
        {
          rel: "apple-touch-icon-precomposed",
          url: `${baseUrl}/apple-touch-icon.png`
        }
      ]
    },
    
    alternates: {
      canonical: baseUrl,
      languages: {
        "en-IN": `${baseUrl}/en-in`,
        "en-US": `${baseUrl}/en-us`
      }
    },
    
    category: "Business Productivity Tools",
    
    appleWebApp: {
      title: "Product Share",
      statusBarStyle: "black-translucent"
    }
  };
}

export default async function Page({ params }: any) {
  return <HomePage />;
}