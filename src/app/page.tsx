"use client";
import GeneralModal from "@/components/ui/GeneralModal";
import NoteEditor from "@/components/noteEditor/NoteEditor";
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
import { Note } from "@/utils/interfaces";

export default function Home() {
  const userContext = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  let notes: Note[] = [
    { id: 12735, state: 0, text: "Uova, latte, cereali, pasta, pane", title: "Lista spesa" },
    { id: 43525, state: 0, text: "Test text2", title: "Test title2" },
    { id: 34255, state: 0, text: "Test text3", title: "Test title3" },
    { id: 23535, state: 0, text: "Test text4", title: "Test title4" },
  ];

  useEffect(() => {
    (async () => {
      const user = await getUser();
      await getUser();
      setIsLoading(false);
      if (userContext) {
        userContext.setUser(user);
      }
    })();
  });

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
            <NotesOverview notes={notes} />
          </div>
          <GeneralModal width={80} height={80}>
            <NoteEditor />
          </GeneralModal>
          <button
            className="addBtn"
            style={{ borderRadius: "50%" }}
            onClick={() => {
              handleModal(true);
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
