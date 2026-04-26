import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/analytics";

/**
 * Custom hook to automatically track GA4 page views.
 * Call this in your root <App /> component.
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Whenever the route path changes, ping GA4 logic in our lib
    trackPageView(location.pathname + location.search);
  }, [location]);
};
