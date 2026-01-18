'use client'

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {signIn, useSession} from "next-auth/react";
import {useAlert} from "@components/contexts/AlertDialogContext";
// 1. Importujemy hooka
import { useLoader } from "@components/contexts/LoaderContext";

interface Props {
  flipSetter: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

// 2. Definiujemy unikalne ID dla tego procesu
const LOADER_ID = 'LOGIN_PROCESS';

export default function LoginForm({flipSetter}: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");

  const {showAlert} = useAlert();
  const router = useRouter();
  const { status } = useSession();

  // 3. Pobieramy funkcje sterujące
  const { startLoading, stopLoading } = useLoader();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [router, status]);

  const handleSignIn = async () => {
    startLoading(LOADER_ID);

    try {
      const result = await signIn('credentials', {
        login: login,
        password: password,
        redirect: false,
      });

      if (result?.ok) {
        showAlert('Logged in successfully');
        router.push('/');
      } else {
        showAlert('Incorrect login or password');
      }
    } catch (error) {
      showAlert('An unexpected error occurred ');
      console.error(error);
    } finally {
      stopLoading(LOADER_ID);
    }
  }

  return (
    <form className="auth-form auth-form--login" onSubmit={(e) => e.preventDefault()}>
      <span className="auth-form__title">
        Sign In
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
        <input type="checkbox" id="login-checkbox" onChange={() => setShowPassword(!showPassword)}/>
        <label htmlFor="login-checkbox"  className="select-none"> Show Password</label>
      </div>
      <button
        className="auth-form__button auth-form__button--submit"
        onClick={() => handleSignIn()}
      >
        Login
      </button>
      <div className="self-end mt-[15px]">
        <span>Don&#39;t have an account?👉 </span>
        <button className="auth-form__button auth-form__button--switch-side" onClick={() => flipSetter(true)}>Sign up</button>
      </div>
    </form>
  )
}