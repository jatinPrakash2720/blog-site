import * as React from "react";
// 1. Import the raw Shadcn Slider component
import { Slider as ShadcnSlider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// 2. Create your custom wrapper component
const Slider = React.forwardRef<
  React.ElementRef<typeof ShadcnSlider>,
  React.ComponentPropsWithoutRef<typeof ShadcnSlider>
>(({ className, ...props }, ref) => (
  <ShadcnSlider
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  />
));
Slider.displayName = "Slider";

export default Slider;
