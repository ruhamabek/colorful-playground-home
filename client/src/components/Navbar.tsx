import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Phone, LogIn, User, Bell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    authClient.signOut();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/86ba6735-e1a9-4ab5-af57-4a7bc2a80931.png"
                alt="KidCare Logo"
                className="h-10 w-28"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {["Home", "Services", "About", "Testimonials", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="group relative font-medium text-gray-700 hover:text-kidcare-magenta transition-colors duration-300"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-kidcare-magenta transition-all duration-300 group-hover:w-full"></span>
                </a>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                {session.user.role === "parent" && (
                  <Link
                    to="/dashboard"
                    className="font-medium text-gray-600 hover:text-kidcare-magenta transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image} />
                        <AvatarFallback className="bg-kidcare-magenta/10 text-kidcare-magenta">
                          {session.user.name?.[0] ||
                            session.user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <a
                  href="tel:+251-947-9355"
                  className="flex items-center text-gray-600 hover:text-kidcare-magenta transition-colors duration-300"
                >
                  <Phone size={18} className="mr-2" />
                  <span className="font-medium">251-947-9355</span>
                </a>
                <Link
                  to="/sign-in"
                  className="flex items-center text-gray-600 hover:text-kidcare-magenta transition-colors duration-300 mr-2"
                >
                  <LogIn size={18} className="mr-1" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link to="/sign-up" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
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
            {["Home", "Services", "About", "Testimonials", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block py-2 px-3 rounded-lg font-medium text-gray-700 hover:text-kidcare-magenta hover:bg-kidcare-light-pink transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              )
            )}

            {session ? (
              <div className="py-3 flex flex-col space-y-3">
                {session.user.role === "parent" && (
                  <Link
                    to="/dashboard"
                    className="block py-2 px-3 rounded-lg font-medium text-gray-700 hover:text-kidcare-magenta hover:bg-kidcare-light-pink transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block py-2 px-3 rounded-lg font-medium text-gray-700 hover:text-kidcare-magenta hover:bg-kidcare-light-pink transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-primary text-center w-full"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="py-3 flex flex-col space-y-3">
                <a
                  href="tel:+251-947-9355"
                  className="flex items-center text-gray-600 py-2"
                >
                  <Phone size={18} className="mr-2" />
                  <span className="font-medium">251-947-9355</span>
                </a>
                <Link
                  to="/sign-in"
                  className="flex items-center text-gray-600 py-2"
                >
                  <LogIn size={18} className="mr-2" />
                  <span className="font-medium">Sign In</span>
                </Link>
                <Link to="/sign-up" className="btn-primary text-center w-full">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
