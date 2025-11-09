"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Edit2, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Define navigation items
  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/home",
    },
    {
      id: "explore",
      label: "Explore",
      icon: Compass,
      path: "/home?filter=explore",
    },
    {
      id: "write",
      label: "Write",
      icon: Edit2,
      path: "/editor",
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      path: "/home",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const handleNavigate = (path: string) => {
    if (path.includes("?filter=")) {
      const [basePath, filter] = path.split("?filter=");
      navigate(basePath, { state: { filter } });
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => {
    if (
      path === "/home" &&
      !location.pathname.includes("/editor") &&
      !location.pathname.includes("/profile")
    ) {
      // Check if we're on home without a filter (for-you is default)
      const filter = (location.state as { filter?: string })?.filter;
      return !filter || filter === "for-you";
    }
    if (path === "/editor") {
      return location.pathname === "/editor";
    }
    if (path === "/profile") {
      return location.pathname === "/profile";
    }
    // For filter-based paths, check if we're on home with that filter
    if (path.includes("?filter=")) {
      const filter = (location.state as { filter?: string })?.filter;
      const pathFilter = path.split("?filter=")[1];
      return location.pathname === "/home" && filter === pathFilter;
    }
    return false;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 dark:bg-background/95 backdrop-blur-lg border-t border-border shadow-lg">
      <div className="flex items-center justify-around px-2 py-2 max-w-screen-sm mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 relative",
                "min-w-[60px]",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={item.label}
            >
              {/* Active indicator - pill shaped background */}
              {active && (
                <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl" />
              )}

              {/* Icon or Avatar for Profile */}
              <div className="relative z-10">
                {item.id === "profile" && currentUser ? (
                  <Avatar className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    active && "scale-110 ring-2 ring-primary ring-offset-2"
                  )}>
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.fullName || "Profile"}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(currentUser.fullName || currentUser.username || "U")}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      active && "scale-110"
                    )}
                  />
                )}
              </div>

              {/* Label - always show, but emphasize active */}
              <span
                className={cn(
                  "text-xs font-medium relative z-10 transition-all duration-200",
                  active ? "opacity-100" : "opacity-70"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavBar;
