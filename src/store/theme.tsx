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

// Define the shape of the context's data
interface IThemeContext {
  theme: "light" | "dark";
  toggleTheme: () => void;
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


interface ThemeProviderProps {
  children: ReactNode;
  storageKey?: string;
  defaultTheme?: "light" | "dark";
}


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


  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<IThemeContext>(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
