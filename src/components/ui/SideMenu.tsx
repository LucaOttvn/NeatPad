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
      if (foldersList) {

        const foldersListMiddleY = (foldersList.getBoundingClientRect().bottom - foldersList.getBoundingClientRect().top) / 2

        folderCards.forEach((folder, folderIndex) => {

          const folderMiddlePoint = (folder.getBoundingClientRect().bottom - folder.getBoundingClientRect().top) / 2

          
          let distanceFromCenter
          if (folderMiddlePoint > foldersListMiddleY) {
            
            // (foldersList.getBoundingClientRect().height / 2 ) Math.round(distanceFromCenter)
          } else {
            distanceFromCenter = folderMiddlePoint - foldersListMiddleY
            const pxScaleFactor = 100 / folderMiddlePoint
            console.log(distanceFromCenter * pxScaleFactor)
            gsap.set('#' + folder.id, {
              scale: distanceFromCenter * pxScaleFactor
              // top: `calc(8rem * ${folderIndex})`,
              // scale: 
              // opacity: ''
            });
            distanceFromCenter = foldersListMiddleY - folderMiddlePoint
          }




        })
      }
    }, 1000);
  }, []);

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
        {foldersContext?.folders.map((folder, index) => {
          return <FolderCard key={folder.name + index} index={index} folder={folder} />;
        })}
      </div>
    </div>
  );
}
