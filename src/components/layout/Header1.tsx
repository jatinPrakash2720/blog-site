"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";
import ThemeToggle from "@/components/common/wrappers/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/wrappers/DropdownMenu";
import { Edit2, Bell, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const Header1 = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = () => {
    navigate("/auth/login");
  };

  const handleGetStarted = () => {
    navigate("/auth/register");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const showWriteButton = location.pathname === "/home";
  const writeUrl = "/editor";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-black/10 dark:border-white/10 bg-background/50 backdrop-blur-lg"
          : "border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              to={isAuthenticated ? "/home" : "/"}
              className="flex items-center cursor-pointer"
            >
              <span className="text-2xl font-bold text-black dark:text-white">
                BlogLikho
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center shrink-0 gap-2">
            <ThemeToggle className="hover:bg-transparent text-sm md:text-md lg:text-lg font-semibold hover:text-black dark:hover:text-white" />

            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                {showWriteButton && (
                  <Link to={writeUrl} className="hidden lg:block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm md:text-md lg:text-lg font-semibold text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      <span className="hidden md:inline">Write</span>
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent">
                      <Avatar>
                        <AvatarImage
                          src={currentUser.avatar}
                          alt={currentUser.fullName}
                        />
                        <AvatarFallback>
                          {getInitials(currentUser.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={cn(
                      "w-56 backdrop-blur-lg border border-black/10 dark:border-white/10",
                      isScrolled
                        ? "bg-background/80 dark:bg-background/80"
                        : "bg-background/50 dark:bg-background/50"
                    )}
                  >
                    <DropdownMenuLabel>
                      <p className="font-bold text-black dark:text-white">
                        {currentUser.fullName}
                      </p>
                      <p className="text-xs text-black/60 dark:text-white/60">
                        @{currentUser.username}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                    <DropdownMenuItem
                      className="cursor-pointer text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10"
                      asChild
                    >
                      <Link to="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 focus:bg-black/10 dark:focus:bg-white/10"
                      asChild
                    >
                      <Link
                        to="/profile/settings"
                        className="flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black/10 dark:bg-white/10" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 focus:bg-red-50 dark:focus:bg-red-950/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
