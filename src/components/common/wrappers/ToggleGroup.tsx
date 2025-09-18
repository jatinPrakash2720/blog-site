import * as React from "react";
// 1. Import the raw Shadcn Toggle Group components
import {
  ToggleGroup as ShadcnToggleGroup,
  ToggleGroupItem as ShadcnToggleGroupItem,
} from "@/components/ui/toggle-group";

// 2. Re-export the components for use in your application
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ShadcnToggleGroup>,
  React.ComponentPropsWithoutRef<typeof ShadcnToggleGroup>
>(({ className, variant, size, children, ...props }, ref) => (
  <ShadcnToggleGroup
    ref={ref}
    className={className}
    variant={variant}
    size={size}
    {...props}
  >
    {children}
  </ShadcnToggleGroup>
));
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ShadcnToggleGroupItem>,
  React.ComponentPropsWithoutRef<typeof ShadcnToggleGroupItem>
>(({ className, children, ...props }, ref) => (
  <ShadcnToggleGroupItem ref={ref} className={className} {...props}>
    {children}
  </ShadcnToggleGroupItem>
));
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
