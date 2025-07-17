import { useContext, useEffect, useState } from "react";
import "../componentsStyle.scss";
import { handleSideMenu } from "@/utils/globalMethods";
import SvgButton from "./SvgButton";
import { ScreenSizeContext } from "@/contexts/screenSizeContext";
import { UserContext } from "@/contexts/userContext";

export default function TopBar() {
  const userContext = useContext(UserContext);
  const screenSizeContext = useContext(ScreenSizeContext);

  const [openingSideMenu, setOpeningSideMenu] = useState(false)

  useEffect(() => {
    handleSideMenu(openingSideMenu, screenSizeContext);
  }, [openingSideMenu]);

  return (
    <div className="topBar">
      <SvgButton
        fileName="close"
        style={{display: openingSideMenu ? '' : 'none'}}
        onClick={() => {
          setOpeningSideMenu(!openingSideMenu)
        }}
      />
      <SvgButton
        fileName="hamburgerMenu"
        style={{display: openingSideMenu ? 'none' : ''}}
        onClick={() => {
          setOpeningSideMenu(!openingSideMenu)
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
