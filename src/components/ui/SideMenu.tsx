import { Folder } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import FolderCard from "../FolderCard";

export default function GeneralSideMenu() {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    setFolders([
      { id: 1, name: "Music", colors: {mainColor: 'var(--red)', shadow: 'var(--darkRed)' }},
      { id: 2, name: "Groceries", colors: {mainColor: 'var(--yellow)', shadow: 'var(--darkYellow)' }},
      { id: 3, name: "Shopping", colors: {mainColor: 'var(--green)', shadow: 'var(--darkGreen)' }},
      { id: 4, name: "Gaming", colors: {mainColor: 'var(--blue)', shadow: 'var(--darkBlue)' }},
      { id: 5, name: "Todo", colors: {mainColor: 'var(--purple)', shadow: 'var(--darkPurple)' }},
      { id: 6, name: "Reminders", colors: {mainColor: 'var(--brown)', shadow: 'var(--darkBrown)' }},
      { id: 7, name: "Gifts", colors: {mainColor: 'var(--orange)', shadow: 'var(--darkOrange)' }}
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
