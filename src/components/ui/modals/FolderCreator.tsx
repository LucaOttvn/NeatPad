import AnimatedDiv from "@/components/animatedComponents/AnimatedDiv";
import { useContext, useEffect, useState } from "react";
import ColorPicker from "../ColorPicker";
import { FolderContext } from "@/contexts/foldersContext";
import { Folder, ModalsNames } from "@/utils/interfaces";
import { UserContext } from "@/contexts/userContext";
import { createFolder } from "@/api/folders";
import { handleModal } from "@/utils/globalMethods";

interface FolderCreatorProps {}

export default function FolderCreator(props: FolderCreatorProps) {
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
    <AnimatedDiv className="w-full h-full flex items-center justify-start flex-col gap-20 mt-">
      <span className="title start gap-3">
        Create new 
        <span
          style={{
            color: `var(--${selectedColor})` || "auto",
            transition: "0.2s",
          }}
        >
          folder
        </span>
      </span>
      <input
        type="text"
        className="mainInput"
        placeholder="Folder name"
        style={{ color: "var(--Black)" }}
        onChange={(e) => {
          setFolderName(e.target.value);
        }}
      />
      <ColorPicker setSelectedColor={setSelectedColor} />
      <button
        className="mainBtn"
        onClick={async () => {
          let newFolder: Folder = {
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
