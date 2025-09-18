"use client";

import type React from "react";
import { useState } from "react";
import {  Mail, User, CheckCircle, AlertCircle } from "lucide-react";
import type { ForgotPasswordProps } from "@/types/components/features/auth";
import { GlassInputWrapper } from "@/components/common/subComps/GlassInputWrapper";
import { useTheme } from "@/store/theme";
import {Button} from "@/components/common/wrappers/Button";
import FocusTrackingInput from "@/components/common/wrappers/FocusTrackingInput";

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  title = (
    <span className="font-light text-foreground tracking-tighter">
      Reset Password
    </span>
  ),
  description = "Enter your email address or username and we'll send you a link to reset your password",
  onResetPassword,
  onGoBack,
}) => {

  const theme = useTheme();
  const [searchMethod, setSearchMethod] = useState<"email" | "username">(
    "email"
  );
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const success = await onResetPassword?.(identifier);
      if (success) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          `${searchMethod === "email" ? "Email address" : "Username"} not found. Please check and try again.`
        );
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="h-[80vh] flex flex-col md:flex-row font-sans w-[100vw] flex-1 items-center justify-center p-4 overflow-hidden ">
        {/* Left column: Success message */}
        <div className="w-full max-w-md  py-4 px-8  hover:shadow-3xl bg-white/50 dark:bg-black/40 backdrop-blur-xl border dark:border-white/10 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex flex-col items-center gap-6">
            <div className="animate-app-fade-in duration-[0.1s] flex items-center justify-center w-16 h-16 mx-auto  dark:bg-[#FFC200]/25 bg-[#FFC200]/5 rounded-full">
              <CheckCircle className="w-8 h-8 dark:text-[#FFC200]/80 text-[#FFC200]" />
            </div>

            <h1 className="animate-app-fade-in duration-[0.2s] text-4xl md:text-5xl font-semibold leading-tight">
              Check Your Email
            </h1>

            <div className="animate-app-fade-in duration-[0.2s] space-y-2">
              <p className="text-foreground dark:text-muted-foreground">
                We've sent a password reset link to your email address
              </p>
              <p className="text-sm text-foreground dark:text-muted-foreground">
                Click the link in the email to reset your password. The link
                will expire in 24 hours.
              </p>
            </div>

            <div className="animate-app-fade-in duration-[0.2s] space-y-4">
              <Button
                intent={theme.theme === "dark" ? "authd" : "authl"}
                size="auth"
                onClick={onGoBack}
                className="animate-app-fade-in duration-[0.6s]"
              >
                Back to Sign In
              </Button>

              <p className="text-sm text-foreground dark:text-muted-foreground">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setSubmitStatus("idle");
                    setIdentifier("");
                  }}
                  className=" dark:text-[#FFC200]/80 text-[#FFC200] transition-colors"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100vh] flex flex-col md:flex-row font-sans w-[100vw] flex-1 items-center justify-center p-4 overflow-hidden ">
      <div className="w-full max-w-md hover:shadow-3xl px-8 py-4 bg-white/50 dark:bg-black/40 backdrop-blur-xl border dark:border-white/10 border-black/10 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col gap-6">
          <div className="animate-app-fade-in duration-[0.2s] text-center">
            {/* <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-[#FFC200]/5 border border-[#FFC200] dark:bg-[#FFC200]/25 rounded-full">
              <Mail className="w-8 h-8 text-[#FFC200] dark:text-[#FFC200]/80" />
            </div> */}
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-2">
              {title}
            </h1>
            <p className="text-foreground dark:text-muted-foreground">
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-app-fade-in duration-[0.2s]">
              <label className="text-sm font-medium text-foreground dark:text-muted-foreground block mb-3">
                Find your account by:
              </label>
              <div className="flex gap-2 bg-muted/30  rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMethod("email");
                    setIdentifier("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 rounded-xl text-sm font-medium transition-all ${
                    searchMethod === "email"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-foreground "
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchMethod("username");
                    setIdentifier("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    searchMethod === "username"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-foreground "
                  }`}
                >
                  <User className="w-4 h-4" />
                  Username
                </button>
              </div>
            </div>

            <div className="animate-app-fade-in duration-[0.2s]">
              <label className="text-sm font-medium text-foreground dark:text-muted-foreground block mb-2">
                {searchMethod === "email" ? "Email Address" : "Username"}
              </label>
              <GlassInputWrapper>
                <FocusTrackingInput
                  fieldName="find-account"
                  type={searchMethod === "email" ? "email" : "text"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    searchMethod === "email"
                      ? "Enter your email address"
                      : "Enter your username"
                  }
                  className="w-full bg-transparent placeholder:text-muted-foreground text-sm p-3 rounded-2xl focus:outline-none"
                  required
                  disabled={isSubmitting}
                />
              </GlassInputWrapper>
            </div>

            {submitStatus === "error" && (
              <div className="animate-app-fade-in duration-[0.2s] flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  {errorMessage}
                </p>
              </div>
            )}

            <Button
              // type="submit"
              intent={theme.theme === "dark" ? "authl" : "authd"}
              size="continue"
              disabled={isSubmitting || !identifier.trim()}
              className="animate-app-fade-in duration-[0.2s] w-full rounded-2xl bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Finding Account...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="animate-app-fade-in duration-[0.2s] text-center text-xs dark:text-muted-foreground">
            <p>
              Remember your password?{" "}
              <button
                onClick={onGoBack}
                className="text-[#FFC200] transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
