import { ModalsNames } from "@/utils/interfaces";
import { useContext } from "react";
import FolderCard from "../FolderCard";
import { handleModal } from "@/utils/globalMethods";
import { FoldersContext } from "@/contexts/foldersContext";

export default function GeneralSideMenu() {
  const foldersContext = useContext(FoldersContext);

  return (
    <div className="generalSideMenu">
      <span className="title ms-5">Folders</span>
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
