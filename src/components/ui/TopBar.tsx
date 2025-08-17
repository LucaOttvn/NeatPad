import "../componentsStyle.scss";
import InstallPWASection from "../InstallPwaSection";
import SvgButton from "./buttons/SvgButton";
import { ModalsNames, SideMenusNames } from "@/utils/interfaces";
import { selectedModal, selectedSideMenu } from "@/utils/signals";


export default function TopBar() {
  return (
    <div className="topBar">
      <div className="flex items-center gap-3">
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
      </div>

      <div className="flex items-center gap-5">
        <InstallPWASection />
        <SvgButton
          fileName="settings"
          onClick={() => {
            selectedModal.value = ModalsNames.settings
          }}
        />
      </div>
    </div>
  );
}
