
import { gsap, Power4 } from "gsap";

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


export function animateDivUnmount (id: string) {
  gsap.to("#" + id, {
    // opacity: 0.2,
    border: 'solid 3px blue',
    duration: 0.2,
    ease: Power4.easeOut,
  });
}