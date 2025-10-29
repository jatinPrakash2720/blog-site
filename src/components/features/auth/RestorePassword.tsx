"use client";

import type React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export const RestorePassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { restorePassword, clearAuthError } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(pwd))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(pwd))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(pwd))
      return "Password must contain at least one number";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid reset link", {
        description:
          "No reset token found in URL. Please request a new password reset link.",
      });
      return;
    }

    setIsSubmitting(true);
    clearAuthError();

    try {
      const result = await restorePassword(token, { password });
      if (result?.success) {
        toast.success(result?.message);
        // Redirect to sign in after 1 second
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      } else {
        toast.error(result?.message);
        setIsSubmitting(false);
      }
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row font-sans w-screen flex-1 items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-lg py-8 px-10  bg-white dark:bg-black  border dark:border-white/10 border-black/10 rounded-[32px] transform transition-all duration-300">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-foreground dark:text-muted-foreground">
            Restore Password
          </h1>
          <p className=" lg:py-2 py-1 text-foreground dark:text-muted-foreground text-sm md:text-base lg:text-lg">
            Enter your new password to restore your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2 block">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  disabled={isSubmitting}
                  className="w-full h-12 focus:ring-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-none focus:shadow-none bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/60 shadow-2xs transition-all duration-300 hover:bg-zinc-200 placeholder:text-muted-foreground text-sm md:text-base lg:text-lg p-3 pr-12 rounded-2xl focus:outline-none focus:border-primary"
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
            </div>

            <div>
              <label className="text-sm md:text-base lg:text-lg font-medium text-foreground dark:text-muted-foreground mb-2 block">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  disabled={isSubmitting}
                  className="w-full h-12 focus:ring-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:border-none focus:shadow-none bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/60 shadow-2xs transition-all duration-300 hover:bg-zinc-200 placeholder:text-muted-foreground text-sm md:text-base lg:text-lg p-3 pr-12 rounded-2xl focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-foreground hover:text-foreground transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-foreground hover:text-foreground transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-xs text-foreground dark:text-muted-foreground space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={
                isSubmitting || !password.trim() || !confirmPassword.trim()
              }
              className=" w-full rounded-2xl p-3 text-base font-medium h-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Please wait
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          <p className=" py-2 text-end text-sm text-foreground">
            Remember your password?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/login");
              }}
              className="text-blue-500 hover:underline transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
