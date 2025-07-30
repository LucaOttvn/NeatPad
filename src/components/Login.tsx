import "./componentsStyle.scss";
import { ModalsNames } from "@/utils/interfaces";
import AnimatedDiv from "./animatedComponents/AnimatedDiv";
import { selectedModal } from "@/utils/signals";
import AnimatedText from "./animatedComponents/AnimatedText";
import InstallPWAButton from "./InstallPwaButton";

export default function Login() {

  return (
    <AnimatedDiv className="loginContainer">

      <AnimatedText className="title center" text="NeatPad" />

      <div className="center flex-col gap-3">
        <button
          className="mainBtn"
          onClick={() => {
            selectedModal.value = ModalsNames.login
          }}
        >
          Login
        </button>

        <InstallPWAButton />
        
        <span>or</span>
        <button
          className="mainBtn"
          onClick={() => {
            selectedModal.value = ModalsNames.createAccount
          }}
        >
          Create new account
        </button>
      </div>
    </AnimatedDiv>
  );
}
