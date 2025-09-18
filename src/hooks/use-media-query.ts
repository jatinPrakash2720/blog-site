"use client";

import { useState, useEffect } from "react";

/**
 * A custom React hook that tracks the state of a CSS media query.
 * @param query The media query string to watch (e.g., "(min-width: 1024px)").
 * @returns {boolean} A boolean that is true if the media query matches, and false otherwise.
 */
export function useMediaQuery(query: string): boolean {
  // State to store whether the media query matches or not.
  // It checks the initial value on the client-side to avoid server-client mismatches.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure this code only runs in the browser environment.
    if (typeof window === "undefined") return;

    // Create a MediaQueryList object.
    const media = window.matchMedia(query);

    // This function updates the state whenever the media query's status changes.
    const listener = () => {
      setMatches(media.matches);
    };

    // Update the state with the initial value.
    listener();

    // Add the listener to detect changes (e.g., when the user resizes the window).
    media.addEventListener("change", listener);

    // Clean up the listener when the component unmounts to prevent memory leaks.
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]); // Re-run the effect only if the query string changes.

  return matches;
}
