"use client";
import GeneralModal from "@/components/ui/GeneralModal";
import NoteEditor from "@/components/NoteEditor";
import GeneralSideMenu from "@/components/ui/SideMenu";
import TopBar from "@/components/ui/TopBar";
import { handleModal } from "@/utils/globalMethods";
import Image from "next/image";
import { UserContext } from "@/utils/contexts";
import { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import Login from "@/components/Login";
import { getUser, login } from "@/api/users";

export default function Home(content: any) {

  useEffect(() => {
    (async () => {
      await login()
      let user = await getUser();
    })();
  }, []);
  return (
    <>
      (
        <UserContext value={undefined}>
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
        </UserContext>
      )
    </>
  );
}
