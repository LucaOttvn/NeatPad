import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import { useEffect, useRef, useState } from "react";
import ColorPicker from "../../colorPicker/ColorPicker";
import { Folder } from "@/utils/interfaces";
import { foldersToShow, selectedFolder, selectedSideMenu, updatingFolder, user } from "@/utils/signals";
import { handleModal } from "@/utils/globalMethods";
import './folderHandler.scss';
import { db } from "@/utils/db";

// modal to create/update/delete a folder
export default function FolderHandler() {

  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  let foundFolder = useRef<Folder | undefined>(undefined)

  useEffect(() => {
    // if updating a folder get its data into the input fields
    if (!updatingFolder.value) return

    foundFolder.current = foldersToShow.value.find((folder) => folder.id == updatingFolder.value)

    if (!foundFolder.current) return

    setFolderName(foundFolder.current.name)

    if (foundFolder.current.color) setSelectedColor(foundFolder.current.color)
  }, []);

  async function handleFolderCreation() {
    const folder = foundFolder.current;
    const changesDetected = folder?.name !== folderName || folder?.color !== selectedColor;

    // if the user's updating the folder (so it's not a new one) and there are some actual updates
    let newFolder: Folder = {
      id: folder ? folder.id : undefined,
      name: folderName,
      color: selectedColor || 'White',
      user: user.value!.email
    }

    // if it's an already existing folder, update it
    if (updatingFolder.value && changesDetected) await db.folders.update(updatingFolder.value, { name: newFolder.name, color: newFolder.color, user: newFolder.user })

    // if it's a new folder create a new one in the db
    if (!updatingFolder.value) await db.folders.add(newFolder);

    // close the modal at the end
    updatingFolder.value = undefined
    handleModal(undefined);
  }

  async function handleDeleteFolder() {
    if (!foundFolder.current || !foundFolder.current.id) return
    await db.notesTombstones.put(foundFolder.current.id)
    await db.folders.delete(foundFolder.current.id)

    handleModal(undefined)
    updatingFolder.value = undefined
    selectedFolder.value = undefined
    selectedSideMenu.value = undefined
  }

  return (
    <AnimatedDiv className="folderHandler">
      {/* form + color picker section */}
      <div className="wrapper flex">
        <div className="heading">
          <div className="title flex flex-col items-start justify-start">
            {updatingFolder.value ? <span>Update</span> : <><span>Create</span>
              <span className="ms-3">New</span></>}
            <b
              className="ms-6"
              style={{
                color: `var(--${selectedColor})` || "auto",
                transition: "0.2s",
              }}
            >
              Folder
            </b>
          </div>
          <input
            type="text"
            placeholder="Folder name"
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
            value={folderName}
          />
        </div>
        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
      </div>

      {/* confirm/delete buttons section */}
      <div className="flex items-center gap-3 pb-5">
        <button
          className="mainBtn createFolderBtn"
          disabled={folderName == ''}
          onClick={() => {
            handleFolderCreation()
          }}
        >
          Confirm
        </button>
        {updatingFolder.value && <>
          or
          <button
            className="mainBtn createFolderBtn"
            style={{ background: 'var(--Red)' }}
            onClick={handleDeleteFolder}
          >
            Delete folder
          </button>
        </>}
      </div>
    </AnimatedDiv>
  );
}
