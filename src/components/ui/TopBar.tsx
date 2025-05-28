import "../componentsStyle.scss";
import SvgButton from "./SvgButton";
import { ModalsNames, SideMenusNames } from "@/utils/interfaces";
import { selectedModal, selectedSideMenu } from "@/utils/signals";


export default function TopBar() {
  return (
    <div className="topBar">

      <SvgButton
        fileName="close"
        style={{ display: selectedSideMenu.value == SideMenusNames.folders ? '' : 'none' }}
        onClick={() => {
          selectedSideMenu.value = undefined;
        }}
      />
      <SvgButton
        fileName="hamburgerMenu"
        style={{ display: selectedSideMenu.value == SideMenusNames.folders ? 'none' : '' }}
        onClick={() => {
          selectedSideMenu.value = SideMenusNames.folders;
        }}
      />


      <h1 style={{ letterSpacing: '1px' }}>NeatPad</h1>
      <div className="w-full"></div>
      <SvgButton
        fileName="settings"
        onClick={() => {
          selectedModal.value = ModalsNames.settings
        }}
      />
    </div>
  );
}
