/**
 * Google Analytics 4 tracking helpers
 */

// Define expected/valid event names
export type EventName =
  | "waitlist_signup"
  | "cta_click"
  | "partner_click"
  | "video_play"
  | "scroll_depth";

/**
 * Tracks a custom GA4 event
 * @param eventName The unified event name (e.g. cta_click, video_play)
 * @param eventParams Meta params like source_page, button_label, depth_percentage
 */
export const trackEvent = (
  eventName: EventName,
  eventParams?: Record<string, any>,
) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, eventParams);
  } else {
    // Graceful fallback for non-GA environments/development
    console.warn(`GA4 Event simulated: ${eventName}`, eventParams);
  }
};

/**
 * Tracks a page view in GA4 explicitly.
 * This is useful in SPA (React Router) to enforce routing tracks.
 * @param url The URL / path being traversed to
 */
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", import.meta.env.VITE_GA_ID || "G-TN6K7Z1FG3", {
      page_path: url,
    });
  } else {
    console.warn(`GA4 PageView simulated: path -> ${url}`);
  }
};
