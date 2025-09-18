import * as React from "react";
// 1. Import the raw Shadcn Separator component
import { Separator as ShadcnSeparator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// 2. Create your custom wrapper component
const Separator = React.forwardRef<
  React.ElementRef<typeof ShadcnSeparator>,
  React.ComponentPropsWithoutRef<typeof ShadcnSeparator>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <ShadcnSeparator
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(className)}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export default Separator;
