"use client";;
import TopBar from "@/components/ui/TopBar";
import { handleModal } from "@/utils/globalMethods";
import Image from "next/image";
import { getUser } from "@/api/user";
import { useContext, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import NotesOverview from "@/components/notesOverview/NotesOverview";
import { ModalsNames } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import GeneralSideMenu from "@/components/ui/SideMenu";
import Login from "@/components/Login";
import { ModalsContext } from "@/contexts/modalsContext";
import GeneralModal from "@/components/ui/modals/GeneralModal";

export default function Home() {
  const userContext = useContext(UserContext);
  const modalsContext = useContext(ModalsContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setIsLoading(false);
      if (userContext) {
        userContext.setUser(user);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="loader">
        <ScaleLoader color={"white"} loading={true} />
      </div>
    );
  }

  return (
    <>
      {userContext?.user ? (
        <AnimatedDiv className="appContainer w-full h-full flex start">
          <TopBar />
          <div className="w-full h-full flex" style={{ marginTop: "8rem" }}>
            <GeneralSideMenu />
            <NotesOverview />
          </div>

          <button
            className="addBtn"
            style={{ borderRadius: "50%" }}
            onClick={() => {
              modalsContext?.setSelectedModal(ModalsNames.newNote)
            }}
          >
            <Image
              src="/icons/plus.svg"
              width={25}
              height={25}
              alt=""
              draggable={false}
            />
          </button>
        </AnimatedDiv>
      ) : (
        <Login></Login>
      )}
      <GeneralModal/>
    </>
  );
}
