const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto flex flex-col items-center">
        
        {/* SaaS Name */}
        <h2 className="text-2xl font-semibold mb-4">myShop</h2>

        {/* Navigation Links */}
        <div className="flex space-x-6 mb-4">
          <a href="/about" className="text-base hover:text-gray-300">About Us</a>
          <a href="/products" className="text-base hover:text-gray-300">Products</a>
          <a href="/contact" className="text-base hover:text-gray-300">Contact</a>
          <a href="/faq" className="text-base hover:text-gray-300">FAQ</a>
          <a href="/blog" className="text-base hover:text-gray-300">Blog</a>
        </div>

        {/* Policies Links */}
        <div className="flex space-x-6 mb-4">
          <a href="/terms-and-conditions" className="text-base hover:text-gray-300">Terms & Conditions</a>
          <a href="/privacy-policy" className="text-base hover:text-gray-300">Privacy Policy</a>
        </div>

        {/* Contact Information */}
        <div className="text-center mb-4">
          <p>Phone: <a href="tel:919074063723" className="hover:text-gray-300">+919074063723</a></p>
          <p>Email: <a href="mailto:hadhirasal22@gmail.com" className="hover:text-gray-300">dhadhirasal22@gmail.com</a></p>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-6 mb-4">
          <a href="https://github.com/hadi-razal" target="_blank" rel="noopener noreferrer" className="text-base hover:text-gray-300">GitHub</a>
          <a href="https://www.linkedin.com/in/hadi-razal-690b22228/" target="_blank" rel="noopener noreferrer" className="text-base hover:text-gray-300">LinkedIn</a>
          <a href="https://twitter.com/Hadi_Razal" target="_blank" rel="noopener noreferrer" className="text-base hover:text-gray-300">Twitter</a>
          <a href="https://www.instagram.com/hadi_razal/" target="_blank" rel="noopener noreferrer" className="text-base hover:text-gray-300">Instagram</a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} myShop. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
