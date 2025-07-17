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
        folderCards.forEach((folder, folderIndex) => {
          const folderTop = folder.getBoundingClientRect().top
          const folderH = folder.getBoundingClientRect().height

          const distanceFromTop = folderTop - foldersList.getBoundingClientRect().top
          console.log(folderH)

          // const windowBottom = window.innerHeight + window.scrollY;
          // const foldersListMiddlePoint = (windowBottom - foldersList.getBoundingClientRect().height) / 2
          // console.log(foldersListMiddlePoint);

          gsap.set('#' + folder.id, {
            // scale: folderH
            // top: `calc(8rem * ${folderIndex})`,
            // scale: 
            opacity: ''
          });
        })
        // foldersList.addEventListener('scroll', () => {
        //   folderCards.forEach((folder, folderIndex) => {
        //     const folderCardMiddleYPoint = folder.getBoundingClientRect().top + folder.getBoundingClientRect().height / 2;
        //   })
        // })
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
