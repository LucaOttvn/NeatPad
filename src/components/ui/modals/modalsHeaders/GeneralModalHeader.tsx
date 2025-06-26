import { useContext } from "react";
import SvgButton from "../../SvgButton";
import { FoldersContext } from "@/contexts/foldersContext";
import { ModalsNames } from "@/utils/interfaces";
import { selectedModal } from "@/utils/signals";
import { handleModal } from "@/utils/globalMethods";

interface BasicComponentProps {
  modalId: string
  className?: string
}

// this is the basic header for modals that don't needd any particular function
export default function GeneralModalHeader(props: BasicComponentProps) {

  const closeModal = () => {
    if (selectedModal.value == ModalsNames.folderHandler) foldersContext?.setUpdatingFolder(undefined)
  }

  const foldersContext = useContext(FoldersContext)
  return (
    <header className={`end p-5 ${props.className}`}>
      <SvgButton
        fileName="close"
        onClick={() => {
          handleModal(undefined, closeModal)
        }}
      />
    </header>
  );
}
