"use client"

import { useEffect, useState } from "react";
import { Menu, X, Share2 } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/fireabase";
import Link from "next/link";

// Define the props interface for NavLink
interface NavLinkProps {
  href: string;
  children: React.ReactNode; // This allows for any valid React node as children
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUser(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      setIsUser(false);
      toggleMenu();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Use the defined interface for the NavLink component
  const NavLink = ({ href, children }: NavLinkProps) => (
    <Link
      href={href}
      className="relative px-3 py-2 text-gray-700 hover:text-gray-950 transition-colors duration-200
        after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 
        after:bottom-0 after:left-0 after:bg-gray-950 after:transition-transform 
        after:duration-300 hover:after:scale-x-100"
    >
      {children}
    </Link>
  );

  return (
    <header className={`fixed bg-gray-300 flex items-center w-full top-0 h-[80px] z-50 transition-all duration-300`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={'/'} className="flex-shrink-0 flex items-center space-x-2">
            <Share2 className="h-6 w-6 text-gray-950" />
            <span className="text-3xl font-bold">ProductShare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isUser && (
              <>
                <NavLink href="/pricing">Pricing</NavLink>
                <NavLink href="/about">About Us</NavLink>
                <NavLink href="/contact">Contact Us</NavLink>
              </>
            )}
            {!isUser ? (
              <Link
                href="/login"
                className="ml-4 px-4 py-2 rounded-full bg-gray-950 text-white hover:bg-blue-700 
                  transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 
                  transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
            {!isUser && (
              <>
                <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-900 transition-colors duration-200">Pricing</Link>
                <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-900 transition-colors duration-200">About Us</Link>
                <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-950 hover:bg-gray-900 transition-colors duration-200">Contact Us</Link>
              </>
            )}
            {!isUser ? (
              <Link href="/login" className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gray-950 hover:bg-blue-700 transition-colors duration-200">Login</Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
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
