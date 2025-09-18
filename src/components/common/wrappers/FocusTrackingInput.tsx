"use client";

import type React from "react";
import { forwardRef } from "react";
import { useFieldFocus } from "@/hooks/useFieldFocus";

interface FocusTrackingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string;
}

const FocusTrackingInput = forwardRef<
  HTMLInputElement,
  FocusTrackingInputProps
>(({ fieldName, onFocus, ...props }, ref) => {
  const { handleFieldFocus } = useFieldFocus();

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    handleFieldFocus(fieldName);
    onFocus?.(e);
  };

  return <input ref={ref} onFocus={handleInputFocus} {...props} />;
});

FocusTrackingInput.displayName = "FocusTrackingInput";

export default FocusTrackingInput;
