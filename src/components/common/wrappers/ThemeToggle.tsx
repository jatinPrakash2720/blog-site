"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../store/theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost" // Use the transparent ghost variant
      size="icon" // Use the standard icon button size
      className={cn(
        // This allows the parent component (Header) to pass down
        // dynamic hover and color classes for a consistent look.
        "relative",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
    </Button>
  );
};

export default ThemeToggle;

// import React from "react";
// import { Sun, Moon } from "lucide-react";
// import { useTheme } from "@/store/theme";
// import Button from "./Button";

// interface ThemeToggleProps {
//   className?: string;
//   size?: "sm" | "md" | "lg";
// }

// const ThemeToggle: React.FC<ThemeToggleProps> = ({
//   className = "",
//   size = "md"
// }) => {
//   const { theme, toggleTheme } = useTheme();

//   const sizeClasses = {
//     sm: "p-1.5",
//     md: "p-2.5",
//     lg: "p-3"
//   };

//   const iconSizes = {
//     sm: "w-3 h-3",
//     md: "w-4 h-4",
//     lg: "w-5 h-5"
//   };

//   return (
//     <Button
//       onClick={toggleTheme}
//       className={`${sizeClasses[size]} bg-white/90 dark:bg-black/90 hover:bg-white/70 dark:hover:bg-black/70 rounded-xl transition-all duration-200 text-black dark:text-white ${className}`}
//       aria-label="Toggle theme"
//     >
//       {theme === "dark" ? (
//         <Sun className={iconSizes[size]} />
//       ) : (
//         <Moon className={iconSizes[size]} />
//       )}
//     </Button>
//   );
// };

// export default ThemeToggle;
