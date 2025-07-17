import { Folder } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import FolderCard from "../FolderCard";

export default function GeneralSideMenu() {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    setFolders([
      { id: 1, name: "Music", color: "Red" },
      { id: 2, name: "Groceries", color: "Yellow" },
      { id: 3, name: "Shopping", color: "Green" },
      { id: 4, name: "Gaming", color: "Blue" },
      { id: 5, name: "Todo", color: "Purple" },
      { id: 6, name: "Reminders", color: "Brown" },
      { id: 7, name: "Gifts", color: "Orange" },
    ]);
  }, []);
  return (
    <div className="generalSideMenu">
      <div className="m-8 mt-10 flex flex-col gap-8">
        <div className="flex flex-col items-start">
          <span className="title ms-2">My</span>
          <span className="title ms-2">Folders</span>
        </div>

        <div className="flex flex-col">
          {folders.map((folder) => {
            return <FolderCard key={folder.id} folder={folder} />;
          })}
        </div>
      </div>
    </div>
  );
}
