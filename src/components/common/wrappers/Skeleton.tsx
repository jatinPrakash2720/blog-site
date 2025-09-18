import * as React from "react";
// 1. Import the raw Shadcn Skeleton component
import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// 2. Define the props for your custom Skeleton
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

// 3. Create your custom wrapper component
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      // 4. Render the Shadcn Skeleton internally
      <ShadcnSkeleton
        ref={ref}
        className={cn("bg-gray-200 dark:bg-gray-800", className)} // Added default colors for better theme visibility
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export default Skeleton;
