import * as React from "react";
// 1. Import the raw Shadcn Label component
import { Label as ShadcnLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// 2. Define the props for your custom Label, extending Radix's props
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnLabel> {}

// 3. Create your custom wrapper component
const Label = React.forwardRef<
  React.ElementRef<typeof ShadcnLabel>,
  LabelProps
>(({ className, ...props }, ref) => (
  <ShadcnLabel
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export default Label;
