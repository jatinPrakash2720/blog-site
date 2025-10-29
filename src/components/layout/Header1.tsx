"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import ThemeToggle from "@/components/common/wrappers/ThemeToggle";
import { Button } from "@/components/ui/button";

const Header1 = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = () => {
    navigate("/auth/login");
  };

  const handleGetStarted = () => {
    navigate("/auth/register");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50  transition-all duration-300 ${
        isScrolled
          ? "border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-lg"
          : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a
              href="#home"
              className="flex items-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("home");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-2xl font-bold text-black dark:text-white">
                BlogLikho
              </span>
            </a>
          </div>

          {/* Navigation - Absolutely Centered */}

          {/* Right side */}
          <div className="flex items-center shrink-0">
            <ThemeToggle className="hover:bg-transparent text-sm md:text-md lg:text-lg font-semibold hover:text-black dark:hover:text-white" />

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/home">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-black/30 dark:border-white/30 text-sm md:text-md lg:text-lg font-semibold text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-sm md:text-md lg:text-lg font-semibold text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center md:space-x-4">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleSignIn}
                  className="text-black/80 text-sm md:text-md lg:text-lg font-semibold hover:bg-transparent dark:text-white/80 hover:text-black dark:hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="hidden md:inline-flex bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black hover:text-white px-8 py-3 text-lg font-medium rounded-full"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header1;
