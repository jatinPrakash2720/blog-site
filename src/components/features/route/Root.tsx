"use client";

import { useAuth } from "../../../store/auth";
import LandingPage from "../../../pages/LandingPage";
import HomePage from "../../../pages/HomePage";
import Loader from "@/components/ui/Loader";
import type React from "react";

/**
 * This component acts as a gatekeeper for the root URL ('/').
 * It checks if the user is authenticated and renders the appropriate page.
 * - For authenticated users, it shows the main application homepage (the blog feed).
 * - For logged-out users, it shows the public landing page.
 */
const Root: React.FC = () => {
  const { isAuthenticated, isAuthReady } = useAuth();

  // While the auth state is being determined, show a full-page loader
  // to prevent a "flash" of the wrong content.
  if (!isAuthReady) {
    return <Loader />;
  }

  // Once auth state is ready, render the correct page.
  return isAuthenticated ? <HomePage /> : <LandingPage />;
};

export default Root;
