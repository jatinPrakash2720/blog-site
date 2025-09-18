import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/wrappers/ThemeToggle";
import { X } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * This component acts as the main layout for the authenticated part of the app.
 * It renders the primary page content (passed as `children`) and provides an
 * <Outlet> for nested routes, such as the blog editor drawer, to appear on top.
 */
 
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/home");
  };
  return (
    <div>
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
