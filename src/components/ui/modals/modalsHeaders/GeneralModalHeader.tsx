import SvgButton from "../../SvgButton";
import { ModalsNames } from "@/utils/interfaces";
import { selectedModal, updatingFolder } from "@/utils/signals";
import { handleModal } from "@/utils/globalMethods";

interface BasicComponentProps {
  modalId: string
  className?: string
}

// this is the basic header for modals that don't needd any particular function
export default function GeneralModalHeader(props: BasicComponentProps) {

  const closeModal = () => {
    if (selectedModal.value == ModalsNames.folderHandler) updatingFolder.value = undefined
  }

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
