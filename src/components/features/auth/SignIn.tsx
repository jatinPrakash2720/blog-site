"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { SignInPageProps } from "@/types/components/features/auth";
import { GlassInputWrapper } from "@/components/common/subComps/GlassInputWrapper";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
// import { Button } from "@/components/ui/button";
import Checkbox from "@/components/common/wrappers/Checkbox";
import Label from "@/components/common/wrappers/Label";
// import { useTheme } from "@/store/theme";
import FocusTrackingInput from "@/components/common/wrappers/FocusTrackingInput";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { useAuth } from "@/store/auth";

export const SignInPage: React.FC<SignInPageProps> = ({
  title = (
    <span className="font-light text-foreground tracking-tighter">
      Welcome, Back !
    </span>
  ),
  description = "Access your account and continue your journey with us",

  onSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  // const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { continueWithGoogle, continueWithGithub } = useAuth();

  return (
    <div className="h-[100vh] flex flex-col md:flex-row font-sans w-[100vw] flex-1 items-center justify-center p-4 overflow-hidden ">
      {/* Right column: hero image + testimonials */}

      {/* Left column: sign-in form */}
      <div className="w-full max-w-lg py-8 px-10 hover:shadow-3xl bg-white/50 dark:bg-black/40 backdrop-blur-xl border dark:border-white/10 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col gap-2">
          <h1 className="animate-app-fade-in duration-[0.1s] text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground dark:text-muted-foreground">
            {title}
          </h1>
          <p className="animate-app-fade-in duration-[0.2s] lg:py-2 py-1 text-foreground dark:text-muted-foreground text-sm md:text-base lg:text-lg">
            {description}
          </p>

          <form className="space-y-5" onSubmit={onSignIn}>
            <div className="animate-app-fade-in duration-[0.3s] space-y-2">
              <Label className="sm:text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2">
                Email Address
              </Label>
                <input
                  // fieldName="add-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full text-foreground bg-white/55 dark:bg-black/30 border-none hover:shadow-2xl shadow-2xs transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/50 placeholder:text-muted-foreground sm:text-sm md:text-base lg:text-lg p-3 rounded-2xl focus:outline-none"
                />
                {/* <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  /> */}
            </div>

            <div className="animate-app-fade-in duration-[0.4s] space-y-2">
              <Label className="sm:text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2">
                Password
              </Label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full text-foreground border-none bg-white/55 dark:bg-black/30 hover:shadow-2xl shadow-2xs transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/50 placeholder:text-muted-foreground sm:text-sm md:text-base lg:text-lg p-3 rounded-2xl focus:outline-none"
                  />
                  {/* <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    /> */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center bg-transparent hover:bg-transparent p-0 h-auto"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-foreground dark:text-muted-foreground  transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-foreground dark:text-muted-foreground  transition-colors" />
                    )}
                  </button>
                </div>
            </div>

            <div className="animate-app-fade-in duration-[0.5s] flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 ">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  className="border-2 border-gray-400 dark:border-gray-500"
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-foreground/90 cursor-pointer"
                >
                  Keep me signed in
                </Label>
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onResetPassword?.();
                }}
                className="hover:underline text-gray-600 dark:text-gray-400 transition-colors"
              >
                Reset password
              </a>
            </div>

            <button
              type="submit"
              className="animate-app-fade-in duration-[0.6s] w-full rounded-2xl p-3 text-base font-medium h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
            </button>
          </form>

          <div className="animate-app-fade-in duration-[0.7s] py-1 relative flex items-center justify-center">
            <span className="px-4  text-sm  text-foreground dark:text-muted-foreground absolute">
              Or continue with
            </span>
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={continueWithGoogle}
              className="animate-app-fade-in duration-[0.7s] w-1/2 rounded-r-none rounded-2xl p-3 text-base font-medium h-auto bg-background border border-input hover:bg-accent hover:text-accent-foreground shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              onClick={continueWithGithub}
              className="animate-app-fade-in duration-[0.7s] w-1/2 rounded-l-none rounded-2xl p-3 text-base font-medium h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <GithubIcon />
              Github
            </button>
          </div>

          <p className="animate-app-fade-in duration-[0.8s] text-center text-sm text-foreground dark:text-muted-foreground">
            New to our platform?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCreateAccount?.();
              }}
              className="text-gray-600 dark:text-gray-400 hover:underline transition-colors"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
