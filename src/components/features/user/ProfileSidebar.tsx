// src/components/features/user/ProfileSidebar.tsx
import type React from "react";
import {
  Home,
  Library as LibraryIcon,
  User,
  BookOpen,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils"; // Assuming you have this utility file
import type { ProfileView } from "@/pages/ProfilePage";

interface SidebarProps {
  activeView: ProfileView;
  setActiveView: (view: ProfileView) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  isDesktop: boolean;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200",
      isActive
        ? "bg-primary/10 text-primary font-semibold"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    )}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{label}</span>
  </button>
);

const ProfileSidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isSidebarOpen,
  setSidebarOpen,
  isDesktop,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (view: ProfileView) => {
    setActiveView(view);
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {!isDesktop && isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-transform duration-300 ease-in-out",
          "w-64 flex flex-col pt-16",
          isDesktop
            ? "translate-x-0"
            : isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
        )}
      >
        <div className="p-4 flex-grow">
          <nav className="flex flex-col space-y-2 mt-8">
            <NavItem
              icon={Home}
              label="Home"
              isActive={false}
              onClick={handleHomeClick}
            />
            <NavItem
              icon={LibraryIcon}
              label="Library"
              isActive={activeView === "library"}
              onClick={() => handleNavigation("library")}
            />
            <NavItem
              icon={User}
              label="Profile"
              isActive={activeView === "profile"}
              onClick={() => handleNavigation("profile")}
            />
            <NavItem
              icon={BookOpen}
              label="Stories"
              isActive={activeView === "stories"}
              onClick={() => handleNavigation("stories")}
            />
            <NavItem
              icon={BarChart2}
              label="Stats"
              isActive={activeView === "stats"}
              onClick={() => handleNavigation("stats")}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-sm font-semibold text-foreground">Following</p>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Discover more writers and publications to follow.
            </p>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium mt-2">
              See suggestions
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
