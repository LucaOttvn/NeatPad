import { useContext, useEffect, useState } from "react";
import SvgButton from "../../../SvgButton";
import { Folder, Note } from "@/utils/interfaces";
import { gsap } from "gsap";
import { FoldersContext } from "@/contexts/foldersContext";
import { NotesContext } from "@/contexts/notesContext";
import './noteEditorHeader.scss';
import { ReactSVG } from "react-svg";
import { handleModal } from "@/utils/globalMethods";
import CollaboratorsSection from "./CollaboratorsSection";

interface BasicComponentProps {
  modalId: string;
  note: Note | undefined;
}
// this is the header of the note editor, it has its own set of methods to handle notes creation/update
export default function NoteEditorModalHeader(props: BasicComponentProps) {
  const foldersContext = useContext(FoldersContext);
  const notesContext = useContext(NotesContext);

  const [pinned, setPinned] = useState(props.note ? props.note.pinned : false);
  const [foldersListOpened, setFoldersListOpened] = useState(false);
  const [collaboratorsSectionOpened, setCollaboratorsSectionOpened] = useState(false);

  // note pinning handling
  useEffect(() => {
    const updatedNote = props.note;
    if (updatedNote) {
      updatedNote.pinned = pinned
      // update the local state
      notesContext?.updateNoteState(updatedNote)
    }
  }, [pinned]);

  // animations handling
  useEffect(() => {
    gsap.to(".addNoteToFolder", {
      height: foldersListOpened ? "auto" : 0,
      marginBottom: foldersListOpened ? '1rem' : 0,
      duration: 0.2,
      ease: 'power4.out',
    });
  }, [foldersListOpened]);

  function handleFolderSelection(folder: Folder) {
    const updatedNote = props.note
    if (updatedNote) {
      // if the folder is already selected, remove the selection, otherwise set it as the current one
      updatedNote.folder = updatedNote.folder == folder.id ? null : folder.id!
      notesContext?.updateNoteState(updatedNote)
    }
  }

  return (
    <header className="noteEditorModalHeader">
      <header className="w-full flex justify-between px-3 pt-5 pb-5">
        <div className="start gap-5">
          <SvgButton
            fileName={pinned ? "pinFill" : "pin"}
            onClick={() => {
              setPinned(!pinned);
            }}
          />
          <SvgButton
            id='foldersListOpener'
            fileName={foldersListOpened ? "folderFill" : "folder"}
            onClick={() => {
              setFoldersListOpened(prev => !prev);
            }}
          />
          <SvgButton
            id='collaboratorsListOpener'
            fileName={collaboratorsSectionOpened ? "personAddFill" : "personAdd"}
            onClick={() => {
              setCollaboratorsSectionOpened(prev => !prev)
            }}
          />
        </div>
        <SvgButton
          fileName="close"
          onClick={() => {
            notesContext?.handleNoteEditorClose()
            handleModal(undefined)
          }}
        />
      </header>
      {/* collapsable section for folder selection */}
      <section className="addNoteToFolder">
        <span className="font-bold mx-5 mt-5">Add to folder</span>
        <div className="foldersList">
          {foldersContext?.folders.map((folder, index) => {
            return (
              // folder card
              <div
                key={"folder" + index}
                className="folderCardSelector gap-3"
                onClick={() => {
                  handleFolderSelection(folder)
                }}
                style={{ border: `${props.note?.folder == folder.id ? 4 : 1}px solid var(--${folder.color})` }}
              >
                {props.note?.folder == folder.id && <ReactSVG src={`/icons/folder.svg`} className="icon" beforeInjection={(svg) => {
                  svg.setAttribute("fill", `var(--${folder.color})`);
                }} />}
                <span className="font-bold" style={{ color: `var(--${folder.color})` }}>{folder.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <CollaboratorsSection collaboratorsSectionOpen={collaboratorsSectionOpened}/>
    </header>
  );
}
