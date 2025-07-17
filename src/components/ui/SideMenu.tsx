import { ModalsNames } from "@/utils/interfaces";
import { useContext } from "react";
import FolderCard from "../FolderCard";
import { handleModal, handleSideMenu } from "@/utils/globalMethods";
import { FoldersContext } from "@/contexts/foldersContext";
import SvgButton from "./SvgButton";

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

      <div className="flex h-full justify-start flex-col mx-8 mt-5">
        {foldersContext?.folders.map((folder, index) => {
          return <FolderCard key={folder.name + index} folder={folder} />;
        })}
      </div>
    </div>
  );
}
