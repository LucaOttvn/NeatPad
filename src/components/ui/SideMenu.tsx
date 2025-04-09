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

      folderCards.forEach((folder, i) => {
        const foldersListRect = foldersList.getBoundingClientRect()
        const folderRect = folder.getBoundingClientRect()
        const folderCenter = (folderRect.top + folderRect.bottom) / 2 
        const distanceFromTop = folderCenter - foldersListRect.top
        const containerHeight = foldersListRect.bottom - foldersListRect.top

        const foldersListMiddleY = foldersListRect.bottom - (foldersListRect.height / 2)
        // scaling percentage of a single px
        const opacityPxPercentage = (100 / foldersListMiddleY)
        gsap.set('.sign', {
          position: 'fixed',
          top: foldersListMiddleY,
          right: 0,
          background: 'red',
          width: 30,
          height: 2
        })

        if (folderCenter <= foldersListMiddleY) {
          if (i == folderCards.length - 1) console.log(' sopra')

          gsap.to('#' + folder.id, {
            opacity: (opacityPxPercentage * (folderCenter * 2)) / 100,
            duration: 0.2
          })
        }
        if (folderCenter > foldersListMiddleY) {
          if (i == folderCards.length - 1) console.log((opacityPxPercentage * (folderCenter * 2)) / 100)
          gsap.to('#' + folder.id, {
            opacity: (opacityPxPercentage * (folderCenter * 2)) / 100,
            duration: 0.2
          })
        }

        // let scaleFactor = Number((distanceFromTop / containerHeight).toFixed(4))

        // if (scaleFactor <= 0.5 && scaleFactor >= 0) {
        //   gsap.to('#' + folder.id, {
        //     opacity: scaleFactor / 0.5,
        //     duration: 0.2
        //   })
        // } 
        // if (scaleFactor > 0.5 && scaleFactor <= 1) {
        //   gsap.to('#' + folder.id, {
        //     opacity: Math.abs(((scaleFactor - 0.5) / 0.5) - 1),
        //     duration: 0.2
        //   })
        // }
      })
    }
  }

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
        <div className="sign"></div>
        {foldersContext?.folders.map((folder, index) => {
          return <FolderCard key={folder.name + index} index={index} folder={folder} />;
        })}
      </div>
    </div>
  );
}
