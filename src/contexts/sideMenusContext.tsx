"use client";;
import { handleSideMenu } from "@/utils/globalMethods";
import { createContext, ReactNode, useEffect, useState } from "react";

interface SideMenusContextType {
    setSelectedSideMenu: (sideMenuName: string | undefined) => void;
    selectedSideMenu: string | undefined;
}

export const SideMenusContext = createContext<SideMenusContextType | undefined>(
    undefined
);

export function SideMenusProvider({ children }: { children: ReactNode }) {
    const [selectedSideMenu, setSelectedSideMenu] = useState<string | undefined>(undefined);

    useEffect(() => {
        handleSideMenu(selectedSideMenu);
    }, [selectedSideMenu]);

    return (
        <SideMenusContext.Provider
            value={{ selectedSideMenu, setSelectedSideMenu }}
        >
            {children}
        </SideMenusContext.Provider>
    );
}
