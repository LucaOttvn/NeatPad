import React from "react";
import "./ui.scss";
import { handleModal } from "@/utils/globalMethods";

interface GeneralModalProps {
  children: React.ReactNode;
  width: number;
  height: number;
}

export default function GeneralModal(props: GeneralModalProps) {
  const width = props.width + "%";
  const height = props.height + "%";
  return (
    <div
      className="generalModalBackdrop"
      onClick={() => {
        handleModal();
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
