import React, { useContext } from "react";
import SvgButton from "../../SvgButton";
import { handleModal } from "@/utils/globalMethods";
import { ModalsContext } from "@/contexts/modalsContext";

interface BasicComponentProps {
  modalId: string
  className?: string
}

export default function GeneralModalHeader(props: BasicComponentProps) {

  const modalsContext = useContext(ModalsContext)
  return (
    <header className={`end p-5 ${props.className}`}>
      <SvgButton
        fileName="close"
        onClick={() => {
          modalsContext?.setSelectedModal(undefined)
        }}
      />
    </header>
  );
}
