import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Product Share India",
  description:
    "Get in touch with Product Share India. Reach our support team for questions, feedback, or business inquiries. Available Monday–Friday, 9am–5pm IST. Email: productshareindia@gmail.com | Phone: +91 8589920409.",
  keywords: [
    "contact Product Share India",
    "Product Share support",
    "catalog builder support India",
    "Duoph Technologies contact",
    "small business catalog help",
  ],
  alternates: {
    canonical: "https://productshare.in/contact",
  },
  openGraph: {
    title: "Contact Product Share India",
    description:
      "Have a question or feedback? Reach the Product Share India team — we're here to help your business succeed.",
    url: "https://productshare.in/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Product Share India",
    description:
      "Reach out to Product Share India for support, inquiries, or feedback. Available Mon–Fri, 9am–5pm IST.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
