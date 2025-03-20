import { Folder } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import FolderCard from "../FolderCard";

export default function GeneralSideMenu() {
  const [folders, setFolders] = useState<Folder[]>([
    
  ]);

  useEffect(() => {
    setFolders([{ id: 1, name: "Music" },
      { id: 2, name: "Groceries" },
      { id: 3, name: "Shopping" },])
  }, []);
  return (
    <div className="generalSideMenu">
      <div className="m-8 mt-10 flex flex-col gap-5">
        <span className="title">Folders</span>
        <div className="flex flex-col">
          {folders.map((folder) => {
            return <FolderCard key={folder.id} folder={folder} />;
          })}
        </div>
      </div>
    </div>
  );
}
