import { signal } from "@preact/signals-react";
import { ModalsNames, SideMenusNames } from "./interfaces";

export const selectedSideMenu = signal<SideMenusNames | undefined>();
export const selectedModal = signal<ModalsNames | undefined>();
export const isMobile = signal(false);
export const loading = signal(false);
