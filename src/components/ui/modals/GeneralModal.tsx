import React, { useEffect } from "react";
import ".././ui.scss";
import { handleModal } from "@/utils/globalMethods";

interface GeneralModalProps {
  children: React.ReactNode;
  id: string;
  width?: number;
  height?: number;
  onCloseCallback?: () => void;
}

export default function GeneralModal(props: GeneralModalProps) {
  const width = props.width ? props.width + "%" : '';
  const height = props.height + "%";

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      // this removes the automatic browser's focus on the button when esc is pressed
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      if (props.onCloseCallback) props.onCloseCallback();
      handleModal(false);
    }
  }
  
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  return (
    <div
      id={props.id}
      className="generalModalBackdrop"
      onClick={() => {
        if (props.onCloseCallback) props.onCloseCallback();
        handleModal(false, props.id);
      }}
    >
      <div
        className="generalModal"
        style={{ width, height }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
