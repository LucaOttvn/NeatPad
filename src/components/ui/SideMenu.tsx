import { ModalsNames } from "@/utils/interfaces";
import { useContext } from "react";

import { handleModal, handleSideMenu } from "@/utils/globalMethods";
import { FoldersContext } from "@/contexts/foldersContext";
import SvgButton from "./SvgButton";
import FolderCard from "../FolderCard";

export default function GeneralSideMenu() {
  const foldersContext = useContext(FoldersContext);

  return (
    <div className="generalSideMenu">

      <span className="title ms-5">Folders</span>

      <div className="start gap-">
        <div className="sideMenuBtn" onClick={() => {
          foldersContext?.setSelectedFolder(undefined)
          handleSideMenu(false)
        }} >
          <SvgButton fileName="home" onClick={() => { }} />
        </div>
        <div className="sideMenuBtn" onClick={() => {
          handleModal(true, ModalsNames.createFolder);
        }} >
          <SvgButton fileName="plus" onClick={() => { }} />
        </div>
      </div>

      <div className="foldersList">
        <div className="shaderTop"></div>
        <div className="shaderBottom"></div>
        <div className="w-full h-full flex flex-col gap-5 py-8 bg-transparent overflow-y-scroll">
          {foldersContext?.folders.map((folder, index) => {
            return <FolderCard key={folder.name + index} folder={folder} />;
          })}
        </div>
      </div>
    </div>
  );
}
