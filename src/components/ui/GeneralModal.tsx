import React from "react";
import "./ui.scss";
import { handleModal } from "@/utils/globalMethods";

interface GeneralModalProps {
  children: React.ReactNode;
}

export default function GeneralModal(props: GeneralModalProps) {
  return (
    <div
      className="generalModalBackdrop"
      onClick={() => {
        handleModal();
      }}
    >
      <div
        className="generalModal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
