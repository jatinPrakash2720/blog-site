import * as React from "react";
// 1. Import the raw Shadcn Progress component
import { Progress as ShadcnProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// 2. Create your custom wrapper component
const Progress = React.forwardRef<
  React.ElementRef<typeof ShadcnProgress>,
  React.ComponentPropsWithoutRef<typeof ShadcnProgress>
>(({ className, value, ...props }, ref) => (
  <ShadcnProgress
    ref={ref}
    value={value}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  />
));
Progress.displayName = "Progress";

export default Progress;
