import type React from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps {
  className?: string;
  quantity?: number;
}

const ParticleBackground: React.FC<BackgroundProps> = ({ className }) => {
  // 1. Define the paths to your theme-specific images in the `public` folder.
  const lightModeImageUrl = "/freepik__adjust__8231.png";
  const darkModeImageUrl = "/freepik__adjust__8232.png";

  return (
    <div className={cn("fixed inset-0 -z-10", className)}>
      {/* Light Mode Background Image */}
      <div
        className="absolute inset-0 bg-repeat-y bg-center transition-opacity duration-1000 ease-in-out opacity-100 dark:opacity-0"
        style={{ backgroundImage: `url(${lightModeImageUrl})` }}
      />

      {/* Dark Mode Background Image */}
      <div
        className="absolute inset-0 bg-repeat-y bg-center transition-opacity duration-1000 ease-in-out opacity-0 dark:opacity-100"
        style={{ backgroundImage: `url(${darkModeImageUrl})` }}
      />

      {/* Theme-aware overlay for text readability */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/60" />
    </div>
  );
};

export default ParticleBackground;
