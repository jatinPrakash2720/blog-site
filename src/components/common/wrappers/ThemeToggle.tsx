"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../store/theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full text-white bg-black/20 hover:bg-black/40 transition-colors relative",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </button>
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
