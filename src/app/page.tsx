"use client";;
import GeneralModal from "@/components/ui/GeneralModal";
import NoteEditor from "@/components/NoteEditor";
import GeneralSideMenu from "@/components/ui/SideMenu";
import TopBar from "@/components/ui/TopBar";
import { handleModal } from "@/utils/globalMethods";
import Image from "next/image";
import { getUser } from "@/api/user";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/utils/contexts";

import { PropagateLoader, ScaleLoader } from "react-spinners";

export default function Home() {
  const userContext = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      await getUser();
      setIsLoading(false);
      if (userContext) {
        userContext.setUser(user);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="loader">
        <ScaleLoader
          color={"white"}
          loading={true}

        />
      </div>
    );
  }

  return (
    <>
      {userContext?.user ? (
        <>
          <TopBar />
          <GeneralModal>
            <NoteEditor />
          </GeneralModal>
          <GeneralSideMenu />
          <button
            className="addBtn"
            style={{ borderRadius: "50%" }}
            onClick={handleModal}
          >
            <Image
              src="/icons/plus.svg"
              width={25}
              height={25}
              alt=""
              draggable={false}
            />
          </button>
        </>
      ) : (
        <div style={{ background: "red" }}></div>
      )}
    </>
  );
}
