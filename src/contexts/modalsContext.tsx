"use client";
import { handleModal } from "@/utils/globalMethods";
import { createContext, ReactNode, useEffect, useState } from "react";

interface ModalContextType {
    setSelectedModal: (ModalName: string | undefined) => void;
    selectedModal: string | undefined;
}

export const ModalsContext = createContext<ModalContextType | undefined>(
    undefined
);

export function ModalsProvider({ children }: { children: ReactNode }) {
    const [selectedModal, setSelectedModal] = useState<string | undefined>(undefined);

    useEffect(() => {
        handleModal(selectedModal);
    }, [selectedModal]);

    return (
        <ModalsContext.Provider
            value={{ selectedModal, setSelectedModal }}
        >
            {children}
        </ModalsContext.Provider>
    );
}
