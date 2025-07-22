import { signal } from "@preact/signals-react";
import { ModalsNames, Note, SideMenusNames } from "./interfaces";

export const selectedSideMenu = signal<SideMenusNames | undefined>();
export const selectedModal = signal<ModalsNames | undefined>();
export const notesToShow = signal<Note[]>([])
export const isMobile = signal(false);
export const loading = signal(true);
