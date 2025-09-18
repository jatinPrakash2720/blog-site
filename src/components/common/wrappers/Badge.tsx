import * as React from "react";
// 1. Import the raw Shadcn Badge and its variant props
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<typeof ShadcnBadge>;

// 2. Create your custom wrapper component
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      // 3. Render the Shadcn Badge internally
      <ShadcnBadge
        ref={ref}
        className={cn(
          // You can add your own default styles or overrides here if needed
          className
        )}
        variant={variant}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export default Badge;
