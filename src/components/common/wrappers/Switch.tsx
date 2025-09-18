import * as React from "react";
// 1. Import the raw Shadcn Switch component
import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// 2. Create your custom wrapper component
const Switch = React.forwardRef<
  React.ElementRef<typeof ShadcnSwitch>,
  React.ComponentPropsWithoutRef<typeof ShadcnSwitch>
>(({ className, ...props }, ref) => (
  <ShadcnSwitch className={cn(className)} ref={ref} {...props} />
));
Switch.displayName = "Switch";

export default Switch;
