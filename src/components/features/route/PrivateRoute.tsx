import React, {type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../store/auth"; // Corrected path
import Loader from "@/components/ui/Loader"; // Corrected path

/**
 * A component that renders its children only if the user is authenticated.
 * While checking for authentication, it shows a loading indicator.
 * If the user is not authenticated, it redirects them to the login page.
 */
const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAuthReady } = useAuth();

  // Show a loading spinner while the authentication state is being determined.
  // This prevents a "flash" of the login page for already authenticated users.
  if (!isAuthReady) {
    return <Loader />;
  }

  // If authentication is ready and the user is not authenticated, redirect to login.
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // If the user is authenticated, render the protected component.
  return <>{children}</>;
};

export default PrivateRoute;
