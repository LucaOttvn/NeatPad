import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import { useEffect, useRef, useState } from "react";
import ColorPicker from "../../colorPicker/ColorPicker";

import { Folder } from "@/utils/interfaces";

import { folders, selectedFolder, selectedSideMenu, updateFolder5tate, updatingFolder, user } from "@/utils/signals";
import { handleModal } from "@/utils/globalMethods";
import './folderHandler.scss';
import { createFolder, deleteFolder } from "@/serverActions/foldersActions";

// modal to create/update/delete a folder
export default function FolderHandler() {
  
  

  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  let foundFolder = useRef<Folder | undefined>(undefined)

  useEffect(() => {
    // if updating a folder get its data into the view
    if (!updatingFolder.value) return
    
    foundFolder.current = folders.value.find((folder) => folder.id == updatingFolder.value)

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
      user: user.value!.id!
    }

    if (updatingFolder.value && changesDetected) updateFolder5tate(newFolder);

    // if it's a new folder create a new Folder object and save it
    if (!updatingFolder.value) {
      // insert the folder in the db
      const folderWithId = await createFolder(newFolder);
      // then update the local state to have the complete folder obj with the id field
      folders.value = [...folders.value, folderWithId]
    }
    // close the modal at the end
    updatingFolder.value = undefined
    handleModal(undefined);
  }

  async function handleDeleteFolder() {

    // update folders state
    folders.value = folders.value.filter(folder => folder.id != foundFolder.current?.id)

    if (foundFolder.current && foundFolder.current.id) await deleteFolder(foundFolder.current?.id)
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
