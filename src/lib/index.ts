import { LocalStorage } from "./LocalStorage.ts";
import { requestHandler } from "./requestHandler.ts";

export const isBrowser = typeof window !== "undefined";

/**
 * A utility function to conditionally join class names together.
 * @param classes - A list of strings, booleans, or undefined values.
 * @returns A single string of class names.
 */
export const classNames = (
  ...classes: (string | boolean | undefined)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

export { LocalStorage, requestHandler };
