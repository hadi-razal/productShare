import HomePage from '@/components/HomePage';
import { Metadata } from 'next';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  return {
    title: "ProductShare by Hadi Razal | Showcase Your Products",
    description:
      "ProductShare, founded by Hadi Razal, empowers small business owners to easily create and share product catalogs with their customers.",
    keywords: "ProductShare, Hadi Razal, product catalog, small business, online catalog, product sharing",
    openGraph: {
      title: "ProductShare by Hadi Razal - Showcase Your Products",
      description:
        "Empowering small business owners to create and share product catalogs effortlessly. Boost your brand with a simple, shareable link.",
      url: "https://productshare.in",
      type: "website",
      images: [
        {
          url: "https://productshare.in/logo.png",
          width: 800,
          height: 600,
          alt: "ProductShare - Showcase Your Products",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ProductShare by Hadi Razal - Showcase Your Products",
      description: "Effortlessly create, share, and manage your product catalog online with ProductShare.",
      creator: "@Hadi_Razal",
    },
    robots: "index, follow",
    icons: {
      icon: "/public/icon.ico",
    },
  };
}

export default async function Page({ params }: any) {
  return <HomePage />;
}
