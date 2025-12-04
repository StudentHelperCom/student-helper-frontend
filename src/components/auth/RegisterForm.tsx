'use client'

import React, {useEffect} from "react";
import {useRegister} from "@src/hooks/useRegister";
import {useAlert} from "@components/contexts/AlertDialogContext";

interface Props {
  flipSetter: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export default function RegisterForm({flipSetter}: Props) {
  const [showPassword, setShowPassword] = React.useState(false);

  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");

  const {handleFn: handleRegister} = useRegister();
  const {showAlert} = useAlert();

  const handleSignUp = async () => {
    const {response, message} = await handleRegister({login, password});

    if (response) {

      showAlert(message, true);
    } else {
      showAlert(message, false);
    }
  }

  return (
    <form className="auth-form auth-form--register" onSubmit={(e) => e.preventDefault()}>
      <span className="auth-form__title">
        Sign Up
      </span>
      <input
        className="auth-form__field auth-form__field--login"
        type="text"
        placeholder="Username"
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        className="auth-form__field auth-form__field--pass"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <input type="checkbox" id="register-checkbox" onChange={() => setShowPassword(!showPassword)}/>
        <label htmlFor="register-checkbox" className="select-none"> Show Password</label>
      </div>
      <button
        className="auth-form__button auth-form__button--submit"
        onClick={() => handleSignUp()}
      >
        Sign up
      </button>
      <div className="self-end mt-[15px]">
        <span>Already have an account?👉 </span>
        <button className="auth-form__button auth-form__button--switch-side" onClick={() => flipSetter(false)}>Sign in
        </button>
      </div>
    </form>
  )
}