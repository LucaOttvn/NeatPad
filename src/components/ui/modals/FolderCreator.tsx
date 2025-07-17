import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import { useContext, useState } from "react";
import ColorPicker from "../ColorPicker";
import { FoldersContext } from "@/contexts/foldersContext";
import { Folder, ModalsNames } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import { createFolder } from "@/api/folders";
import { handleModal } from "@/utils/globalMethods";

export default function FolderCreator() {
  const foldersContext = useContext(FoldersContext);
  const userContext = useContext(UserContext);

  const [folderName, setFolderName] = useState("");

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );
  
  return (
    <AnimatedDiv className="folderCreator">
      <div className="wrapper flex">
        <div className="heading">
          <span className="title flex flex-col items-start justify-start">
            <span>Create</span>
            <span className="ms-3">New</span>
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
          />
        </div>
        <div>
          <ColorPicker setSelectedColor={setSelectedColor} />
        </div>
      </div>

      <button
        className="mainBtn createFolderBtn"
        disabled={folderName == ''}
        onClick={async () => {
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
          handleModal(ModalsNames.createFolder);
        }}
      >
        Confirm
      </button>
    </AnimatedDiv>
  );
}
