
import React from 'react';
import { Heart, ChevronRight, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-kidcare-purple text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center mb-4">
          
              <span className="text-2xl font-bold">KidCare</span>
            </div>
            <p className="text-white/80 mb-4">
              Nurturing young minds in a safe, loving environment. At KidCare, we're committed to giving your child the best start in life.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-kidcare-magenta"></span>
            </h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'Programs', 'Contact'].map((item, index) => (
                <li key={index}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-white/80 hover:text-white flex items-center transition-colors duration-300">
                    <ChevronRight size={16} className="mr-1" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Programs */}
          {/* <div>
            <h3 className="text-lg font-bold mb-5 relative inline-block">
              Our Programs
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-kidcare-magenta"></span>
            </h3>
            <ul className="space-y-3">
              {['Infant Care (0-1 years)', 'Toddler Program (1-3 years)', 'Preschool (3-5 years)', 'After School Care', 'Summer Programs'].map((item, index) => (
                <li key={index}>
                  <a href="#services" className="text-white/80 hover:text-white flex items-center transition-colors duration-300">
                    <ChevronRight size={16} className="mr-1" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
          
          {/* Column 4: Working Hours */}
          <div>
            <h3 className="text-lg font-bold mb-5 relative inline-block">
              Working Hours
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-kidcare-magenta"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-white/80">
                <span>Monday - Friday</span>
                <span>2:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between text-white/80">
                <span>Saturday:</span>
                <span>Closed</span>
              </li>
              <li className="flex justify-between text-white/80">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
              <li className="mt-4 pt-4 border-t border-white/10">
                <a href="tel:+251-94716-9355" className="text-white hover:text-kidcare-pink transition-colors duration-300 font-medium">
                  Emergency: (251)-94716-9355
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Subscription Form
        <div className="py-8 border-t border-b border-white/10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Join Our Newsletter</h3>
              <p className="text-white/80">Stay updated with our latest news, tips for parents, and special offers.</p>
            </div>
            <div>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none text-gray-800"
                />
                <button type="submit" className="bg-kidcare-magenta hover:bg-kidcare-magenta/90 transition-colors duration-300 px-6 py-3 rounded-r-lg font-medium">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div> */}
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-white/70">
          <p>© 2025 KidCare. All rights reserved.</p>
          <p className="flex items-center">
            Made for families
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
