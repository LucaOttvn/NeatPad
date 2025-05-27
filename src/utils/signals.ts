import { effect, signal } from "@preact/signals-react";
import { SideMenusNames } from "./interfaces";
import { handleSideMenu } from "./globalMethods";

export const selectedSideMenu = signal<SideMenusNames | undefined>(undefined);

effect(() => {
    handleSideMenu(selectedSideMenu.value || null);
});