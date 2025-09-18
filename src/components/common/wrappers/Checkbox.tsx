import * as React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof ShadcnCheckbox>,
  React.ComponentPropsWithoutRef<typeof ShadcnCheckbox>
>(({ ...props }, ref) => {
  return <ShadcnCheckbox ref={ref} {...props} />;
});

Checkbox.displayName = "Checkbox";

export default Checkbox;