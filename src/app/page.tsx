import Modal from "@/components/modal";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Modal />
      <div className="addBtn" style={{ borderRadius: "50%" }}>
        <Image src={"/icons/plus.svg"} width={25} height={25} alt={""} draggable={false}></Image>
      </div>
    </div>
  );
}
