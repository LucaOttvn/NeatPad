import { effect, signal } from "@preact/signals-react";
import { ModalsNames, SideMenusNames } from "./interfaces";
import { handleModal, handleSideMenu } from "./globalMethods";

export const selectedSideMenu = signal<SideMenusNames | undefined>(undefined);
effect(() => {
    const id = selectedSideMenu.value;
    // schedule the GSAP call on the next paint tick:
    requestAnimationFrame(() => {
        handleSideMenu(id);
    });
});

export const selectedModal = signal<ModalsNames | undefined>();
effect(() => {
    const id = selectedModal.value;
    // schedule the GSAP call on the next paint tick:
    requestAnimationFrame(() => {
        handleModal(id);
    });

})


export const isMobile = signal(false);
effect(() => {
    function checkScreenSize() {
        isMobile.value = window.innerWidth < 768
    }

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
})
