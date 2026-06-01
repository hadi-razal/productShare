"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

const marketingLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
  { href: "/pricing-policy", label: "Pricing Policy" },
  { href: "/cancellations-and-refunds", label: "Refund Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
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
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1fr]">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">
                Product Share India
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Build catalogs that are easy to share and ready to sell.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Product Share helps businesses publish digital catalogs, menus, and
              product pages without the overhead of a full ecommerce site.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Talk to Support
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {marketingLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Legal
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-indigo-300" />
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="transition hover:text-white"
                >
                  {siteConfig.supportEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-indigo-300" />
                <a
                  href={`tel:${siteConfig.supportPhoneHref}`}
                  className="transition hover:text-white"
                >
                  {siteConfig.supportPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-indigo-300" />
                <span>Kerala, India</span>
              </li>
            </ul>
            <p className="mt-5 text-sm text-slate-500">{siteConfig.supportHours}</p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
