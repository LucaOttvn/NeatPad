import {gsap, Power4} from "gsap";

let isModalOpen = false

export function openModal() {
  gsap.to(".generalModal", {
    scale: isModalOpen ? 0 : 1,
    duration: 0.2,
    ease: Power4.easeOut,
  });
  isModalOpen = !isModalOpen;
}
