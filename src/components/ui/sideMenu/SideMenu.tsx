import { useEffect, useLayoutEffect, useRef } from "react";
import './sideMenu.scss';
import SvgButton from "../buttons/SvgButton";
import FolderCard from "../../FolderCard";
import { ModalsNames } from "@/utils/interfaces";
import { foldersToShow, isMobile, selectedFolder, selectedModal, selectedSideMenu } from "@/utils/signals";
import { handleSideMenu, updateNotesToShow } from "@/utils/globalMethods";
import { db } from "@/utils/db";

export default function GeneralSideMenu() {

  const foldersListRef = useRef<HTMLDivElement | null>(null);

  // check README.md > ## SIDE EFFECTS FOR DOM SIGNALS for details
  useLayoutEffect(() => {
    handleSideMenu(selectedSideMenu.value, isMobile.value)
  }, [selectedSideMenu.value])

  useEffect(() => {

    (async () => {
      const localNotes = await db.notes.toArray()
      updateNotesToShow(localNotes)
    })()

    const foundIndex = foldersToShow.value.findIndex(el => el.id == selectedFolder.value);
    const target = document.getElementById('folder' + foundIndex);

    if (!target) return

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }, [selectedFolder.value]);

  const goHome = () => {
    selectedFolder.value = undefined
    selectedSideMenu.value = undefined
  }

  return (
    <div id={selectedSideMenu.value} className="generalSideMenu">
      {/* the nowrap is to avoid the title to wrap during the side menu closure because it's not pleasant to see */}
      <span className="title center" style={{ fontSize: '380%', whiteSpace: 'nowrap' }}>Folders</span>

      <div className="center gap-10 pt-20 pb-10">
        <div
          className="sideMenuBtn"
          onClick={goHome}
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
        {foldersToShow.value.length! > 0 && foldersToShow.value.map((folder, index) => (
          <FolderCard key={`${folder.name}-${index}`} index={index} folder={folder} />
        ))}
        {foldersToShow.value.length! == 0 && <span style={{ textWrap: 'nowrap' }}>You haven't created any folder yet</span>}
      </div>
    </div>
  );
}
