"use client";

import { SignInPage } from "@/components/features/auth/SignIn";
import { ForgotPassword } from "@/components/features/auth/ForgotPassword";
import { OTPVerificationPage as OTPVerificationFeature } from "@/components/features/auth/OTPVerification";
import { RestorePassword } from "@/components/features/auth/RestorePassword";
import AuthLayout from "@/components/layout/AuthLayout";
import { SignUpPage } from "@/components/features/auth/SignUp";

export type AuthMode =
  | "login"
  | "register"
  | "forgot-password"
  | "verify-otp"
  | "restore-password";

interface AuthPageProps {
  mode: AuthMode;
}

const AuthPage = ({ mode }: AuthPageProps) => {
  const renderAuthComponent = () => {
    switch (mode) {
      case "login":
        return (
          <SignInPage
          />
        );
      case "register":
        return (
          <SignUpPage
          />
        );

      case "forgot-password":
        return (
          <ForgotPassword
          />
        );

      case "verify-otp":
        return (
          <OTPVerificationFeature
          />
        );

      case "restore-password":
        return (
          <RestorePassword
          />
        );

      default:
        return null;
    }
  };

  return <AuthLayout authMode={mode}>{renderAuthComponent()}</AuthLayout>;
};

export default AuthPage;
