import * as React from "react";
// 1. Import the raw Shadcn Radio Group components
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem as ShadcnRadioGroupItem,
} from "@/components/ui/radio-group";

// 2. Re-export the components for use in your application.
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof ShadcnRadioGroup>,
  React.ComponentPropsWithoutRef<typeof ShadcnRadioGroup>
>(({ className, ...props }, ref) => {
  return <ShadcnRadioGroup className={className} {...props} ref={ref} />;
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof ShadcnRadioGroupItem>,
  React.ComponentPropsWithoutRef<typeof ShadcnRadioGroupItem>
>(({ className, ...props }, ref) => {
  return <ShadcnRadioGroupItem className={className} {...props} ref={ref} />;
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
