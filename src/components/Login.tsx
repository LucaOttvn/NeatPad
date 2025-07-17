import { useContext } from "react";
import "./componentsStyle.scss";
import { ModalsNames } from "@/utils/interfaces";
import AnimatedDiv from "./animatedComponents/AnimatedDiv";
import { ModalsContext } from "@/contexts/modalsContext";

export default function Login() {

  const modalsContext = useContext(ModalsContext);

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
            modalsContext?.setSelectedModal(ModalsNames.createAccount)
          }}
        >
          Create new account
        </button>
      </div>
    </AnimatedDiv>
  );
}
