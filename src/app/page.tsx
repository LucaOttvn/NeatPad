'use client'
import GeneralModal from "@/components/GeneralModal";
import TopBar from "@/components/TopBar";
import { handleModal } from "@/utils/globalMethods";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <TopBar></TopBar>
      <GeneralModal><div>test</div></GeneralModal>
      <button className="addBtn" style={{ borderRadius: "50%" }} 
      onClick={()=>{handleModal()}}>
        <Image src={"/icons/plus.svg"} width={25} height={25} alt={""} draggable={false}></Image>
      </button>
    </div>
  );
}
