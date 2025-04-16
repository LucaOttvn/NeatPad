import { useContext, useLayoutEffect, useRef } from "react";
import { handleModal, handleSideMenu } from "@/utils/globalMethods";
import { ModalsNames } from "@/utils/interfaces";
import { FoldersContext } from "@/contexts/foldersContext";
import SvgButton from "./SvgButton";
import FolderCard from "../FolderCard";
import gsap from 'gsap';

export default function GeneralSideMenu() {
  const foldersContext = useContext(FoldersContext);
  const foldersListRef = useRef<HTMLDivElement | null>(null);

  // this hook is needed because the folder cards list has to be fully rendered before being manipulated
  useLayoutEffect(() => {
    const foldersList = foldersListRef.current;
    if (!foldersList) return;

    let folderCards = foldersList.querySelectorAll('.folderCard');

    function calcScrollScaling() {
      folderCards.forEach((folder) => {
        const folderRect = folder.getBoundingClientRect();
        const folderCenter = folderRect.top + (folderRect.height / 2);
        const listRect = foldersList!.getBoundingClientRect();
        const distanceFromTop = folderCenter - listRect.top;
        const containerHeight = listRect.height;
        const scaleFactor = Number((distanceFromTop / containerHeight).toFixed(4));

        if (scaleFactor <= 0.5) {
          gsap.to('#' + folder.id, {
            scale: scaleFactor / 0.5,
            opacity: scaleFactor / 0.5,
            duration: 0.2
          });
        } else {
          gsap.to('#' + folder.id, {
            scale: Math.abs(((scaleFactor - 0.5) / 0.5) - 1),
            opacity: Math.abs(((scaleFactor - 0.5) / 0.5) - 1),
            duration: 0.2
          });
        }
      });
    }

    // initial calculation
    calcScrollScaling();

    foldersList.addEventListener('scroll', calcScrollScaling);

    return () => {
      foldersList.removeEventListener('scroll', calcScrollScaling);
    };
  }, [foldersContext?.folders]);

  return (
    <div className="generalSideMenu">
      <span className="title" style={{ fontSize: '380%' }}>Folders</span>

      <div className="center gap-10 pt-20 pb-10">
        <div
          className="sideMenuBtn"
          onClick={() => {
            foldersContext?.setSelectedFolder(undefined);
            handleSideMenu(false);
          }}
        >
          <SvgButton fileName="home" onClick={() => { }} />
        </div>
        <div
          className="sideMenuBtn"
          onClick={() => {
            handleModal(true, ModalsNames.createFolder);
          }}
        >
          <SvgButton fileName="plus" onClick={() => { }} />
        </div>
      </div>

      <div className="foldersList" ref={foldersListRef}>
        {foldersContext?.folders.map((folder, index) => (
          <FolderCard key={`${folder.name}-${index}`} index={index} folder={folder} />
        ))}
      </div>
    </div>
  );
}
