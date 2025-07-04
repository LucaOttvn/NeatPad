import { useContext, useLayoutEffect, useRef } from "react";
import { FoldersContext } from "@/contexts/foldersContext";
import SvgButton from "./SvgButton";
import FolderCard from "../FolderCard";
import { ModalsNames } from "@/utils/interfaces";
import { isMobile, selectedModal, selectedSideMenu } from "@/utils/signals";
import { handleSideMenu } from "@/utils/globalMethods";


export default function GeneralSideMenu() {
  const foldersContext = useContext(FoldersContext);
  const foldersListRef = useRef<HTMLDivElement | null>(null);

  // check README.md > ## SIDE EFFECTS FOR DOM SIGNALS for details
  useLayoutEffect(()=>{
    handleSideMenu(selectedSideMenu.value, isMobile.value)
  }, [selectedSideMenu.value])

  return (
    <div id={selectedSideMenu.value} className="generalSideMenu">
      <span className="title center" style={{ fontSize: '380%' }}>Folders</span>

      <div className="center gap-10 pt-20 pb-10">
        <div
          className="sideMenuBtn"
          onClick={() => {
            foldersContext?.setSelectedFolder(undefined);
            selectedSideMenu.value = undefined
          }}
        >
          <SvgButton fileName="home" onClick={() => { }} />
        </div>
        <div
          className="sideMenuBtn"
          onClick={() => {
            selectedModal.value = ModalsNames.folderHandler
          }}
        >
          <SvgButton fileName="plus" onClick={() => { }} />
        </div>
      </div>

      <div className="foldersList" ref={foldersListRef}>
        {foldersContext?.folders.length! > 0 && foldersContext?.folders.map((folder, index) => (
          <FolderCard key={`${folder.name}-${index}`} index={index} folder={folder} />
        ))}
        {foldersContext?.folders.length! == 0 && <span style={{textWrap: 'nowrap'}}>You haven't created any folder yet</span>}
      </div>
    </div>
  );
}
