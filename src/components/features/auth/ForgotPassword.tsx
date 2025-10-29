"use client";

import type React from "react";
import { useState } from "react";
import { Mail, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, clearAuthError } = useAuth();
  const [searchMethod, setSearchMethod] = useState<"email" | "username">(
    "email"
  );
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoBack = () => {
    navigate("/auth/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);
    clearAuthError();

    try {
      const result = await forgotPassword({ identifier: identifier });
      if (result?.data?.success) {
        toast.success(result?.data?.message);
        setIdentifier("");
      } else {
        toast.error(
          `${
            searchMethod === "email" ? "Email address" : "Username"
          } not found`,
          {
            description: result?.data?.message,
          }
        );
      }
    } catch {
      toast.error("Something went wrong while sending forgot password email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans w-screen flex-1 items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-lg lg:py-8 py-4 md:py-6 px-6 md:px-8 lg:px-10 bg-white dark:bg-zinc-950  border dark:border-zinc-800/60 border-zinc-200/60 rounded-[32px] shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground dark:text-muted-foreground">
            Forgot Password
          </h1>
          <p className=" lg:py-2 py-1 text-foreground dark:text-muted-foreground text-sm md:text-base lg:text-lg">
            Enter your email address or username and we'll send you a link to
            reset your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-app-fade-in duration-200">
              <label className="sm:text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground block mb-2">
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

            <div className="">
              <label className="sm:text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground block mb-2">
                {searchMethod === "email" ? "Email Address" : "Username"}
              </label>
              <Input
                type={searchMethod === "email" ? "email" : "text"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  searchMethod === "email"
                    ? "Enter your email address"
                    : "Enter your username"
                }
                className="w-full h-12 focus:ring-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-none focus:shadow-none bg-zinc-100 hover:bg-zinc-200  dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-300 placeholder:text-muted-foreground sm:text-sm md:text-base lg:text-lg p-3 rounded-2xl focus:outline-none focus:border-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !identifier.trim()}
              className="w-full rounded-2xl p-3 text-base font-medium h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Please wait
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className=" text-end text-sm text-foreground dark:text-muted-foreground">
            Remember your password?{" "}
            <button
              onClick={handleGoBack}
              className="text-blue-500 hover:underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
