"use client";

import { useCallback } from "react";
import { useAuthProgress } from "../store/theme";
import { useLocation } from "react-router-dom";

export function useFieldFocus() {
  const { updateStepFromField } = useAuthProgress();
  const location = useLocation();

  const getAuthModeFromPath = useCallback((pathname: string) => {
    if (pathname.includes("/auth/login")) return "login";
    if (pathname.includes("/auth/register")) return "register";
    if (pathname.includes("/auth/profile-setup")) return "profile-setup";
    if (pathname.includes("/auth/forgot-password")) return "forgot-password";
    if (pathname.includes("/auth/verify-otp")) return "verify-otp";
    if (pathname.includes("/auth/restore-password")) return "restore-password";
    if (pathname.includes("/auth/restore-password/:token"))
      return "restore-password";
    return "login";
  }, []);

  const handleFieldFocus = useCallback(
    (fieldName: string) => {
      const authMode = getAuthModeFromPath(location.pathname);
      console.log("[useFieldFocus] Field focused:", fieldName);
      console.log("[useFieldFocus] Path:", location.pathname);
      console.log("[useFieldFocus] Detected auth mode:", authMode);
      updateStepFromField(fieldName, authMode);
    },
    [location.pathname, updateStepFromField, getAuthModeFromPath]
  );

  return { handleFieldFocus };
}
