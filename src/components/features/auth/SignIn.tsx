"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { SignInPageProps } from "@/types/components/features/auth";
import { GlassInputWrapper } from "@/components/common/subComps/GlassInputWrapper";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import {Button} from "@/components/common/wrappers/Button";
import Checkbox from "@/components/common/wrappers/Checkbox";
import Label from "@/components/common/wrappers/Label";
import { useTheme } from "@/store/theme";
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
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { continueWithGoogle, continueWithGithub } = useAuth();

  return (
    <div className="h-[100vh] flex flex-col md:flex-row font-sans w-[100vw] flex-1 items-center justify-center p-4 overflow-hidden ">
      {/* Right column: hero image + testimonials */}

      {/* Left column: sign-in form */}
      <div className="w-full max-w-md  py-4 px-8  hover:shadow-3xl bg-white/50 dark:bg-black/40 backdrop-blur-xl border dark:border-white/10 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col gap-2">
          <h1 className="animate-app-fade-in duration-[0.1s] text-4xl md:text-5xl font-semibold leading-tight text-foreground dark:text-muted-foreground">
            {title}
          </h1>
          <p className="animate-app-fade-in duration-[0.2s] text-foreground dark:text-muted-foreground">
            {description}
          </p>

          <form className="space-y-5" onSubmit={onSignIn}>
            <div className="animate-app-fade-in duration-[0.3s] space-y-2">
              <Label className="text-sm font-medium text-foreground dark:text-muted-foreground mb-1">
                Email Address
              </Label>
              <GlassInputWrapper>
                <FocusTrackingInput
                  fieldName="add-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm p-3 rounded-2xl focus:outline-none"
                />
                {/* <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                  /> */}
              </GlassInputWrapper>
            </div>

            <div className="animate-app-fade-in duration-[0.4s] space-y-2">
              <Label className="text-sm font-medium text-foreground dark:text-muted-foreground mb-1">
                Password
              </Label>
              <GlassInputWrapper>
                <div className="relative">
                  <FocusTrackingInput
                    fieldName="write-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm p-3 rounded-2xl focus:outline-none"
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
              </GlassInputWrapper>
            </div>

            <div className="animate-app-fade-in duration-[0.5s] flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 ">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  className="border-2  dark:border-[#FFC200]/80 border-[#FFC200]"
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
                className="hover:underline dark:text-[#FFC200]/80 text-[#FFC200] transition-colors"
              >
                Reset password
              </a>
            </div>

            <Button
              intent={theme.theme === "dark" ? "authd" : "authl"}
              size="auth"
              className="animate-app-fade-in duration-[0.6s]"
            >
              Sign In
            </Button>
          </form>

          <div className="animate-app-fade-in duration-[0.7s] py-1 relative flex items-center justify-center">
            <span className="px-4  text-sm  text-foreground dark:text-muted-foreground absolute">
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

          <p className="animate-app-fade-in duration-[0.8s] text-center text-sm text-foreground dark:text-muted-foreground">
            New to our platform?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onCreateAccount?.();
              }}
              className=" dark:text-[#FFC200]/80 text-[#FFC200] hover:underline transition-colors"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
