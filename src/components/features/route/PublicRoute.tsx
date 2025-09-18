import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import Loader from "@/components/ui/Loader";

/**
 * A component that renders its children only if the user is NOT authenticated.
 * If the user is already logged in, it redirects them to the main app homepage ('/home').
 */
const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAuthReady } = useAuth();

  // While the authentication state is being determined, show a full-page loader
  // to prevent any content flashes.
  if (!isAuthReady) {
    return <Loader />;
  }

  // If the user is authenticated, redirect them away from this public page.
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // If the user is not authenticated, render the requested public page (e.g., Login).
  return <>{children}</>;
};

export default PublicRoute;
