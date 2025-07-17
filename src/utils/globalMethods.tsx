import {gsap, Power4} from "gsap";

let isModalOpen = false

export function handleModal() {
  gsap.to(".generalModalBackdrop", {
    scale: isModalOpen ? 0 : 1,
    duration: 0.2,
    ease: Power4.easeOut,
  });
  isModalOpen = !isModalOpen;
}
