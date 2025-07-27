"use client";
import { createContext, ReactNode } from "react";

interface FoldersContextType {
}

export const FoldersContext = createContext<FoldersContextType | undefined>(
  undefined
);

export function FolderProvider({ children }: { children: ReactNode }) {

  return (
    <FoldersContext.Provider
      value={{ }}
    >
      {children}
    </FoldersContext.Provider>
  );
}
