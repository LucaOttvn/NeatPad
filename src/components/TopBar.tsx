import React from "react";
import Image from "next/image";
import { ReactSVG } from "react-svg";
import "./style.scss";

interface TopBarProps {}

export default function TopBar(props: TopBarProps) {
  return (
    <header className="topBar">
      <ReactSVG
        src="/icons/hamburgerMenu.svg"
        className="icon"
      />
    </header>
  );
}
