"use client";;
import TopBar from "@/components/ui/TopBar";
import { handleModal } from "@/utils/globalMethods";
import Image from "next/image";
import { getUser } from "@/api/user";
import { useContext, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import NotesOverview from "@/components/notesOverview/NotesOverview";
import { ModalsNames, Note } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import GeneralSideMenu from "@/components/ui/SideMenu";
import Login from "@/components/Login";
import { ModalsContext } from "@/contexts/modalsContext";
import GeneralModal from "@/components/ui/modals/GeneralModal";
import { createNote } from "@/api/notes";
import { NotesContext } from "@/contexts/notesContext";
import { flushSync } from "react-dom";

export default function Home() {
  const userContext = useContext(UserContext);
  const notesContext = useContext(NotesContext);
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

  // when the user clicks on the plus button, the createNote() gets triggered, this happens because the NoteEditor component needs a note with an already existing id because it's supposed to edit notes, not creating new ones (as you can guess from the name)
  async function openNewNoteModal() {
    const newNote: Note = {
      user: userContext!.user!.id,
      title: '',
      text: '',
      last_update: new Date(),
      pinned: false
    }
    let newNoteFromDB = await createNote(newNote)
    if (newNoteFromDB) {
      if (!notesContext) return null
      let arr = [...notesContext.notes, newNoteFromDB]
      // React batch states updates by default but, since the
      flushSync(() => {
        notesContext.setNotes(arr)
        notesContext.setSelectedNote(newNoteFromDB.id)
      })
      modalsContext!.setSelectedModal(ModalsNames.newNote)
    }
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
              openNewNoteModal()
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
      <GeneralModal />
    </>
  );
}
