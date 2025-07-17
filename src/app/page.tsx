'use client'
import GeneralModal from "@/components/GeneralModal";
import { openModal } from "@/utils/globalMethods";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <GeneralModal><div>test</div></GeneralModal>
      <button className="addBtn" style={{ borderRadius: "50%" }} 
      onClick={()=>{openModal()}}>
        <Image src={"/icons/plus.svg"} width={25} height={25} alt={""} draggable={false}></Image>
      </button>
    </div>
  );
}
