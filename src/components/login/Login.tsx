import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import AnimatedText from "../animatedComponents/AnimatedText";
import { signIn } from "next-auth/react";
import { ReactSVG } from "react-svg";
export default function Login() {

  return (
    <AnimatedDiv className="loginContainer">

      <AnimatedText className="title center" text="NeatPad" />

      <div className="center flex-col gap-3">
        <button
          className="mainBtn center gap-3"
          onClick={() => {
            signIn('google', {redirect: false}, { prompt: "select_account" })
          }}
        >
          <ReactSVG src="/icons/google.svg" />
          Login with Google
        </button>
      </div>
    </AnimatedDiv>
  );
}
