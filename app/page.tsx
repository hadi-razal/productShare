import HomePage from '@/components/HomePage';
import { Metadata } from 'next';

// Generate metadata for the page
export async function generateMetadata({ params }: any): Promise<Metadata> {
  return {
    title: "Simplify Your Sales with Product Share | Your Online Catalog Solution",
    description:
      "Effortlessly create, share, and manage your product catalog online. Reach more customers and boost your brand with Product Share - the easiest way to showcase and sell products.",
    openGraph: {
      title: "Simplify Your Sales with Product Share",
      description:
        "Easily create, share, and manage your online product catalog. Reach more customers and boost your brand presence with a simple, shareable link.",
      url: "https://yourwebsite.com",  // Replace with the actual URL of your site
      // images: [
      //   {
      //     url: "https://yourwebsite.com/hero-image.jpg", // Replace with the actual image URL
      //     width: 1200,
      //     height: 630,
      //     alt: "Product Share - Online Catalog Solution",
      //   },
      // ],
      // site_name: "Product Share",
    },
    twitter: {
      card: "summary_large_image",
      title: "Simplify Your Sales with Product Share",
      description:
        "Effortlessly create, share, and manage your product catalog online. Reach more customers and boost your brand with Product Share.",
      // image: "https://yourwebsite.com/hero-image.jpg", // Replace with the actual image URL
    },
  };
}

// Server component that renders the page
export default async function Page({ params }: any) {
  return <HomePage />;
}
