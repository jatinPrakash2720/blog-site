"use client";

import { useCallback } from "react";

export function useFieldFocus() {
  const handleFieldFocus = useCallback(
    (fieldName: string) => {
      console.log("[useFieldFocus] Field focused:", fieldName);
      // Auth progress functionality removed - this hook now just logs field focus
    },
    []
  );

  return { handleFieldFocus };
}
