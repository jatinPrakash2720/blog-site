import React from "react";
// Import the raw Shadcn Avatar components
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Define the props for your custom Avatar
interface AvatarProps {
  src?: string;
  alt?: string;
  fallbackText?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallbackText = "U",
  className,
}) => {
  return (
    // Render the Shadcn Avatar internally
    <ShadcnAvatar className={cn("h-10 w-10", className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </ShadcnAvatar>
  );
};

export default Avatar;
