import * as React from "react";
// 1. Import the raw Shadcn Toggle component and its variant props
import { Toggle as ShadcnToggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type ToggleProps = React.ComponentProps<typeof ShadcnToggle>;

// 2. Create your custom wrapper component
const Toggle = React.forwardRef<
  React.ElementRef<typeof ShadcnToggle>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <ShadcnToggle
    ref={ref}
    className={cn(className)}
    variant={variant}
    size={size}
    {...props}
  />
));
Toggle.displayName = "Toggle";

export default Toggle;
