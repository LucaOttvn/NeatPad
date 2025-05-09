import { useContext, useEffect } from "react";
import "./componentsStyle.scss";
import { ModalsNames } from "@/utils/interfaces";
import { getNotes } from "@/api/notes";
import AnimatedDiv from "./animatedComponents/AnimatedDiv";
import { ModalsContext } from "@/contexts/modalsContext";

export default function Login() {

  const modalsContext = useContext(ModalsContext);
  
  useEffect(() => {
    getNotes();
  }, []);

  return (
    <AnimatedDiv className="loginContainer">
      <h1 className="title">NeatPad</h1>
      <div className="center flex-col gap-3">
        <button
          className="mainBtn"
          onClick={() => {
            modalsContext?.setSelectedModal(ModalsNames.login)
          }}
        >
          Login
        </button>
        <span>or</span>
        <button
          className="mainBtn"
          onClick={() => {
            modalsContext?.setSelectedModal(ModalsNames.login)
          }}
        >
          Create new account
        </button>
      </div>
    </AnimatedDiv>
  );
}
