import React from "react";
import './style.scss';

interface GeneralModalProps {
  children: React.ReactNode
}

export default function GeneralModal(props: GeneralModalProps) {

  return <div className="generalModal">{props.children}</div>;
}
