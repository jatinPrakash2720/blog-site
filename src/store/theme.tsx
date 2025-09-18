"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

interface AuthProgressContextType {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  updateStepFromField: (fieldName: string, authMode: string) => void;
}

// Define the shape of the context's data
interface IThemeContext {
  theme: "light" | "dark";
  toggleTheme: () => void;
  authProgress: AuthProgressContextType;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

// Custom hook to access theme context
export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useAuthProgress = (): AuthProgressContextType => {
  const { authProgress } = useTheme();
  return authProgress;
};

interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  defaultTheme?: "light" | "dark";
}

const fieldToStepMapping = {
  login: {
    "add-email": "add-email",
    "write-password": "add-password",
  },
  register: {
    "add-username": "username-details", // Maps to "Username & Name" step
    "add-fullname": "fullname-details", // Maps to "Username & Name" step
    "add-email": "add-email", // Maps to "Add Email" step
    "add-password": "set-password", // Maps to "Set Password" step
    "confirm-password": "set-confirm-password",
    // "click-checkbox": "click-term",
    // "create-acc": "create-account",
    // "google": "use-google",
  },
  "forgot-password": {
    "find-account": "find-account",
  },
  "verify-otp": {
    "verify-otp": "verify-otp",
  },
  "restore-password": {
    "set-new-password": "set-new-password",
    "set-confirm-password": "set-confirm-password",
  },
  "profile-setup": {
    cover: "cover",
    avatar: "avatar",
  },
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  storageKey = "app-theme",
  defaultTheme = "light",
}) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Check localStorage first
    try {
      const storedTheme = localStorage.getItem(storageKey);
      if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
      }
      // Fallback to system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return defaultTheme;
    } catch (e) {
      return defaultTheme;
    }
  });

  const [currentStep, setCurrentStep] = useState<string>("add-email");

  useEffect(() => {
    const root = document.documentElement;
    // Only update classes if necessary
    if (root.classList.contains(theme)) return;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      console.warn("Failed to save theme to localStorage:", e);
    }
  }, [theme, storageKey]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const updateStepFromField = useCallback(
    (fieldName: string, authMode: string) => {
      console.log(
        "[updateStepFromField] Field focused:",
        fieldName,
        "Auth mode:",
        authMode
      );
      const mapping =
        fieldToStepMapping[authMode as keyof typeof fieldToStepMapping];
      console.log(
        "[updateStepFromField] Available mappings:",
        fieldToStepMapping
      );
      console.log("[updateStepFromField] Found mapping:", mapping);
      if (mapping && mapping[fieldName as keyof typeof mapping]) {
        const newStep = mapping[fieldName as keyof typeof mapping];
        console.log("[updateStepFromField] Setting step to:", newStep);
        setCurrentStep(newStep);
      } else {
        console.log(
          "[updateStepFromField] No mapping found for field:",
          fieldName,
          "in mode:",
          authMode
        );
      }
    },
    []
  );

  const authProgress = useMemo<AuthProgressContextType>(
    () => ({
      currentStep,
      setCurrentStep,
      updateStepFromField,
    }),
    [currentStep, updateStepFromField]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<IThemeContext>(
    () => ({
      theme,
      toggleTheme,
      authProgress,
    }),
    [theme, toggleTheme, authProgress]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
