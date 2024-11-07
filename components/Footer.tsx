"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const path = usePathname();

  // Show the footer only if the path is one of these specific routes
  if (path !== "/" && path !== "/contact" && path !== "/about-us" && path !== "/terms-and-conditions") {
    return null;
  }

  return (
    <footer className="py-16 bg-gray-950 pb-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} Product Share. All rights reserved.
        </p>
        <Link href="/privacy-policy">
          <span className="text-gray-500 hover:text-slate-700">Privacy Policy</span>
        </Link>
        <span className="mx-2">|</span>
        <Link href="/terms-and-conditions">
          <span className="text-gray-500 hover:text-slate-700">Terms of Service</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
