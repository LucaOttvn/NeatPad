"use client";;
import GeneralSideMenu from "@/components/ui/SideMenu";
import TopBar from "@/components/ui/TopBar";
import { handleModal } from "@/utils/globalMethods";
import Image from "next/image";
import { getUser } from "@/api/user";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/utils/contexts";
import { ScaleLoader } from "react-spinners";
import Login from "@/components/login/Login";
import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import NotesOverview from "@/components/notesOverview/NotesOverview";
import { ModalsNames } from "@/utils/interfaces";

export default function Home() {
  const userContext = useContext(UserContext);
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
        <AnimatedDiv className="w-full h-full">
          <TopBar />
          <div className="w-full h-full flex justify-start items-start">
            <GeneralSideMenu />
            <NotesOverview />
          </div>
          
          <button
            className="addBtn"
            style={{ borderRadius: "50%" }}
            onClick={() => {
              // createNote(userContext!.user!.id)
              handleModal(true, ModalsNames.newNote);
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
    </>
  );
}
