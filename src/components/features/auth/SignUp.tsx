"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Shield, FileText } from "lucide-react";
import { GlassInputWrapper } from "@/components/common/subComps/GlassInputWrapper";
import type { SignUpPageProps } from "@/types/components/features/auth";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import FocusTrackingInput from "@/components/common/wrappers/FocusTrackingInput";
import {Button} from "@/components/common/wrappers/Button";
import Checkbox from "@/components/common/wrappers/Checkbox";
import { useTheme } from "@/store/theme";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { useAuth } from "@/store/auth";

export const SignUpPage: React.FC<SignUpPageProps> = ({
  title = (
    <span className="font-light text-foreground tracking-tighter">
      Create Account
    </span>
  ),
  description = "Join our community and start your journey with us today",
  onSignUp,
  onSignIn,
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { continueWithGoogle, continueWithGithub } = useAuth();

  return (
    <div className="h-[100vh] flex flex-col md:flex-row font-sans w-[80vw] flex-1 items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md  py-4 px-8  hover:shadow-3xl md:bg-white/50 md:dark:bg-black/40 md:backdrop-blur-xl md:border md:dark:border-white/10 md:border-black/10 md:rounded-[32px] md:shadow-2xl md:transform md:transition-all md:duration-300 md:hover:shadow-3xl">
        <div className="flex flex-col gap-2">
          <h1 className="animate-app-fade-in duration-[0.1s] text-4xl md:text-5xl font-semibold leading-tight">
            {title}
          </h1>
          <p className="animate-app-fade-in duration-[0.2s]  text-foreground">
            {description}
          </p>

          <form className="space-y-4" onSubmit={onSignUp}>
            <div className="animate-app-fade-in duration-[0.3s] grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <GlassInputWrapper>
                  <FocusTrackingInput
                    fieldName="add-username"
                    name="username"
                    type="text"
                    placeholder="Choose Username"
                    className="w-full bg-transparent placeholder:text-muted-foreground text-sm p-3 rounded-2xl focus:outline-none"
                    required
                  />
                </GlassInputWrapper>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <GlassInputWrapper>
                  <FocusTrackingInput
                    fieldName="add-fullname"
                    name="fullName"
                    type="text"
                    placeholder="Enter Full Name"
                    className="w-full bg-transparent placeholder:text-muted-foreground text-sm p-3 rounded-2xl focus:outline-none"
                    required
                  />
                </GlassInputWrapper>
              </div>
            </div>

            <div className="animate-app-fade-in duration-[0.4s]">
              <label className=" text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <GlassInputWrapper>
                <FocusTrackingInput
                  fieldName="add-email"
                  name="email"
                  type="email"
                  placeholder="Enter your Email Address"
                  className="w-full bg-transparent  placeholder:text-muted-foreground text-sm p-3 rounded-2xl focus:outline-none"
                  required
                />
              </GlassInputWrapper>
            </div>

            <div className="animate-app-fade-in duration-[0.5s] grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <FocusTrackingInput
                      fieldName="add-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create Password"
                      className="w-full bg-transparent placeholder:text-muted-foreground text-sm p-3 rounded-2xl focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4" />
                  Confirm Password
                </label>
                <GlassInputWrapper>
                  <div className="relative">
                    <FocusTrackingInput
                      fieldName="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full bg-transparent placeholder:text-muted-foreground text-sm p-3 rounded-2xl focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>
            </div>

            <div className="animate-app-fade-in duration-[0.6s] flex items-center gap-3">
              <Checkbox
                name="agreeToTerms"
                className="custom-checkbox border-2  dark:border-[#FFC200]/80 border-[#FFC200]"
                required
              />

              <span className=" pt-0.5 text-sm text-foreground/90 flex items-center gap-2">
                <FileText className="w-4 h-4 text-foreground" />I agree to the{" "}
                <a
                  href="#"
                  className=" dark:text-[#FFC200]/80 text-[#FFC200]  hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className=" dark:text-[#FFC200]/80 text-[#FFC200]  hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            <Button
              intent={theme.theme === "dark" ? "authd" : "authl"}
              size="auth"
              className="animate-app-fade-in duration-[0.7s] flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Create Account
            </Button>
          </form>

          <div className="animate-app-fade-in duration-[0.7s] relative flex items-center justify-center py-1">
            <span className="px-4 text-sm text-foreground absolute">
              Or continue with
            </span>
          </div>

          <div className="flex justify-center items-center">
            <Button
              onClick={continueWithGoogle}
              intent={theme.theme === "dark" ? "authl" : "authd"}
              size="continue"
              className="animate-app-fade-in duration-[0.7s] w-1/2 rounded-r-none"
            >
              <GoogleIcon />
              Google
            </Button>
            <Button
              onClick={continueWithGithub}
              intent={theme.theme === "dark" ? "authd" : "authl"}
              size="continue"
              className="animate-app-fade-in duration-[0.7s] w-1/2 rounded-l-none"
            >
              <GithubIcon />
              Github
            </Button>
          </div>
          <p className="animate-app-fade-in duration-[0.9s] text-center text-sm text-foreground">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSignIn?.();
              }}
              className=" dark:text-[#FFC200]/80 text-[#FFC200]  hover:underline transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
