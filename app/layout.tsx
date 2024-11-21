import type { Metadata } from "next";
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
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Product Share | Create and Share Online Product Catalogs Effortlessly",
  description:
    "Product Share by Hadi Razal is the ultimate tool for small businesses. Easily create, manage, and share online product catalogs with your customers.",
  keywords:
    "Product Share, online product catalog, small business solutions, product sharing tool, digital catalog creator, business catalog app, product management software, Hadi Razal, catalog sharing platform",
  openGraph: {
    title: "Product Share - The Best Catalog Sharing Platform for Small Businesses",
    description:
      "Product Share makes it simple for small business owners to showcase and share their products online. Start creating catalogs today!",
    url: "https://productshare.in",
    type: "website",
    images: [
      {
        url: "https://productshare.in/icon.ico",
        width: 1200,
        height: 630,
        alt: "ProductShare - The Best Catalog Sharing Platform for Small Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Share | Create and Share Online Product Catalogs Effortlessly",
    description:
      "Simplify your business with Product Share. Create stunning online catalogs and share them easily with customers. Perfect for small business owners!",
    creator: "@Hadi_Razal",
  },
  robots: "index, follow",
  icons: {
    icon: "https://productshare.in/icon.ico",
    shortcut: "https://productshare.in/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicons */}
        <link rel="icon" href="/icon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Product Share",
              url: "https://productshare.in",
              logo: "https://productshare.in/logo.png",
              description:
                "Product Share is an intuitive platform that empowers small businesses to create and share product catalogs. Founded by Hadi Razal.",
              founder: {
                "@type": "Person",
                name: "Hadi Razal",
                jobTitle: "Founder & CEO",
                url: "https://www.hadirazal.com/",
                sameAs: [
                  "https://github.com/hadi-razal",
                  "https://twitter.com/Hadi_Razal",
                  "https://www.instagram.com/hadi_razal/",
                  "https://www.linkedin.com/in/hadi-razal-690b22228/",
                ],
              },
              operatingSystem: "Web",
              applicationCategory: "BusinessApplication",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "321",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "hadhirasal22@gmail.com",
                telephone: "+91-9074063723",
                contactType: "Customer Support",
              },
            }),
          }}
        />

        {/* Razorpay Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Toaster />
        <ProgressBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
