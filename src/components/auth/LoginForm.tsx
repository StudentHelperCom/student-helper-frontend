'use client'

import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {signIn, useSession} from "next-auth/react";
import {useLoader} from "@components/contexts/LoaderContext";
import {useAlert} from "@components/contexts/AlertDialogContext";

interface Props {
  flipSetter: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export default function LoginForm({flipSetter}: Props) {
  const [showPassword, setShowPassword] = React.useState(false);

  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");

  const {setLoaderStatus: setLoaderOpened} = useLoader();
  const {showAlert} = useAlert();
  const router = useRouter();
  const { status } = useSession();
  
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }

    if (status === "loading") {
      setLoaderOpened(true);
    } else {
      setLoaderOpened(false);
    }
  }, [router, setLoaderOpened, status]);

  const handleSignIn = async () => {
    setLoaderOpened(true);
    const result = await signIn('credentials', {
      login: login,
      password: password,
      redirect: false,
    });
    setLoaderOpened(false);

    if (result?.ok) {
      showAlert('Logged in successfully', true);
      router.push('/');
    } else {
      showAlert('Incorrect login or password', false);
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