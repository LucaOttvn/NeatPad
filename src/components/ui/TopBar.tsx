import { useContext, useEffect, useState } from "react";
import "../componentsStyle.scss";
import { handleSideMenu } from "@/utils/globalMethods";
import SvgButton from "./SvgButton";
import { ScreenSizeContext } from "@/contexts/screenSizeContext";
import { UserContext } from "@/contexts/userContext";
import { SideMenusContext } from "@/contexts/sideMenusContext";
import { SideMenusNames } from "@/utils/interfaces";

export default function TopBar() {
  const userContext = useContext(UserContext);
  const screenSizeContext = useContext(ScreenSizeContext);
  const sideMenusContext = useContext(SideMenusContext);

  return (
    <div className="topBar">
      <SvgButton
        fileName="close"
        style={{ display: sideMenusContext?.selectedSideMenu == SideMenusNames.folders ? '' : 'none' }}
        onClick={() => {
          sideMenusContext?.setSelectedSideMenu(undefined)
        }}
      />
      <SvgButton
        fileName="hamburgerMenu"
        style={{ display: sideMenusContext?.selectedSideMenu == SideMenusNames.folders ? 'none' : '' }}
        onClick={() => {
          sideMenusContext?.setSelectedSideMenu(SideMenusNames.folders)
        }}
      />

      <h1 style={{ letterSpacing: '1px' }}>NeatPad</h1>
      {/* spacer */}
      <div className="w-full"></div>
      <SvgButton
        fileName="logout"
        onClick={() => {
          localStorage.clear();
          userContext?.setUser(null);
        }}
      />
    </div>
  );
}
