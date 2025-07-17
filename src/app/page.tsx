"use client";
import GeneralModal from "@/components/GeneralModal";
import NoteEditor from "@/components/NoteEditor";
import GeneralSideMenu from "@/components/SideMenu";
import TopBar from "@/components/TopBar";
import { handleModal } from "@/utils/globalMethods";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <TopBar></TopBar>
      <GeneralModal>
        <NoteEditor />
      </GeneralModal>
      <GeneralSideMenu />
      <button
        className="addBtn"
        style={{ borderRadius: "50%" }}
        onClick={() => {
          handleModal();
        }}
      >
        <Image
          src={"/icons/plus.svg"}
          width={25}
          height={25}
          alt={""}
          draggable={false}
        ></Image>
      </button>
    </>
  );
}
