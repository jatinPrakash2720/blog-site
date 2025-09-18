"use client";

import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Shield,
  KeyRound,
  AtSign,
  Lock,
  UserCheck,
  ImagePlus,
  CircleFadingPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthProgress } from "@/store/theme";

export interface AuthStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type AuthMode =
  | "login"
  | "register"
  | "profile-setup"
  | "forgot-password"
  | "verify-otp"
  | "restore-password";

interface AuthProgressBarProps {
  currentStep?: string;
  authMode?: AuthMode;
  className?: string;
}

const authFlows = {
  login: [
    {
      id: "add-email",
      label: "Add Email",
      icon: AtSign,
    },
    {
      id: "add-password",
      label: "Write Password",
      icon: Lock,
    },
  ],
  register: [
    {
      id: "username-details",
      label: "Set Username",
      icon: UserCheck,
    },
    {
      id: "fullname-details",
      label: "Set Fullname",
      icon: UserCheck,
    },
    {
      id: "add-email",
      label: "Add Email",
      icon: AtSign,
    },
    {
      id: "set-password",
      label: "Set Password",
      icon: Lock,
    },
    {
      id: "set-confirm-password",
      label: "Set Confirm Password",
      icon: Lock,
    },
    {
      id: "profile-setup",
      label: "Profile Setup",
      icon: User,
    },
  ],
  "forgot-password": [
    {
      id: "find-account",
      label: "Find Account",
      icon: Mail,
    },
  ],
  "verify-otp": [
    {
      id: "verify-otp",
      label: "Verify Code",
      icon: Shield,
    },
  ],
  "restore-password": [
    {
      id: "set-new-password",
      label: "New Password",
      icon: KeyRound,
    },
    {
      id: "set-confirm-password",
      label: "Confirm Password",
      icon: KeyRound,
    },
  ],
  "profile-setup": [
    {
      id: "cover",
      label: "Add Cover Image",
      icon: ImagePlus,
    },
    {
      id: "avatar",
      label: "Add Avatar",
      icon: CircleFadingPlus,
    },
  ],
};

const getAuthModeFromPath = (pathname: string): AuthMode => {
  if (pathname.includes("/auth/login")) return "login";
  if (pathname.includes("/auth/register")) return "register";
  if (pathname.includes("/auth/profile-setup")) return "profile-setup";
  if (pathname.includes("/auth/forgot-password")) return "forgot-password";
  if (pathname.includes("/auth/verify-otp")) return "verify-otp";
  if (pathname.includes("/auth/restore-password")) return "restore-password";
  return "login"; // default
};

const getCurrentStepForMode = (authMode: AuthMode): string => {
  const steps = authFlows[authMode];
  const defaultStep = steps[0]?.id || "add-email";
  console.log("[getCurrentStepForMode] Auth mode:", authMode);
  console.log("[getCurrentStepForMode] Steps:", steps);
  console.log("[getCurrentStepForMode] Default step:", defaultStep);
  return defaultStep;
};

export function AuthProgressBar({
  currentStep,
  authMode,
  className,
}: AuthProgressBarProps) {
  const location = useLocation();
  const { currentStep: contextCurrentStep } = useAuthProgress();

  const detectedAuthMode = authMode || getAuthModeFromPath(location.pathname);
  const detectedCurrentStep =
    currentStep ||
    contextCurrentStep ||
    getCurrentStepForMode(detectedAuthMode);

  // Debug logging
  console.log("[AuthProgressBar] Path:", location.pathname);
  console.log("[AuthProgressBar] Detected mode:", detectedAuthMode);
  console.log("[AuthProgressBar] Current step:", detectedCurrentStep);

  const currentSteps = (authFlows[detectedAuthMode] || authFlows.login).filter(
    Boolean
  );
  const currentStepIndex = currentSteps.findIndex(
    (step) => step.id === detectedCurrentStep
  );
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [showActiveLabel, setShowActiveLabel] = useState(false);

  useEffect(() => {
    if (detectedCurrentStep) {
      setShowActiveLabel(true);
      const timer = setTimeout(() => {
        setShowActiveLabel(false);
      }, 2000); // Show for 2 seconds then fade

      return () => clearTimeout(timer);
    }
  }, [detectedCurrentStep]);

  return (
    <div className={cn("fixed left-8 top-0 bottom-0 z-40", className)}>
      <div className="relative flex flex-col items-center h-full">
        <div className="absolute top-1/2 -translate-y-1/2">
          {currentSteps.map((step, index) => {
            if (!step) return null;
            const isActive = step.id === detectedCurrentStep;
            const isCompleted = currentStepIndex > index;
            const IconComponent = step.icon;
            const isHovered = hoveredStep === step.id;
            // Updated condition to show label for both hover and auto-show
            const shouldShowLabel = isHovered || (isActive && showActiveLabel);

            const relativePosition = (index - currentStepIndex) * 120;

            const distance = Math.abs(index - currentStepIndex);
            const distanceScale = Math.max(0.6, 1 - distance * 0.15);
            const blurIntensity =
              distance > 0 ? Math.min(3, distance * 1.5) : 0;
            const opacityValue =
              distance > 0 ? Math.max(0.2, 1 - distance * 0.25) : 1;

            const iconColor = isActive
              ? "#000000"
              : isCompleted
                ? "#000000"
                : "#000000";

            return (
              <motion.div
                key={step.id}
                className="absolute flex items-center"
                animate={{
                  y: relativePosition,
                  scale: distanceScale,
                }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200,
                  damping: 30,
                }}
              >
                <div className="relative">
                  <motion.div
                    className={cn(
                      "relative flex items-center justify-center rounded-full z-10 origin-center cursor-pointer",
                      "transition-all duration-200 ease-out",
                      "hover:scale-110 hover:brightness-100 hover:blur-none hover:opacity-100",
                      isActive ? "w-8 h-8" : "w-6 h-6"
                    )}
                    style={{
                      backgroundColor: `${iconColor}20`, // 20% opacity background
                      border: `1px solid ${iconColor}40`, // 40% opacity border
                      backdropFilter: "blur(12px) saturate(180%)",
                      WebkitBackdropFilter: "blur(12px) saturate(180%)",
                      filter: !isActive
                        ? `blur(${blurIntensity}px) brightness(0.7)`
                        : "none",
                      opacity: opacityValue,
                    }}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    <IconComponent
                      className={cn(
                        "transition-all duration-200 ease-out",
                        isActive ? "w-4 h-4" : "w-3 h-3",
                        "text-white drop-shadow-sm"
                      )}
                    />
                  </motion.div>
                  {shouldShowLabel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        duration: isActive && showActiveLabel ? 0.3 : 0.15,
                        ease: "easeOut",
                      }}
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
                    >
                      <div
                        className="px-3 py-2 text-xs rounded-xl shadow-xl border border-white/20"
                        style={{
                          backgroundColor: `${iconColor}20`, // 20% opacity of icon color
                          backdropFilter: "blur(12px) saturate(180%)",
                          WebkitBackdropFilter: "blur(12px) saturate(180%)",
                          border: `1px solid ${iconColor}40`, // 40% opacity border
                        }}
                      >
                        <p className="font-medium text-white whitespace-nowrap drop-shadow-sm">
                          {step.label}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
