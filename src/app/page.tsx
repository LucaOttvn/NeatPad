
"use client";;
import TopBar from "@/components/ui/TopBar";
import { useContext, useEffect, useLayoutEffect } from "react";
import { ScaleLoader } from "react-spinners";
import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import NotesOverview from "@/components/notesOverview/NotesOverview";
import { User } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import Login from "@/components/Login";
import GeneralModal from "@/components/ui/modals/GeneralModal";
import { useSignals } from "@preact/signals-react/runtime";
import { isMobile, loading } from "@/utils/signals";
import { getUserById } from "@/db/user";
import NewNoteButton from "@/components/ui/NewNoteButton";
import GeneralSideMenu from "@/components/ui/SideMenu";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";

export default function Home() {
  useSignals()

  const setupStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setOverlaysWebView({ overlay: false });
      // You can also set style and background color if desired
      // await StatusBar.setStyle({ style: Style.Dark }); 
      // await StatusBar.setBackgroundColor({ color: '#FF0000' });
    }
  };

  useEffect(() => {
    setupStatusBar()
  }, []);

  const userContext = useContext(UserContext);

  useLayoutEffect(() => {
    function checkScreenSize() {
      isMobile.value = window.innerWidth < 768
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [])

  useEffect(() => {
    loading.value = true
    const token = localStorage.getItem('JWT');

    async function verifyToken() {
      try {
        if (token) {
          const response = await fetch('/api/verifyToken', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const user: User = await getUserById(data.userId)
            if (user) userContext?.setUser(user)
          } else {
            localStorage.removeItem('JWT');
            userContext?.setUser(undefined);
          }
        } else {
          userContext?.setUser(undefined);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('JWT');
        userContext?.setUser(undefined);
      } finally {
        loading.value = false
      }
    };

    verifyToken();
  }, []);

  return (
    <>
      {loading.value && <div className="loader">
        <ScaleLoader color={"white"} loading={true} />
      </div>}

      {userContext?.user &&
        <AnimatedDiv className="appContainer w-full h-full flex start">
          <TopBar />
          <div className="w-full h-full flex" style={{ marginTop: "8rem" }}>
            <GeneralSideMenu />
            <NotesOverview />
          </div>
          <NewNoteButton />
        </AnimatedDiv>}
      {!userContext?.user && <Login />}
      <GeneralModal />
    </>
  );
}
