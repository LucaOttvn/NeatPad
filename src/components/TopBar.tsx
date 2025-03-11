import React from "react";
import { ReactSVG } from "react-svg";
import "./style.scss";
import { handleSideMenu } from "@/utils/globalMethods";

interface TopBarProps {}

export default function TopBar(props: TopBarProps) {
  return (
    <div className="topBar">
      <ReactSVG src="/icons/hamburgerMenu.svg" className="iconBtn" onClick={()=>{
        handleSideMenu()
      }}/>
      <div className="logo start gap-2">
        <h1>NeatPad</h1>
        <ReactSVG src="/icons/edit.svg" className="icon"/>
      </div>
    </div>
  );
}
