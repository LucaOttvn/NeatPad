import { effect, signal } from "@preact/signals-react";
import { SideMenusNames } from "./interfaces";
import { handleSideMenu } from "./globalMethods";

export const selectedSideMenu = signal<SideMenusNames | undefined>(undefined);

effect(() => {
    handleSideMenu(selectedSideMenu.value || null);
});

export const isMobile = signal(false);

effect(() => {
    function checkScreenSize() {
        isMobile.value = window.innerWidth < 768
    }

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
})