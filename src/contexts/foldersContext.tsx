"use client";;
import { createContext, ReactNode, useState } from "react";

interface FoldersContextType {
  selectedFolder: number | undefined;
  setSelectedFolder: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const FoldersContext = createContext<FoldersContextType | undefined>(
  undefined
);

export function FolderProvider({ children }: { children: ReactNode }) {

  const [selectedFolder, setSelectedFolder] = useState<number | undefined>();

  return (
    <FoldersContext.Provider
      value={{ selectedFolder, setSelectedFolder }}
    >
      {children}
    </FoldersContext.Provider>
  );
}
