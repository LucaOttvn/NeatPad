import { effect, signal } from "@preact/signals-react";
import { Folder, ModalsNames, Note, SideMenusNames, User } from "./interfaces";

export const selectedSideMenu = signal<SideMenusNames | undefined>();
export const selectedModal = signal<ModalsNames | undefined>();
export const isMobile = signal(false);
export const loading = signal(false);

// notes signals
export const notesToShow = signal<Note[]>([])
export const notesToDelete = signal<number[]>([])
export const selectedNote = signal<number | undefined>()

// folders signals
export const foldersToShow = signal<Folder[]>([])
export const updatingFolder = signal<number | undefined>()
export const selectedFolder = signal<number | undefined>()

export const user = signal<User | undefined>()

export const isAppInstallable = signal<any>()
export const alreadyInstalledApp = signal(false)