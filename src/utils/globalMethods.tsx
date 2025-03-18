import { gsap, Power4 } from "gsap";

let isSideMenuOpen = false;

export function handleModal(
  open: boolean,
  target?: string,
  onCloseCallback?: () => void
) {
  gsap.to(target ? "#" + target : ".generalModalBackdrop", {
    scale: open ? 1 : 0,
    duration: 0.2,
    ease: Power4.easeOut,
  });
  if (!open && onCloseCallback) {
    onCloseCallback()
  } 
}

export function handleSideMenu(isMobile: boolean) {
  gsap.to(".generalSideMenu", {
    width: isSideMenuOpen ? 0 : isMobile ? "100%" : "17rem",
    duration: 0.2,
    ease: Power4.easeOut,
  });
  isSideMenuOpen = !isSideMenuOpen;
}
