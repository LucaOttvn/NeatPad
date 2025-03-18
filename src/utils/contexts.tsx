"use client"; // This ensures the entire file is treated as client-side

import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useState, useEffect } from "react";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Screen Size Context (Mobile detection)
export const ScreenSizeContext = createContext<boolean>(false);

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

interface SelectedNoteContextType {
  selectedNote: number | null;
  setSelectedNote: (Note: number | null) => void;
}

export const SelectedNoteContext = createContext<SelectedNoteContextType | undefined>(
  undefined
);

export function NoteProvider({ children }: { children: ReactNode }) {
  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  return (
    <SelectedNoteContext.Provider value={{ selectedNote, setSelectedNote }}>
      {children}
    </SelectedNoteContext.Provider>
  );
}
