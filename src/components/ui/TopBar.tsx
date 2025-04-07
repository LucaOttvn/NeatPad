import { useContext } from "react";
import "../componentsStyle.scss";
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

      <h1 style={{letterSpacing: '1px'}}>NeatPad</h1>
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
