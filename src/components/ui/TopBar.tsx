import { useContext } from "react";
import { ReactSVG } from "react-svg";
import "./ui.scss";
import { handleSideMenu } from "@/utils/globalMethods";
import SvgButton from "./SvgButton";
import { ScreenSizeContext } from "@/contexts/screenSizeContext";
import { UserContext } from "@/contexts/userContext";

export default function TopBar() {
  const userContext = useContext(UserContext);
  const screenSizeContext = useContext(ScreenSizeContext);

  return (
    <div className="topBar">
      <SvgButton
        fileName="hamburgerMenu"
        onClick={() => {
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
        onClick={() => {
          localStorage.clear();
          userContext?.setUser(null);
        }}
      />
    </div>
  );
}
