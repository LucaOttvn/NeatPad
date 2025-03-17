import React from "react";
import "./ui.scss";
import { handleModal } from "@/utils/globalMethods";

interface GeneralModalProps {
  children: React.ReactNode;
  width: number;
  height: number;
}

export default function GeneralModal(props: GeneralModalProps) {
  let width = props.width + "%";
  let height = props.height + "%";
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
