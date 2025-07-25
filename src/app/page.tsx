"use client";
import TopBar from "@/components/ui/TopBar";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import NotesOverview from "@/components/notesOverview/NotesOverview";
import { ModalsNames, SideMenusNames, User } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import Login from "@/components/Login";
import GeneralModal from "@/components/ui/modals/GeneralModal";
import { useSignals } from "@preact/signals-react/runtime";
import { isMobile, loading, selectedModal, selectedSideMenu } from "@/utils/signals";
import NewNoteButton from "@/components/ui/NewNoteButton";
import GeneralSideMenu from "@/components/ui/SideMenu";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import { App } from '@capacitor/app';
import { handleModal } from "@/utils/globalMethods";
import { FoldersContext } from "@/contexts/foldersContext";
import { getUserById } from "@/serverActions/usersActions";

const minSwipeDistance = 50

export default function Home() {
  useSignals()

  const touchStartX = useRef(0);
  const swipeRef = useRef<HTMLDivElement>(null);

  const foldersContext = useContext(FoldersContext)
  const userContext = useContext(UserContext);

  const setupStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  };

  const closeModal = () => {
    if (selectedModal.value == ModalsNames.folderHandler) foldersContext?.setUpdatingFolder(undefined)
  }

  useEffect(() => {
    setupStatusBar()

    // if the user clicks on the native back button close the current modal (if there's one) 
    App.addListener('backButton', () => {
      if (!selectedModal.value) return
      handleModal(undefined, closeModal)
    });

    // handle the swipe gesture to open the side menu
    if (!swipeRef.current) return;

    const handleTouchStart = (e: any) => {
      touchStartX.current = e.changedTouches[0].clientX;
    };

    const handleTouchEnd = (e: any) => {
      const touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX.current;

      if (swipeDistance > minSwipeDistance && !selectedSideMenu.value) {
        selectedSideMenu.value = SideMenusNames.folders
      } else if (swipeDistance < -minSwipeDistance && selectedSideMenu.value == SideMenusNames.folders) {
        selectedSideMenu.value = undefined
      }
    };

    swipeRef.current.addEventListener('touchstart', handleTouchStart);
    swipeRef.current.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (!swipeRef.current) return
      swipeRef.current.removeEventListener('touchstart', handleTouchStart);
      swipeRef.current.removeEventListener('touchend', handleTouchEnd);
    };
  }, [swipeRef.current]);


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
        if (!token) return userContext?.setUser(undefined);

        const response = await fetch('/api/verifyToken', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('JWT');
          return userContext?.setUser(undefined);
        }

        const data = await response.json();
        const user: User = await getUserById(data.userId)
        if (user) userContext?.setUser(user)
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
        <AnimatedDiv className="w-full h-full flex start">
          <TopBar />
          <div className="w-full h-full flex" style={{ paddingTop: "4rem" }} ref={swipeRef}>
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
