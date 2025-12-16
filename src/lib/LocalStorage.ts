import { isBrowser } from "./index"; // Assuming index.ts exists

export class LocalStorage {
  static get(key: string): any {
    if (!isBrowser) return null;
    const value = localStorage.getItem(key);
    if (value) {
      // Handle cases where value is the string "undefined" or "null"
      if (value === "undefined" || value === '"undefined"') {
        localStorage.removeItem(key);
        return null;
      }
      if (value === "null" || value === '"null"') {
        localStorage.removeItem(key);
        return null;
      }
      try {
        const parsed = JSON.parse(value);
        // Handle parsed undefined/null values
        if (parsed === undefined || parsed === null) {
          return null;
        }
        return parsed;
      } catch (error) {
        console.error("Error parsing JSON from localStorage", error, {
          key,
          value,
        });
        // Remove invalid value from localStorage
        localStorage.removeItem(key);
        return null;
      }
    }
    return null;
  }

  static set(key: string, value: any): void {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string): void {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }

  static clear(): void {
    if (!isBrowser) return;
    localStorage.clear();
  }
}
