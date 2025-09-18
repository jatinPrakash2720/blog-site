import React from "react";
import { Outlet } from "react-router-dom";
import LandingPage from "../../pages/LandingPage";

/**
 * This component acts as the root layout for the public-facing part of the app.
 * It renders the LandingPage as a persistent background and uses React Router's
 * <Outlet> to render any nested child routes (like the auth modals) on top of it.
 */
const RootLayout: React.FC = () => {
  return (
    <div>
      {/* The LandingPage will always be visible as the background layer. */}
      <LandingPage />

      {/* The <Outlet> is a placeholder provided by React Router.
          When you navigate to a nested route like "/auth/login",
          the AuthPage component will be rendered here. */}
      <Outlet />
    </div>
  );
};

export default RootLayout;
