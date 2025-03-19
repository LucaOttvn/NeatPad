"use client"
import { createContext, useEffect, useState } from "react";

// Screen Size Context (Mobile detection)
export const ScreenSizeContext = createContext(false);

export function ScreenSizeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={isMobile}>
      {children}
    </ScreenSizeContext.Provider>
  );
}
