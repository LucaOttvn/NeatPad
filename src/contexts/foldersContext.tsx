"use client";
import { getFolders } from "@/api/folders";
import { Folder } from "@/utils/interfaces";
import { createContext, ReactNode, useEffect, useState } from "react";

interface FoldersContextType {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  selectedFolder: number | undefined;
  setSelectedFolder: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const FoldersContext = createContext<FoldersContextType | undefined>(
  undefined
);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const fetchedfolders = await getFolders();
      setFolders(fetchedfolders || []);
    })();
  }, []);

  return (
    <FoldersContext.Provider
      value={{ folders, setFolders, selectedFolder, setSelectedFolder }}
    >
      {children}
    </FoldersContext.Provider>
  );
}
