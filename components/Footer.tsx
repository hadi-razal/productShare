import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-16 bg-gray-950 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} Product Share. All rights reserved.
          </p>
          <Link href="/privacy-policy" className="text-gray-500 hover:text-slate-700">Privacy Policy</Link>
          <span className="mx-2">|</span>
          <Link href="/terms-and-conditions" className="text-gray-500 hover:text-slate-700">Terms of Service</Link>
        </div>
      </footer>
  );
};

export default Footer;
