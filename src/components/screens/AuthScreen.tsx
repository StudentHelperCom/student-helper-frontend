'use client'

import LoginForm from "@components/auth/LoginForm";
import RegisterForm from "@components/auth/RegisterForm";
import {useState} from "react";

export default function AuthScreen() {
  const [flipToRegister, setFlipToRegister] = useState<boolean | undefined>(undefined);

  function getClassModifier() {
    switch (flipToRegister) {
      case undefined:
        return "";
      case true:
        return "auth-screen__container--show-register";
      case false:
        return "auth-screen__container--show-login";
    }
  }

  return (
    <>
      <main className="auth-screen">
        <div className="auth-screen__content">
          <h1 className="auth-screen__app-name" >Student Helper</h1>
          <div className={"auth-screen__container " + getClassModifier()}>
            <LoginForm flipSetter={setFlipToRegister} />
            <RegisterForm flipSetter={setFlipToRegister} />
          </div>
        </div>
      </main>
    </>
  )
}