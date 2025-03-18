import { useContext } from "react";
import { ReactSVG } from "react-svg";
import "./ui.scss";
import { handleSideMenu } from "@/utils/globalMethods";
import { ScreenSizeContext, UserContext } from "@/utils/contexts";
import SvgButton from "./SvgButton";

export default function TopBar() {
  const userContext = useContext(UserContext);
  const screenSizeContext = useContext(ScreenSizeContext);

  return (
    <div className="topBar">
      <SvgButton
        fileName="hamburgerMenu"
        callback={() => {
          handleSideMenu(screenSizeContext);
        }}
      />
      <div className="logo start gap-2">
        <h1>NeatPad</h1>
        <ReactSVG src="/icons/edit.svg" className="icon" />
      </div>
      {/* spacer */}
      <div className="w-full"></div>
      <SvgButton
        fileName="logout"
        callback={() => {
          localStorage.clear();
          userContext?.setUser(null);
        }}
      />
    </div>
  );
}
