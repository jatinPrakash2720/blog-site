import * as React from "react";
// 1. Import the raw Shadcn Scroll Area components
import {
  ScrollArea as ShadcnScrollArea,
  ScrollBar as ShadcnScrollBar,
} from "@/components/ui/scroll-area";

// 2. Re-export the components for use in your application.
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ShadcnScrollArea>,
  React.ComponentPropsWithoutRef<typeof ShadcnScrollArea>
>(({ className, children, ...props }, ref) => (
  <ShadcnScrollArea ref={ref} className={className} {...props}>
    {children}
  </ShadcnScrollArea>
));
ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ShadcnScrollBar>,
  React.ComponentPropsWithoutRef<typeof ShadcnScrollBar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ShadcnScrollBar
    ref={ref}
    orientation={orientation}
    className={className}
    {...props}
  />
));
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
