import React, { useEffect, useRef } from "react";
import { trackEvent } from "../lib/analytics";

/**
 * Utility component that tracks scroll depth milestones (25%, 50%, 75%, 100%)
 * Place this at the root of a page component or global layout.
 */
export const ScrollDepthTracker: React.FC = () => {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      // Calculate depth
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

      // Define milestones
      const milestones = [25, 50, 75, 100];

      milestones.forEach((milestone) => {
        if (
          scrollPercent >= milestone &&
          !trackedDepths.current.has(milestone)
        ) {
          trackedDepths.current.add(milestone);
          // Ping our analytics helper
          trackEvent("scroll_depth", { depth_percentage: `${milestone}%` });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null; // pure functional monitoring component, renders nothing
};
