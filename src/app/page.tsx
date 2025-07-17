"use client";;
import TopBar from "@/components/ui/TopBar";
import Image from "next/image";
import { useContext, useEffect, useLayoutEffect } from "react";
import { ScaleLoader } from "react-spinners";
import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import NotesOverview from "@/components/notesOverview/NotesOverview";
import { ModalsNames, Note, User } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import GeneralSideMenu from "@/components/ui/SideMenu";
import Login from "@/components/Login";
import GeneralModal from "@/components/ui/modals/GeneralModal";
import { createNote, deleteNote } from "@/db/notes";
import { NotesContext } from "@/contexts/notesContext";
import { flushSync } from "react-dom";
import gsap from 'gsap';
import { animateDivUnmount } from "@/utils/globalMethods";
import { useSignals } from "@preact/signals-react/runtime";
import { isMobile, loading, selectedModal } from "@/utils/signals";
import { getUserById } from "@/db/user";

export default function Home() {
  useSignals()

  const userContext = useContext(UserContext);
  const notesContext = useContext(NotesContext);

  useLayoutEffect(() => {
    function checkScreenSize() {
      isMobile.value = window.innerWidth < 768
    }
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isMobile.value])

  useEffect(() => {
    loading.value = true
    const token = localStorage.getItem('JWT');


    if (token) {
      async function verifyToken() {
        try {
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
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('JWT');
          userContext?.setUser(undefined);
        }
      };

      verifyToken();
    } else {
      userContext?.setUser(undefined);
    }

    loading.value = false
  }, []);


  // delete mode animation for the add/delete note button
  useEffect(() => {
    gsap.to('#newNoteBtn', {
      rotateY: notesContext?.deleteMode.active ? '180deg' : '0deg',
      background: notesContext?.deleteMode.active ? 'var(--Red)' : '',
      duration: 0.2,
      onComplete: () => {
        gsap.to('#trashBtn', {
          scale: notesContext?.deleteMode.active ? 1 : 0,
          duration: 0.2
        })
        gsap.to('#plusBtn', {
          scale: notesContext?.deleteMode.active ? 0 : 1,
          duration: 0.2
        })
      }
    })
  }, [notesContext?.deleteMode.active]);

  // when the user clicks on the plus button, the createNote() gets triggered, this happens because the NoteEditor component needs a note with an already existing id because it's supposed to edit notes, not creating new ones (as you can guess from the name)
  async function openNewNoteModal() {
    const newNote: Note = {
      user: userContext!.user!.id!,
      title: '',
      text: '',
      last_update: new Date(),
      pinned: false,
      folder: null
    }
    let newNoteFromDB = await createNote(newNote)
    if (newNoteFromDB) {
      if (!notesContext) return null
      let arr = [...notesContext.notes, newNoteFromDB]
      flushSync(() => {
        notesContext.setNotes(arr)
        notesContext.setSelectedNote(newNoteFromDB.id)
      })
      selectedModal.value = ModalsNames.newNote
    }
  }


  return (
    <>
      {loading.value && <div className="loader">
        <ScaleLoader color={"white"} loading={true} />
      </div>}

      {userContext?.user ? (
        <AnimatedDiv className="appContainer w-full h-full flex start">
          <TopBar />
          <div className="w-full h-full flex" style={{ marginTop: "8rem" }}>
            <GeneralSideMenu />
            <NotesOverview />
          </div>

          <button
            id="newNoteBtn"
            className="addBtn"
            style={{ borderRadius: "50%" }}
            onClick={() => {
              if (notesContext?.deleteMode.active) {
                let notesToDelete = notesContext.deleteMode.notes.map((noteId) => {
                  return 'noteCard' + noteId
                })
                animateDivUnmount(notesToDelete, () => {
                  let updatedNotes = notesContext.notes.filter(note => !notesContext.deleteMode.notes.includes(note.id!));
                  notesContext.setNotes(updatedNotes)
                  deleteNote(notesContext.deleteMode.notes)
                  notesContext.setDeleteMode({ active: false, notes: [] })
                })
              }
              else {
                openNewNoteModal()
              }
            }}
          >
            <Image
              id="trashBtn"
              src="/icons/trash.svg"
              width={25}
              height={25}
              alt=""
              draggable={false}
            />
            <Image
              id="plusBtn"
              src="/icons/plus.svg"
              width={25}
              height={25}
              alt=""
              draggable={false}
            />
          </button>
        </AnimatedDiv>
      ) : (
        <Login />
      )}
      <GeneralModal />


    </>
  );
}
