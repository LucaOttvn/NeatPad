import React, { useContext } from "react";
import SvgButton from "../../SvgButton";
import { handleModal } from "@/utils/globalMethods";
import { ModalsContext } from "@/contexts/modalsContext";

interface BasicComponentProps {
  onCloseCallback?: () => void;
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
          if (props.onCloseCallback) props.onCloseCallback();
          modalsContext?.setSelectedModal(undefined)
        }}
      />
    </header>
  );
}
