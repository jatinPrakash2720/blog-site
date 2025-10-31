import { useEffect, useState, useRef, useCallback } from "react";

export const useInView = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Use requestAnimationFrame to batch state updates
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      requestAnimationFrame(() => {
        setIsInView(entry.isIntersecting);
      });
    };

    // Create observer with optimized options
    const observerOptions: IntersectionObserverInit = {
      threshold: options?.threshold ?? 0.1,
      rootMargin: options?.rootMargin ?? "0px",
      root: options?.root ?? null,
    };

    observerRef.current = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    const currentRef = ref.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [options?.threshold, options?.rootMargin, options?.root]);

  return [ref, isInView] as const;
};
