import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import { useContext, useEffect, useState } from "react";
import ColorPicker from "../ColorPicker";
import { FolderContext } from "@/contexts/foldersContext";
import { Folder, ModalsNames } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import { createFolder } from "@/api/folders";
import { handleModal } from "@/utils/globalMethods";

export default function FolderCreator() {
  const folderContext = useContext(FolderContext);
  const userContext = useContext(UserContext);

  const [folderName, setFolderName] = useState("");

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    console.log(folderName);
  }, [folderName]);

  return (
    <AnimatedDiv className="w-full h-full flex items-center justify-start flex-col gap-20">
      <span className="title w-full ps-10 flex flex-col items-start justify-start">
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
      <ColorPicker setSelectedColor={setSelectedColor} />
      <button
        className="mainBtn"
        onClick={async () => {
          const newFolder: Folder = {
            name: folderName,
            notes: [],
            color: selectedColor,
            user: userContext!.user!.id,
          };
          await createFolder(newFolder);
          folderContext?.setFolders((prevState: Folder[]) => [
            ...prevState,
            newFolder,
          ])
          handleModal(false, ModalsNames.createFolder)
        }}
      >
        Confirm
      </button>
    </AnimatedDiv>
  );
}
