"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMail, FiMapPin, FiMessageCircle, FiPhone } from "react-icons/fi";
import { siteConfig } from "@/lib/site";

const marketingLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms" },
  { href: "/pricing-policy", label: "Pricing Policy" },
  { href: "/cancellations-and-refunds", label: "Refunds" },
  { href: "/shipping-policy", label: "Shipping" },
];

const Footer = () => {
  const pathname = usePathname();

  if (
    pathname.startsWith("/store") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password")
  ) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/15 bg-white text-slate-700">
      <div className="mx-auto max-w-[1440px] px-3 py-14 sm:px-5">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.7fr_0.7fr_1fr]">
          <div>
            <Link href="/" className="inline-flex">
              <Image
                alt="Product Share"
                src="/productShareLV-cropped.svg"
                width={124}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
              A digital catalog builder from India, made for local shops,
              restaurants, and WhatsApp sellers. We are just getting started.
            </p>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
              Made in India
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {marketingLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-neutral-600 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              Legal
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-neutral-600 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-3">
                <FiMail className="mt-0.5 h-4 w-4 text-primary" />
                <a href={`mailto:${siteConfig.supportEmail}`} className="hover:text-primary">
                  {siteConfig.supportEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="mt-0.5 h-4 w-4 text-primary" />
                <a href={`tel:${siteConfig.supportPhoneHref}`} className="hover:text-primary">
                  {siteConfig.supportPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiMessageCircle className="mt-0.5 h-4 w-4 text-primary" />
                <a
                  href={`https://wa.me/${siteConfig.supportWhatsAppNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  WhatsApp {siteConfig.supportPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>Kerala, India</span>
              </li>
            </ul>
            <p className="mt-5 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
              {siteConfig.supportHours}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-primary/15 pt-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p>A product of Duoph Technologies, India.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
