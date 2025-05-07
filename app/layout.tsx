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
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Product Share India | Create & Share Product Catalogs Effortlessly",
  description:
    "Product Share is India's leading platform for small businesses to create, manage, and share digital product catalogs. Showcase your products online with ease.",
  keywords:
    "Product Share India, online product catalog India, Indian small business solutions, digital catalog tool, product management app India, catalog sharing platform India, business catalog creator, product showcase tool India",
  robots: "index, follow",
  icons: {
    icon: "/icon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Product Share India | Create & Share Product Catalogs Easily",
    description:
      "Empowering Indian small businesses to create and share stunning digital catalogs. Join Product Share today and simplify your product management!",
    url: "https://productshare.in",
    type: "website",
    images: [
      {
        url: "https://productshare.in/icon.ico",
        width: 1200,
        height: 630,
        alt: "Product Share India - Digital Catalog Sharing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Share India | Create & Share Digital Product Catalogs",
    description:
      "Product Share is the ultimate platform for Indian businesses to create and share digital catalogs effortlessly. Perfect for small and medium enterprises!",
    creator: "@Hadi_Razal",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="ADD-YOUR-GSC-CODE-HERE"
        />
        <link rel="canonical" href="https://productshare.in/" />

        {/* Icons */}
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preload Fonts */}
        <link
          rel="preload"
          href="/fonts/GeistVF.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/GeistMonoVF.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />

        {/* Schema.org Structured Data */}
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
                "Product Share is an intuitive platform that empowers Indian small businesses to create and share product catalogs effortlessly. Founded by Hadi Razal.",
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
              location: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressRegion: "Kerala",
                addressLocality: "Kochi",
                postalCode: "682001",
              },
              areaServed: {
                "@type": "Country",
                name: "India",
              },
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
        <script src="https://checkout.razorpay.com/v1/checkout.js" defer />
      </head>
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
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
