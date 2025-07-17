import { Folder } from "@/utils/interfaces";
import React, { useState } from "react";
import FolderCard from "../FolderCard";

export default function GeneralSideMenu() {
  const [folders, setFolders] = useState<Folder[]>([
    { id: 1, name: "Music" },
    { id: 2, name: "Groceries" },
    { id: 3, name: "Shopping" },
  ]);
  return (
    <div className="generalSideMenu">
      <div className="m-8 mt-14 flex flex-col gap-5">
        <h1 className="title">Folders</h1>
        <div className="flex flex-col">
          {folders.map((folder) => {
            return <FolderCard key={folder.id} folder={folder} />;
          })}
        </div>
      </div>
    </div>
  );
}
