import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "../ui/sonner";
import ProfileSetupBanner from "../features/user/ProfileSetupBanner";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * This component acts as the main layout for the authenticated part of the app.
 * It renders the primary page content (passed as `children`) and provides an
 * <Outlet> for nested routes, such as the blog editor drawer, to appear on top.
 */

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Profile Setup Banner - shows when user hasn't set avatar or cover image */}
      <ProfileSetupBanner />
      
      {/* The main page content (e.g., HomePage) is rendered here. */}
      {children}
      <Toaster />

      {/* The <Outlet> is a placeholder. When you navigate to a nested
          route like "/home/write", the EditorPage will be rendered here,
          ON TOP of the HomePage, creating the modal effect. */}

      <Outlet />
    </div>
  );
};

export default MainLayout;
