import { useContext } from "react";
import "../componentsStyle.scss";
import SvgButton from "./SvgButton";
import { SideMenusContext } from "@/contexts/sideMenusContext";
import { ModalsNames, SideMenusNames } from "@/utils/interfaces";
import { ModalsContext } from "@/contexts/modalsContext";

export default function TopBar() {
  const sideMenusContext = useContext(SideMenusContext);
  const modalsContext = useContext(ModalsContext);

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
        fileName="settings"
        onClick={() => {
          modalsContext?.setSelectedModal(ModalsNames.settings)
          // logout
      
        }}
      />
    </div>
  );
}
