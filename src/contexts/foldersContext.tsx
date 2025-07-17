"use client";
import { getFolders } from "@/api/folders";
import { Folder } from "@/utils/interfaces";
import { createContext, ReactNode, useEffect, useState } from "react";

interface FoldersContextType {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  selectedFolder: number | undefined;
  setSelectedFolder: React.Dispatch<React.SetStateAction<number | undefined>>;
  updatingFolder: number | undefined
  setUpdatingFolder: (noteId: number | undefined) => void;
  updateFolderState: (id: number, folder: Partial<Folder>) => void;
}

export const FoldersContext = createContext<FoldersContextType | undefined>(
  undefined
);

export function FolderProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [updatingFolder, setUpdatingFolder] = useState<number | undefined>();
  const [selectedFolder, setSelectedFolder] = useState<number | undefined>(
    undefined
  );

  function updateFolderState(id: number, folder: Partial<Folder>) {
    setFolders(prevState =>
      prevState.map((el) =>
        el.id === id
          ? { ...el, name: folder.name!, color: folder.color }
          : el
      )
    );
  }

  return (
    <FoldersContext.Provider
      value={{ folders, setFolders, selectedFolder, setSelectedFolder, updatingFolder, setUpdatingFolder, updateFolderState }}
    >
      {children}
    </FoldersContext.Provider>
  );
}
