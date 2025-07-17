import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import { useContext, useEffect, useRef, useState } from "react";
import ColorPicker from "../ColorPicker";
import { FoldersContext } from "@/contexts/foldersContext";
import { Folder } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import { createFolder, deleteFolder, updateFolder } from "@/api/folders";
import { selectedModal } from "@/utils/signals";

export default function FolderHandler() {
  const foldersContext = useContext(FoldersContext);
  const userContext = useContext(UserContext);

  const [folderName, setFolderName] = useState("");

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  let foundFolder = useRef<Folder | undefined>(undefined)

  useEffect(() => {
    // if updating a folder get its data into the view
    if (foldersContext?.updatingFolder) {
      foundFolder.current = foldersContext.folders.find((folder) => folder.id == foldersContext.updatingFolder)
      if (foundFolder.current) {
        setFolderName(foundFolder.current.name)
        if (foundFolder.current.color) setSelectedColor(foundFolder.current.color)
      }
    }
  }, []);

  async function handleFolderCreation() {
    // if the user's updating the folder (so it's not a new one) and there are some actual updates
    if (foldersContext?.updatingFolder) {
      const changesDetected = foundFolder.current?.name != folderName || foundFolder.current.color != selectedColor
      if (changesDetected && foundFolder.current) {
        await updateFolder(foundFolder.current.id!, { name: folderName, color: selectedColor })
        foldersContext.updateFolderState(foundFolder.current.id!, { name: folderName, color: foundFolder.current.color })
      }
    } 
    // if it's a new folder create a new Folder object and save it
    else {
      const newFolder: Folder = {
        name: folderName,
        color: selectedColor || 'White',
        user: userContext!.user!.id,
      };
      // insert the folder in the db
      let folderWithId = await createFolder(newFolder);
      // update the local state
      foldersContext?.setFolders((prevState: Folder[]) => [
        ...prevState,
        folderWithId,
      ]);
    }
    // close the modal at the end
    foldersContext?.setUpdatingFolder(undefined)
    selectedModal.value = undefined
  }

  return (
    <AnimatedDiv className="folderHandler">
      <div className="wrapper flex">
        <div className="heading">
          <div className="title flex flex-col items-start justify-start">
            {foldersContext?.updatingFolder ? <span>Update</span> : <><span>Create</span>
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
        {foldersContext?.updatingFolder && <>
          or
          <button
            className="mainBtn createFolderBtn"
            style={{ background: 'var(--Red)' }}
            onClick={() => {
              foldersContext?.setFolders(prev => prev.filter(folder => folder.id != foundFolder.current?.id))
              if (foundFolder.current && foundFolder.current.id) deleteFolder(foundFolder.current?.id)
            selectedModal.value = undefined
              foldersContext.setUpdatingFolder(undefined)
            }}
          >
            Delete folder
          </button>
        </>}
      </div>
    </AnimatedDiv>
  );
}
