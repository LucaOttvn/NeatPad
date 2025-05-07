
import { deleteNote, updateNote } from "@/api/notes";
import { NotesContext } from "@/contexts/notesContext";
import { gsap, Power4 } from "gsap";
import { useContext } from "react";

let isSideMenuOpen = false;

export function handleModal(
  target: string | undefined,
) {
  // if target is undefined close the generalBackdrop that stays behind each modal, in this way every modal in the app gets closed even without having a specific id to point to
  gsap.to((target ? "#" : '') + (target ?? '.generalModalBackdrop'), {
    scale: target != undefined ? 1 : 0,
    duration: 0.2,
    ease: Power4.easeOut,
  });
}

export function handleSideMenu(isMobile: boolean) {
  gsap.to(".generalSideMenu", {
    width: isSideMenuOpen ? 0 : (isMobile ? "100%" : "auto"),
    duration: 0.2,
    ease: Power4.easeOut,
  });
  isSideMenuOpen = !isSideMenuOpen;
}

export function animateDivUnmount(ids: string[], onComplete: () => void) {

  // this is a timeline because it can happen to animate more than one div at the same time, so wait for the whole timeline to be completed and then trigger the onComplete()
  const tl = gsap.timeline({ onComplete });

  ids.forEach((id) => {
    tl.to("#" + id, {
      opacity: 0,
      duration: 0.2,
      ease: Power4.easeOut
    }, 0); // all animations start at the same time
  });
}

