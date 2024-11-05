'use client';

import { useEffect, useState } from "react";
import { Menu, X, Share2, ChevronDown } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { getUserId } from "@/helpers/getUserId";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ href, children, onClick }: NavLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="group relative inline-flex items-center gap-1 px-4 py-2 text-gray-100 transition-all duration-300 hover:text-white"
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-purple-200 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
  </Link>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [storeName, setStoreName] = useState<string | null>(null);
  const router = useRouter();
  const path = usePathname();
  const { storeId } = useParams();

  const fetchStoreName = async () => {
    if (!storeId || !path.startsWith("/store/")) return;
    try {
      const userId = await getUserId(storeId as string);
      const userRef = doc(db, "users", userId as string);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setStoreName(userDoc.data().name);
      }
    } catch (error) {
      console.error("Error fetching store name:", error);
    }
  };

  useEffect(() => {
    fetchStoreName();
  }, [storeId, path]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUser(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
      setIsOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header 
      className={`sticky w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg backdrop-blur-lg bg-opacity-90" 
          : "bg-gradient-to-r from-indigo-800 to-purple-800"
      } ${isOpen ? "h-screen md:h-24" : "h-24"}`}
    >
      <nav className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-24">
          {/* Logo Section */}
          <Link
            href={isUser ? "/store" : ""}
            onClick={(e) => !isUser && e.preventDefault()}
            className="group flex items-center space-x-3 text-white"
          >
            <div className="relative">
              <Share2 className="h-8 w-8 transform transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute -inset-1 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                {isUser ? "Product Share" : storeName || "Product Share"}
              </span>
              {isUser && (
                <span className="text-xs text-purple-200">
                  Your customers see this as your store name
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center  space-x-8">
            {!isUser ? (
              <>
                <NavLink href="/pricing">Buy Premium</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/contact">Contact</NavLink>
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-indigo-800 shadow-lg shadow-purple-500/25"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-indigo-800 shadow-lg shadow-red-500/25"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative p-2 text-gray-100 hover:text-white focus:outline-none z-50 transition-transform duration-300 hover:scale-110"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-0 top-20 bg-gradient-to-b from-indigo-900 to-purple-900 transition-all duration-500 ease-in-out ${
            isOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 -translate-y-10 pointer-events-none"
          }`}
        >
          <div className="p-6 space-y-6">
            {!isUser && (
              <div className="flex flex-col space-y-6">
                <NavLink href="/pricing" onClick={() => setIsOpen(false)}>
                  Buy Premium
                </NavLink>
                <NavLink href="/about" onClick={() => setIsOpen(false)}>
                  About
                </NavLink>
                <NavLink href="/contact" onClick={() => setIsOpen(false)}>
                  Contact
                </NavLink>
              </div>
            )}
            {!isUser ? (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;