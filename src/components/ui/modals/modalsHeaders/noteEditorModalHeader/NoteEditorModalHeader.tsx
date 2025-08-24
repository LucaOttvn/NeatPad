import { useEffect, useState } from "react";
import SvgButton from "../../../buttons/SvgButton";
import { Folder, Note } from "@/utils/interfaces";
import { gsap } from "gsap";

import './noteEditorModalHeader.scss';
import { ReactSVG } from "react-svg";
import { handleModal, handleNoteEditorClose } from "@/utils/globalMethods";
import CollaboratorsSection from "./CollaboratorsSection";
import { folders, updateNoteState } from "@/utils/signals";

interface NoteEditorModalHeaderProps {
  modalId: string;
  note: Note | undefined;
}

// this is the header of the note editor, it has its own set of methods to handle notes creation/update
export default function NoteEditorModalHeader(props: NoteEditorModalHeaderProps) {
  
  const [pinned, setPinned] = useState(props.note ? props.note.pinned : false);
  const [foldersListOpened, setFoldersListOpened] = useState(false);
  const [collaboratorsSectionOpened, setCollaboratorsSectionOpened] = useState(false);

  // note pinning handling
  useEffect(() => {
    const updatedNote = props.note;
    if (!updatedNote) return
    updatedNote.pinned = pinned
    // update the local state
    async function triggerUpdate() {
      await updateNoteState(updatedNote!)
    }
    triggerUpdate()
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

  async function handleFolderSelection(clickedFolder: Folder) {
    const updatedNote = { ...props.note } as Note
    if (!updatedNote || !clickedFolder.id) return
    // if the clicked folder is already selected remove the selection, otherwise set it as the current one
    const alreadySelectedFolder = updatedNote.folders.find(folder => folder == clickedFolder.id)

    if (alreadySelectedFolder) {
      // remove the clicked folder if it's already selected
      updatedNote.folders = updatedNote.folders.filter(folder => folder != clickedFolder.id)
    }
    else {
      // the relation between folder and note is one-to-many, so one folder can have many notes but a note can only be assigned to a single folder
      // this is why it's necessary to check whether the user has already set the current note to one of their folders and, if it did, remove the previous one before adding the new one

      // get the ids from the context notes array
      const contextFolderIds = folders.value.map(f => f.id);

      // remove every folder that is included in contextFolders
      updatedNote.folders = updatedNote.folders.filter(id => !contextFolderIds?.includes(id));

      updatedNote.folders.push(clickedFolder.id!)
    }
    await updateNoteState(updatedNote)
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
            handleNoteEditorClose()
            handleModal(undefined)
          }}
        />
      </header>
      {/* collapsable section for folder selection */}
      <section className="addNoteToFolder">
        <span className="font-bold mx-5 mt-5">Add to folder</span>
        <div className="foldersList">
          {folders.value.map((folder, index) => {
            return (
              // folder card
              <div
                key={"folder" + index}
                className="folderCardSelector gap-3"
                onClick={() => {
                  handleFolderSelection(folder)
                }}
                style={{ border: `${props.note?.folders.find(id => id == folder.id) ? 4 : 1}px solid var(--${folder.color})` }}
              >
                {props.note?.folders.find(id => id == folder.id) && <ReactSVG src={`/icons/folder.svg`} className="icon" beforeInjection={(svg) => {
                  svg.setAttribute("fill", `var(--${folder.color})`);
                }} />}
                <span className="font-bold" style={{ color: `var(--${folder.color})` }}>{folder.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      <CollaboratorsSection collaboratorsSectionOpen={collaboratorsSectionOpened} note={props.note} />
    </header>
  );
}
