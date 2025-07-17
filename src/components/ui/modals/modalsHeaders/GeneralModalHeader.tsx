import React from "react";
import SvgButton from "../../SvgButton";
import { handleModal } from "@/utils/globalMethods";

interface BasicComponentProps {
    onCloseCallback?: () => void;
    modalId: string
    className?: string
}

export default function GeneralModalHeader(props: BasicComponentProps) {
  return (
    <header className={`end p-5 ${props.className}`}>
      <SvgButton
        fileName="close"
        onClick={() => {
          if (props.onCloseCallback) props.onCloseCallback();
          handleModal(false, props.modalId);
        }}
      />
    </header>
  );
}
