import HomePage from "@/components/HomePage";
import { Metadata } from "next";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  return {
    title: "Product Share |  Create and Share Online Product Catalogs Effortlessly",
    description:
      "Discover Product Share, founded by Hadi Razal, the ultimate tool for small business owners to create, share, and manage product catalogs. Simplify your business, boost sales, and reach more customers with ease.",
    keywords:
      "Product Share, Hadi Razal, product catalog, small business app, online catalog creator, product sharing platform, digital catalog, business tools, product showcase, ProductShare app",
    openGraph: {
      title: "Product Share - Create and Share Online Product Catalogs Effortlessly",
      description:
        "Transform how you showcase your products with ProductShare, the platform designed for small business owners. Create professional catalogs and share them effortlessly with your customers.",
      url: "https://productshare.in",
      type: "website",
      images: [
        {
          url: "https://productshare.in/logo.png",
          width: 1200,
          height: 630,
          alt: "Product Share",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Product Share - Create and Share Online Product Catalogs Effortlessly",
      description:
        "Product Share is the go-to platform for small businesses. Easily create, manage, and share product catalogs online. Boost your brand's visibility today!",
      creator: "@Hadi_Razal",
    },
    robots: "index, follow",
    icons: {
      icon: "/https://productshare.in/icon.ico",
      apple: "/https://productshare.in/apple-touch-icon.png",
    },
    alternates: {
      canonical: "https://productshare.in",
      languages: {
        "en-US": "https://productshare.in/en-us",
      },
    },
  };
}

export default async function Page({ params }: any) {
  return <HomePage />;
}
