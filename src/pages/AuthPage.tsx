"use client";

import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { SignInPage } from "@/components/features/auth/SignIn";
import { SignUpPage } from "@/components/features/auth/SignUp";
import { ProfileSetup } from "@/components/features/auth/ProfileSetup";
import { ForgotPassword } from "@/components/features/auth/ForgotPassword";
import { OTPVerificationPage as OTPVerificationFeature } from "@/components/features/auth/OTPVerification";
import { RestorePassword } from "@/components/features/auth/RestorePassword";
import { useAuth } from "@/store/auth";
import AuthLayout from "@/components/layout/AuthLayout";
import type { RegisterData } from "@/types/api";
import { signUpUser } from "@/services/user.service";
import { SignUpPage1 } from "@/components/features/auth/SignUp1";

export type AuthMode =
  | "login"
  | "signup"
  | "register"
  | "profile-setup"
  | "forgot-password"
  | "verify-otp"
  | "restore-password";

interface AuthPageProps {
  mode: AuthMode;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams<{ token: string }>();
  const {
    login,
    register,
    completeProfileSetup,
    forgotPassword,
    restorePassword,
    clearAuthError,
  } = useAuth();

  // Sample testimonials for register page

  // Login handlers
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      await login({ email, password });
    }
  };

  const handleSignUp1 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const response = await signUpUser({ username, email, password });
    if (response.data.success) {
      navigate("/auth/verify-otp", {
        state: { email: response.data.data.email },
      });
    }
    console.log(response.data.data.email);
  };
  // Register handlers
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const username = formData.get("username") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!username || !fullName || !email || !password) {
      console.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      console.error("Passwords do not match.");
      return;
    }

    const registrationData: RegisterData = {
      username: username,
      fullName: fullName,
      email: email,
      password: password,
    };

    await register(registrationData);

    // navigate("/auth/profile-setup", { state: { registrationData } });
  };

  // Profile setup handlers
  const userIdForProfileSetup = location.state?.userId;
  console.log(userIdForProfileSetup);

  React.useEffect(() => {
    if (mode === "profile-setup" && !userIdForProfileSetup) {
      console.error(
        "No user Id found for profile setup. Redirecting to register page."
      );
      navigate("/auth/register");
    }
  }, [mode, userIdForProfileSetup, navigate]);

  const handleProfileComplete = async (profileData: {
    avatar?: File;
    coverImage?: File;
  }) => {
    const imageData = new FormData();

    if (profileData.avatar) {
      imageData.append("avatar", profileData.avatar);
    }

    if (profileData.coverImage) {
      imageData.append("coverImage", profileData.coverImage);
    }

    await completeProfileSetup(userIdForProfileSetup, imageData);
  };

  const handleProfileSkip = async () => {
    console.log("Skipping profile setup, sending only registration data...");
    navigate("/auth/login");
  };

  // Forgot password handlers
  const handleResetPassword = async (identifier: string): Promise<boolean> => {
    clearAuthError();
    const success = await forgotPassword({ identifier: identifier });
    return success;
  };

  // OTP verification handlers
  const handleVerifyOTP = (otp: string) => {
    console.log("Verifying OTP:", otp);
    navigate("/blog/home");
  };

  const handleResendCode = () => {
    console.log("Resending OTP code...");
  };

  // Reset password handlers
  const handleRestorePassword = async (password: string): Promise<boolean> => {
    if (!token) {
      console.error("No reset token found in URL.");
      return false;
    }
    clearAuthError();
    const success = await restorePassword(token, { password });
    return success;
  };

  // Navigation handlers
  const handleCreateAccount = () => navigate("/auth/register");
  const handleSignInNav = () => navigate("/auth/login");
  const handleForgotPassword = () => navigate("/auth/forgot-password");
  const handleGoBack = () => {
    if (mode === "forgot-password" || mode === "verify-otp") {
      navigate("/auth/login");
    }
  };
  const handleGoToSignIn = () => navigate("/auth/login");

  const renderAuthComponent = () => {
    switch (mode) {
      case "login":
        return (
          <SignInPage
            onSignIn={handleSignIn}
            onCreateAccount={handleCreateAccount}
            onResetPassword={handleForgotPassword}
            heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
          />
        );
      // case "signup":
      //   return (
      //     <SignUpPage1
      //       onSignUp={handleSignUp1}
      //       onSignIn={handleSignInNav}
      //       heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      //     />
      //   );
      case "register":
        return (
          <SignUpPage1
            heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
            onSignUp={handleSignUp1}
            onSignIn={handleSignInNav}
          />
        );

      case "profile-setup":
        return (
          <ProfileSetup
            onComplete={handleProfileComplete}
            onSkip={handleProfileSkip}
          />
        );

      case "forgot-password":
        return (
          <ForgotPassword
            onResetPassword={handleResetPassword}
            onGoBack={handleGoBack}
            heroImageSrc="https://images.unsplash.com/photo-1585336261022-680e295ce3fe?q=80&w=2070&auto=format&fit=crop"
          />
        );

      case "verify-otp":
        return (
          <OTPVerificationFeature
            email={location.state?.email || "user@example.com"}
            onVerifyOTP={handleVerifyOTP}
            onResendCode={handleResendCode}
            onGoBack={handleGoBack}
            heroImageSrc="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1950&auto=format&fit=crop"
          />
        );

      case "restore-password":
        return (
          <RestorePassword
            onRestorePassword={handleRestorePassword}
            onGoToSignIn={handleGoToSignIn}
            heroImageSrc="https://images.unsplash.com/photo-1528460033278-a6457c209501?q=80&w=1912&auto=format&fit=crop"
            onGoBack={handleGoBack}
          />
        );

      default:
        return null;
    }
  };

  return <AuthLayout authMode={mode}>{renderAuthComponent()}</AuthLayout>;
};

export default AuthPage;
