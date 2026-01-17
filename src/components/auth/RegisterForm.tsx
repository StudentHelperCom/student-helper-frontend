'use client'

import React, { useEffect, useState } from "react";
import { useRegister } from "@src/hooks/useRegister";
import { useAlert } from "@components/contexts/AlertDialogContext";

interface Props {
  flipSetter: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export default function RegisterForm({ flipSetter }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    isLoading,
    isError,
    isSuccess,
    errorMessage
  } = useRegister();

  const { showAlert } = useAlert();

  useEffect(() => {
    if (isError && errorMessage) {
      showAlert(errorMessage);
    }
  }, [isError, errorMessage]);

  useEffect(() => {
    if (isSuccess) {
      showAlert("Successfully registered! You can now log in.");

      flipSetter(false);

      setLogin("");
      setPassword("");
    }
  }, [isSuccess, flipSetter]);

  const handleSignUp = () => {
    if (!login.trim() || !password.trim()) {
      showAlert("Login and password cannot be empty.");
      return;
    }

    if (password.length < 6) {
      showAlert("Password is too short.");
      return;
    }

    register({ login, password });
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
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        className="auth-form__field auth-form__field--pass"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <input
          type="checkbox"
          id="register-checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <label htmlFor="register-checkbox" className="select-none"> Show Password</label>
      </div>

      <button
        className="auth-form__button auth-form__button--submit"
        onClick={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Sign up'}
      </button>

      <div className="self-end mt-[15px]">
        <span>Already have an account?👉 </span>
        <button
          className="auth-form__button auth-form__button--switch-side"
          onClick={() => flipSetter(false)}
          type="button"
        >
          Sign in
        </button>
      </div>
    </form>
  )
}