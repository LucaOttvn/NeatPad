"use client";;
import { createContext, ReactNode, useState } from "react";

interface FoldersContextType {
  selectedFolder: number | undefined;
  setSelectedFolder: React.Dispatch<React.SetStateAction<number | undefined>>;
  updatingFolder: number | undefined
  setUpdatingFolder: (noteId: number | undefined) => void;
}

export const FoldersContext = createContext<FoldersContextType | undefined>(
  undefined
);

export function FolderProvider({ children }: { children: ReactNode }) {

  const [updatingFolder, setUpdatingFolder] = useState<number | undefined>();
  const [selectedFolder, setSelectedFolder] = useState<number | undefined>(
    undefined
  );

  return (
    <FoldersContext.Provider
      value={{ selectedFolder, setSelectedFolder, updatingFolder, setUpdatingFolder }}
    >
      {children}
    </FoldersContext.Provider>
  );
}
