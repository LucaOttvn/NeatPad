import { useEffect } from "react";

/**
 * Listen on user's focus on the app and trigegr a callback when called.
 */
export function useAppForeground(onForeground: () => void) {
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        onForeground();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    // Also run once on mount in case the app starts in foreground
    if (document.visibilityState === "visible") {
      onForeground();
    }
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
}
