
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
import { App } from '@capacitor/app';

export default function Home() {
  useSignals()

  const setupStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  };

  useEffect(() => {
    setupStatusBar()

    App.addListener('backButton', ({ canGoBack }) => {
      alert('Back button pressed!');

      // 'canGoBack' indicates if there's a history entry to go back to in the webview
      // This is useful if you want to navigate back in your internal app history
      // rather than letting the webview handle it, or exit the app.

      if (canGoBack) {
        // If there's webview history, you might want to navigate back
        // or handle it according to your app's navigation logic.
        // window.history.back(); // This would go back in the webview history
        alert('Can go back in webview history.');
      } else {
        // If there's no webview history, this might be the last page,
        // so you could confirm exit or perform another action.
        alert('Cannot go back in webview history. Considering app exit or custom action.');
        // Example: Confirm app exit
        if (confirm('Are you sure you want to exit the app?')) {
          App.exitApp();
        }
      }
    });
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
