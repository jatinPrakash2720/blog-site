import React from "react";
// Import the raw Shadcn Input component
import { Input as ShadcnInput } from "@/components/ui/input";
// import { cn } from "@/lib/utils";

// Define the props for your custom Input, extending the standard input attributes
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <ShadcnInput
        className={`${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
