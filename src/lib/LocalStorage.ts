import { isBrowser } from "./index"; // Assuming index.ts exists

export class LocalStorage {
  static get(key: string): any {
    if (!isBrowser) return null;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error("Error parsing JSON from localStorage", error);
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
