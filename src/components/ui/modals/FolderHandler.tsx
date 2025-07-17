import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import { useContext, useEffect, useRef, useState } from "react";
import ColorPicker from "../ColorPicker";
import { FoldersContext } from "@/contexts/foldersContext";
import { Folder, ModalsNames } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import { createFolder, updateFolder } from "@/api/folders";
import { handleModal } from "@/utils/globalMethods";

export default function FolderHandler() {
  const foldersContext = useContext(FoldersContext);
  const userContext = useContext(UserContext);

  const [folderName, setFolderName] = useState("");

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );

  let foundFolder = useRef<Folder | undefined>(undefined)

  useEffect(() => {
    if (foldersContext?.updatingFolder) {
      foundFolder.current = foldersContext.folders.find((folder) => folder.id == foldersContext.updatingFolder)
      if (foundFolder.current) {
        setFolderName(foundFolder.current.name)
        if (foundFolder.current.color) setSelectedColor(foundFolder.current.color)
      }
    }
  }, []);

  async function handleFolderCreation() {

    if (foldersContext?.updatingFolder) {
      if (foundFolder.current) {
        const changesDetected = foundFolder.current?.name != folderName || foundFolder.current.color != selectedColor
        if (changesDetected) {
          await updateFolder(foundFolder.current.id!, { name: folderName, color: selectedColor })
          foldersContext.updateFolderState(foundFolder.current.id!, { name: folderName, color: foundFolder.current.color })
        }
        handleModal(undefined)
      } else {
        const newFolder: Folder = {
          name: folderName,
          color: selectedColor || 'White',
          user: userContext!.user!.id,
        };
        await createFolder(newFolder);
        foldersContext?.setFolders((prevState: Folder[]) => [
          ...prevState,
          newFolder,
        ]);
        handleModal(undefined);
      }
    }
  }
  
  return (
    <AnimatedDiv className="FolderHandler">
      <div className="wrapper flex">
        <div className="heading">
          <span className="title flex flex-col items-start justify-start">
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
          </span>
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

      <button
        className="mainBtn createFolderBtn"
        disabled={folderName == ''}
        onClick={() => {
          handleFolderCreation()
        }}
      >
        Confirm
      </button>
    </AnimatedDiv>
  );
}
