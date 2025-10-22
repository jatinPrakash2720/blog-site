import React from "react";
import { Outlet } from "react-router-dom";

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
    <div className="min-h-screen bg-white dark:bg-black">
      {/* The main page content (e.g., HomePage) is rendered here. */}
      {children}

      {/* The <Outlet> is a placeholder. When you navigate to a nested
          route like "/home/write", the EditorPage will be rendered here,
          ON TOP of the HomePage, creating the modal effect. */}
      
      <Outlet />
    </div>
  );
};

export default MainLayout;
