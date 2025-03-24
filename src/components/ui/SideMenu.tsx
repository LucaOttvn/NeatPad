import { ModalsNames } from "@/utils/interfaces";
import { useContext, useEffect } from "react";
import FolderCard from "../FolderCard";
import { getFolders } from "@/api/folders";
import { handleModal } from "@/utils/globalMethods";
import { FolderContext } from "@/contexts/foldersContext";

export default function GeneralSideMenu() {
  const foldersContext = useContext(FolderContext);

  useEffect(() => {
    (async () => {
      const fetchedfolders = await getFolders();
      foldersContext?.setFolders(fetchedfolders || []);
    })();
  }, []);

  return (
    <div className="generalSideMenu">
      <div className="flex flex-col items-start ms-5">
        <span className="title">My</span>
        <span className="title">Folders</span>
      </div>
      <button
        className="mainBtn mb-5 ms-5"
        onClick={() => {
          handleModal(true, ModalsNames.createFolder);
        }}
      >
        Add folder
      </button>

      <div className="flex h-full justify-start flex-col mx-8">
        {foldersContext?.folders.map((folder, index) => {
          return <FolderCard key={folder.name + index} folder={folder} />;
        })}
      </div>
    </div>
  );
}
