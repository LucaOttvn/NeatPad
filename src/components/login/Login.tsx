import React, { useContext, useState } from "react";
import "./login.scss";
import { signIn, signUp } from "@/api/user";
import AnimatedDiv from "../animatedComponents/AnimatedDiv";
import GeneralModal from "../ui/GeneralModal";
import { handleModal } from "@/utils/globalMethods";
import { UserContext } from "@/utils/contexts";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [creatingAccount, setCreatingAccount] = useState(false);
  const userContext = useContext(UserContext);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  async function handleSubmit() {
    handleModal()
    const user = creatingAccount
      ? await signUp(formData.email, formData.password)
      : await signIn(formData.email, formData.password);
    if (user) {
      userContext?.setUser(user.user);
    }
  }

  return (
    <AnimatedDiv className="loginContainer">
      <h1 className="title">NeatPad</h1>
      <div className="center flex-col gap-3">
        <button
          className="mainBtn"
          onClick={() => {
            setCreatingAccount(false);
            setFormData({ email: "", password: "" });
            handleModal();
          }}
        >
          Login
        </button>
        <span>or</span>
        <button
          className="mainBtn"
          onClick={() => {
            setCreatingAccount(true);
            setFormData({ email: "", password: "" });
            handleModal();
          }}
        >
          Create new account
        </button>
      </div>

      <GeneralModal width={40} height={40}>
        <div className="w-full h-full center flex-col gap-8">
          <h1 className="title">
            {creatingAccount ? "Create account" : "Login"}
          </h1>
          <div className="flex flex-col gap-4">
            <input
              onChange={handleChange}
              type="text"
              onKeyDown={handleKeyDown}
              name="email"
              placeholder="Email"
            />
            <input
              onChange={handleChange}
              type="password"
              onKeyDown={handleKeyDown}
              name="password"
              placeholder="Password"
            />
          </div>
          <button
            className="mainBtn"
            onClick={async () => {
              handleSubmit();
            }}
          >
            {creatingAccount ? "Confirm" : "Login"}
          </button>
        </div>
      </GeneralModal>
    </AnimatedDiv>
  );
}
