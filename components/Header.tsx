"use client";

import { useEffect, useState } from "react";
import { Menu, X, Share2 } from "lucide-react";
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
    className="group relative block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
  </Link>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [storeName, setStoreName] = useState<string | null>(null);
  const router = useRouter();
  const path = usePathname();
  const { storeId } = useParams();

  const fetchStoreName = async () => {
    if (!storeId || !path.startsWith("/store/")) {
      console.log("No valid store ID or path.");
      return;
    }
    try {
      const userId = await getUserId(storeId as string);
      const userRef = doc(db, "users", userId as string);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setStoreName(userDoc.data().name);
      } else {
        console.log("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching store name:", error);
    }
  };

  useEffect(() => {
    fetchStoreName();
  }, [storeId, path]);

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
    <header className={`sticky bg-indigo-700 w-full top-0 z-50 ${isOpen ? "h-screen md:h-[80px]" : "h-[80px]"}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[80px] relative">
        <div className="flex items-center justify-between h-full">
          <Link
            href={isUser ? "/store" : ""}
            onClick={(e) => !isUser && e.preventDefault()}
            className="flex items-center space-x-3 text-white hover:opacity-90 transition-opacity"
          >
            <Share2 className="h-7 w-7" />
            <span className="text-2xl font-bold tracking-tight">
              {isUser ? (
                <span className="flex flex-col items-start justify-center">
                  Product Share
                  <span className="text-xs text-gray-200">Your customers can see this as your store name </span>
                </span>
              ) : (
                <span>{storeName}</span>
              )}
              {!isUser && !storeId && (
                <span> 
                  Product Share                 
                </span>
              )}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {!isUser ? (
              <>
                <NavLink href="/pricing">Buy Premium</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/contact">Contact</NavLink>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-md bg-white text-gray-900 hover:bg-gray-200 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          className={`md:hidden absolute inset-x-0 top-[80px] bg-indigo-700 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}`}
        >
          <div className="p-4 space-y-4">
            {!isUser && (
              <div className="flex flex-col space-y-4">
                <NavLink href="/pricing" onClick={() => setIsOpen(false)}>Pricing</NavLink>
                <NavLink href="/about" onClick={() => setIsOpen(false)}>About</NavLink>
                <NavLink href="/contact" onClick={() => setIsOpen(false)}>Contact</NavLink>
              </div>
            )}
            {!isUser ? (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-5 py-3 rounded-md bg-white text-gray-900 hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-5 py-3 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 font-medium"
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
