
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Phone, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center">
                <div className="relative h-8 w-8 md:h-10 md:w-10">
                  <div className="absolute top-0 left-0 h-full w-full rounded-full bg-kidcare-magenta"></div>
                  <div className="absolute bottom-0 left-3 h-5 w-5 md:h-6 md:w-6 rounded-bl-full bg-kidcare-purple"></div>
                </div>
                <span className="ml-3 text-2xl md:text-3xl font-bold bg-gradient-to-r from-kidcare-magenta to-kidcare-purple bg-clip-text text-transparent">
                  KidCare
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {['Home', 'Services', 'About', 'Testimonials', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="group relative font-medium text-gray-700 hover:text-kidcare-magenta transition-colors duration-300"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-kidcare-magenta transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Phone number and CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+1234567890" className="flex items-center text-gray-600 hover:text-kidcare-magenta transition-colors duration-300">
              <Phone size={18} className="mr-2" />
              <span className="font-medium">123-456-7890</span>
            </a>
            <Link to="/sign-in" className="flex items-center text-gray-600 hover:text-kidcare-magenta transition-colors duration-300 mr-2">
              <LogIn size={18} className="mr-1" />
              <span className="font-medium">Sign In</span>
            </Link>
            <Link to="/sign-up" className="btn-primary">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              className="text-gray-700 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white"
        >
          <div className="px-4 py-3 space-y-2 border-b border-gray-200">
            {['Home', 'Services', 'About', 'Testimonials', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-2 px-3 rounded-lg font-medium text-gray-700 hover:text-kidcare-magenta hover:bg-kidcare-light-pink transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="py-3 flex flex-col space-y-3">
              <a href="tel:+1234567890" className="flex items-center text-gray-600 py-2">
                <Phone size={18} className="mr-2" />
                <span className="font-medium">123-456-7890</span>
              </a>
              <Link to="/sign-in" className="flex items-center text-gray-600 py-2">
                <LogIn size={18} className="mr-2" />
                <span className="font-medium">Sign In</span>
              </Link>
              <Link to="/sign-up" className="btn-primary text-center w-full">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
