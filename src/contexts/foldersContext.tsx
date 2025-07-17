"use client";
import { Folder } from "@/utils/interfaces";
import { createContext, ReactNode, useState } from "react";

interface FolderContextType {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  selectedFolder: number | undefined;
  setSelectedFolder: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const FolderContext = createContext<FolderContextType | undefined>(
  undefined
);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | undefined>(
    undefined
  );

  return (
    <FolderContext.Provider
      value={{ folders, setFolders, selectedFolder, setSelectedFolder }}
    >
      {children}
    </FolderContext.Provider>
  );
}
