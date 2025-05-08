import { useContext } from "react";
import SvgButton from "../../SvgButton";
import { ModalsContext } from "@/contexts/modalsContext";
import { FoldersContext } from "@/contexts/foldersContext";
import { ModalsNames } from "@/utils/interfaces";

interface BasicComponentProps {
  modalId: string
  className?: string
}

export default function GeneralModalHeader(props: BasicComponentProps) {

  const modalsContext = useContext(ModalsContext)
  const foldersContext = useContext(FoldersContext)
  return (
    <header className={`end p-5 ${props.className}`}>
      <SvgButton
        fileName="close"
        onClick={() => {
          if (modalsContext?.selectedModal == ModalsNames.folderHandler) { foldersContext?.setUpdatingFolder(undefined) }
          modalsContext?.setSelectedModal(undefined)
        }}
      />
    </header>
  );
}
