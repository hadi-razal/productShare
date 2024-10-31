import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";

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
  title: "ProductShare by Hadi Razal | Showcase Your Products",
  description: "Founded by Hadi Razal, ProductShare helps small business owners create and share product catalogs easily with customers.",
  keywords: "ProductShare, Hadi Razal, product catalog, small business app, product sharing, online catalog, Hadi Razal CEO",
  openGraph: {
    title: "ProductShare by Hadi Razal - Showcase Your Products",
    description: "Founded by Hadi Razal, ProductShare is designed for small businesses to easily share product catalogs.",
    url: "https://yourwebsite.com",  // Replace with your actual URL
    type: "website",
    images: [
      {
        url: "https://yourwebsite.com/image.jpg",  // Replace with an actual image URL
        width: 800,
        height: 600,
        alt: "ProductShare - Showcase Your Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProductShare by Hadi Razal - Showcase Your Products",
    description: "ProductShare, founded by Hadi Razal, allows easy catalog sharing for small business owners.",
    creator: "@Hadi_Razal",
  },
  robots: "index, follow",
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ProductShare",
              url: "https://yourwebsite.com",  // Replace with your actual URL
              logo: "https://yourwebsite.com/logo.jpg",  // Replace with your actual logo URL
              description:
                "ProductShare helps small businesses easily create and share product catalogs. Founded by Hadi Razal, the app brings simple catalog management to small businesses.",
              founder: {
                "@type": "Person",
                name: "Hadi Razal",
                jobTitle: "Founder & CEO",
                url: "https://www.hadirazal.com/",
                sameAs: [
                  "https://github.com/hadi-razal",
                  "https://twitter.com/Hadi_Razal",
                  "https://www.instagram.com/hadi_razal/",
                  "https://www.linkedin.com/in/hadi-razal-690b22228/"
                ]
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "hadhirasal22@gmail.com",
                telephone: "+919074063723",
                contactType: "Customer Support",
              },
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "321",
              },
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}

