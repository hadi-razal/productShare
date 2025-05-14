"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const path = usePathname();

  // Show the footer only if the path is one of these specific routes
  if (path !== "/" && path !== "/contact" && path !== "/about-us" && path !== "/terms-and-conditions" && path !== "/privacy-policy") {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Product Share</h3>
            <p className="text-gray-400 text-sm leading-5">
              Empowering businesses to showcase and share their products globally.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@productshare.com" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  productshareindia@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  +91 8589920409
                </a>
              </li>
              <li>
                <span className="text-gray-400 flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  Kerala ,India
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for updates and tips.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="bg-primaryColor hover:bg-primaryColor/90 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Product Share. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/privacy-policy">
                <span className="text-gray-400 hover:text-blue-500 transition-colors">
                  Privacy Policy
                </span>
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms-and-conditions">
                <span className="text-gray-400 hover:text-blue-500 transition-colors">
                  Terms of Service
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;