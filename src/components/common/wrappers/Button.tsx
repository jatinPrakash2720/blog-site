import React from "react";
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

// 1. Define your app's custom props, including VariantProps for type safety
interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  intent?: "primary" | "secondary" | "danger" | "authl" |"authd"|"continued"|"continuel" ;
  fullWidth?: boolean;
}

// 2. Create your wrapper component
const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      intent = "primary",
      fullWidth,
      className,
      variant,
      size,
      children,
      ...props
    },
    ref
  ) => {
    // 3. Map intent to Shadcn's variant
    const intentToVariant = {
      primary: "default",
      secondary: "secondary",
      danger: "destructive",
      authl: "authl",
      authd: "authd",
      continued: "continued",
      continuel:"continuel"
    } as const; // Ensure literal types for type safety

    // 4. Use the mapped variant or explicit variant, ensuring type safety
    const resolvedVariant = variant || intentToVariant[intent];

    return (
      // 5. Render the Shadcn button with type-safe variant and size
      <ShadcnButton
        ref={ref}
        variant={resolvedVariant} // Explicitly pass resolved variant
        size={size} // Pass size prop directly
        className={cn(fullWidth && "w-full", className)} // Apply fullWidth and custom classes
        {...props}
      >
        {children}
      </ShadcnButton>
    );
  }
);

export {Button};
