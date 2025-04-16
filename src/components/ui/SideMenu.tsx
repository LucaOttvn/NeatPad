import { ModalsNames } from "@/utils/interfaces";
import { useContext, useEffect } from "react";
import { handleModal, handleSideMenu } from "@/utils/globalMethods";
import { FoldersContext } from "@/contexts/foldersContext";
import SvgButton from "./SvgButton";
import FolderCard from "../FolderCard";
import gsap from 'gsap';

export default function GeneralSideMenu() {
  const foldersContext = useContext(FoldersContext)


  useEffect(() => {
    setTimeout(() => {
      const foldersList = document.querySelector('.foldersList')
      const folderCards = document.querySelectorAll('.folderCard')
      if (foldersList && folderCards) {
        calcScrollScaling(foldersList, folderCards)
        foldersList.addEventListener('scroll', () => {
          calcScrollScaling(foldersList, folderCards)
        });
      }
    }, 1000);
  }, []);

  function calcScrollScaling(foldersList: Element, folderCards: NodeListOf<Element>) {

    if (foldersList) {

      folderCards.forEach((folder) => {
        const folderCenter = folder.getBoundingClientRect().top + (folder.getBoundingClientRect().height / 2)
        const foldersListRect = foldersList.getBoundingClientRect()
        const distanceFromTop = folderCenter - foldersListRect.top
        const containerHeight = foldersListRect.bottom - foldersListRect.top

        let scaleFactor = Number((distanceFromTop / containerHeight).toFixed(4))

        if (scaleFactor <= 0.5) {
          gsap.to('#' + folder.id, {
            scale: scaleFactor / 0.5,
            opacity: scaleFactor / 0.5,
            duration: 0.2
          })
        } else {
          gsap.to('#' + folder.id, {
            scale: Math.abs(((scaleFactor - 0.5) / 0.5) - 1),
            opacity: Math.abs(((scaleFactor - 0.5) / 0.5) - 1),
            duration: 0.2
          })
        }
      })
    }
  }

  return (
    <div className="generalSideMenu">

      <span className="title" style={{fontSize: '380%'}}>Folders</span>

      <div className="center gap-10 pt-20 pb-10">
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
        {foldersContext?.folders.map((folder, index) => {
          return <FolderCard key={folder.name + index} index={index} folder={folder} />;
        })}
      </div>
    </div>
  );
}
