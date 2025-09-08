import { useEffect } from "react";

/**
 * listen on user's focus on the app and refetch data 
 */
export function useAppForeground(onForeground: () => void) {
  useEffect(() => {
    const handleVisibility = () => {
      console.log('visi')
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
