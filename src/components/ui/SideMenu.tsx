import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { FoldersContext } from "@/contexts/foldersContext";
import SvgButton from "./SvgButton";
import FolderCard from "../FolderCard";
import { ModalsNames } from "@/utils/interfaces";
import { folders, isMobile, selectedModal, selectedSideMenu } from "@/utils/signals";
import { handleSideMenu } from "@/utils/globalMethods";

export default function GeneralSideMenu() {
  const foldersContext = useContext(FoldersContext);
  const foldersListRef = useRef<HTMLDivElement | null>(null);

  // check README.md > ## SIDE EFFECTS FOR DOM SIGNALS for details
  useLayoutEffect(() => {
    handleSideMenu(selectedSideMenu.value, isMobile.value)
  }, [selectedSideMenu.value])

  useEffect(() => {
    const foundIndex = folders.value.findIndex(el => el.id == foldersContext!.selectedFolder);
    const target = document.getElementById('folder' + foundIndex);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      console.warn(`Element 'folder${foundIndex}' not found. Ensure it's rendered and the ID is correct.`);
    }
  }, [foldersContext?.selectedFolder]);

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
        {folders.value.length! > 0 && folders.value.map((folder, index) => (
          <FolderCard key={`${folder.name}-${index}`} index={index} folder={folder} />
        ))}
        {folders.value.length! == 0 && <span style={{ textWrap: 'nowrap' }}>You haven't created any folder yet</span>}
      </div>
    </div>
  );
}
