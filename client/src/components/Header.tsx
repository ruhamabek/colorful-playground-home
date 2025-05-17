import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  Search,
  MessageCircle,
  LogOut,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import Payments from "@/api/connectionApi";
import useProfile from "@/api/ProfileApi";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    image: "",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const { CountrequestMutation } = Payments();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch notification count
  useEffect(() => {
    if (session) {
      const fetchNotificationCount = async () => {
        try {
          const response = await CountrequestMutation.mutateAsync();
          console.log("this is response", response);

          setNotificationCount(response?.count || 0);
        } catch (error) {
          console.error("Failed to fetch notification count:", error);
        }
      };

      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [session]);
  useEffect(() => {
    if (profile) {
      setFormData({
        image: profile.image || "",
      });
    }
  }, [profile]);
  const handleLogout = () => {
    authClient.signOut();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "profile", path: "/profile" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-8",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and brand */}
        <Link
          to="/"
          className="flex items-center space-x-2"
          aria-label="Go to homepage"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="text-xl font-medium tracking-tight hidden sm:inline-block">
            kidcare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {/* <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => navigate("/browse")}
          >
            <Search className="h-5 w-5" />
          </Button> */}

          {session ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative"
                onClick={() => navigate("/connections")}
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </Button>

              {/* <Button variant="ghost" size="icon" aria-label="Messages">
                <MessageCircle className="h-5 w-5" />
              </Button> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || formData?.image}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {formData?.image?.[0] ||
                          session.user.name?.[0] ||
                          session.user?.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/connections")}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Connections</span>
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
              <Link to="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-md animate-fade-in">
          <div className="p-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-4 py-3 rounded-md text-base font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-primary bg-primary/5"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-border">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={session.user.image} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session.user?.name?.[0] ||
                          session.user?.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {`${session.user?.name} ` || session.user?.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        View profile
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/connections"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                  >
                    Messages
                  </Link>
                  <Link
                    to="/connections"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center"
                  >
                    Notifications
                    {notificationCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link to="/sign-in">Sign In</Link>
                  </Button>
                  <div className="w-4"></div>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
