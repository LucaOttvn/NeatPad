import React, { useState } from "react";
import "./style.scss";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function onSubmit() {
    console.log(formData)
  }

  return (
    <div className="loginContainer">
      <h1 className="title">Login</h1>
      <div className="flex flex-col gap-5">
        <input onChange={handleChange} type="text" name="email" placeholder="Email" />
        <input onChange={handleChange} type="password" name="password" placeholder="Password" />
      </div>
      <button className="mainBtn" onClick={onSubmit}>Login</button>
    </div>
  );
}
