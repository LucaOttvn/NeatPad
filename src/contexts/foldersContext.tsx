"use client";
import { Folder } from "@/utils/interfaces";
import { createContext, ReactNode, useState } from "react";

interface FolderContextType {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
}

export const FolderContext = createContext<FolderContextType | undefined>(
  undefined
);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);

  return (
    <FolderContext.Provider value={{ folders, setFolders }}>
      {children}
    </FolderContext.Provider>
  );
}
