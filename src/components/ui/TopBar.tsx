import React, { useContext } from "react";
import { ReactSVG } from "react-svg";
import "./ui.scss";
import { handleSideMenu } from "@/utils/globalMethods";
import { UserContext } from "@/utils/contexts";

export default function TopBar() {
    const userContext = useContext(UserContext);
  
  return (
    <div className="topBar">
      <ReactSVG src="/icons/hamburgerMenu.svg" className="iconBtn" onClick={()=>{
        handleSideMenu()
      }}/>
      <div className="logo start gap-2">
        <h1>NeatPad</h1>
        <ReactSVG src="/icons/edit.svg" className="icon"/>
      </div>
      <div className="w-full"></div>
      <ReactSVG src="/icons/logout.svg" className="iconBtn mr-1" onClick={()=>{
        localStorage.clear()
        userContext?.setUser(null)
      }}/>
    </div>
  );
}
