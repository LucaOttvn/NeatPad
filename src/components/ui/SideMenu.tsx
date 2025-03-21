import { Folder } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import FolderCard from "../FolderCard";
import { getFolders } from "@/api/folders";

export default function GeneralSideMenu() {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedfolders = await getFolders();
      if (fetchedfolders) setFolders(fetchedfolders);
    })();
  }, []);

  // useEffect(() => {
  //   setFolders([
  //     { id: 1, name: "Music", color: "Red", notes: [] },
  //     { id: 2, name: "Groceries", color: "Yellow", notes: [] },
  //     { id: 3, name: "Shopping", color: "Green", notes: [] },
  //     { id: 4, name: "Gaming", color: "Blue", notes: [] },
  //     { id: 5, name: "Todo", color: "Purple", notes: [] },
  //     { id: 6, name: "Reminders", color: "Brown", notes: [] },
  //     { id: 7, name: "Gifts", color: "Orange", notes: [] },
  //     { id: 8, name: "Gifts", notes: [] },
  //   ]);
  // }, []);
  return (
    <div className="generalSideMenu">
      <div className="h-full m-8 mt-10 flex flex-col gap-8">
        <div className="flex flex-col items-start">
          <span className="title ms-2">My</span>
          <span className="title ms-2">Folders</span>
        </div>
        <button className="mainBtn mb-5">Add folder</button>

        <div className="flex flex-col">
          {folders.map((folder) => {
            return <FolderCard key={folder.id} folder={folder} />;
          })}
        </div>
      </div>
    </div>
  );
}
