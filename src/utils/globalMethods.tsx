import { gsap, Power4 } from "gsap";

let isModalOpen = false;
let isSideMenuOpen = false;

export function handleModal() {
  gsap.to(".generalModalBackdrop", {
    scale: isModalOpen ? 0 : 1,
    duration: 0.2,
    ease: Power4.easeOut,
  })
  isModalOpen = !isModalOpen;
}

export function handleSideMenu() {
  gsap.to(".generalSideMenu", {
    width: isSideMenuOpen ? 0 : "17rem",
    duration: 0.2,
    ease: Power4.easeOut,
  });
  isSideMenuOpen = !isSideMenuOpen;
}
