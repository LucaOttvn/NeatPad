import React from "react";
import SvgButton from "../../SvgButton";
import { handleModal } from "@/utils/globalMethods";

interface BasicComponentProps {
    onCloseCallback?: () => void;
    modalId: string
}

export default function GeneralModalHeader(props: BasicComponentProps) {
  return (
    <header>
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
