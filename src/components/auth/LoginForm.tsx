'use client'

import React from "react";

export default function LoginForm({flipSetter}: {flipSetter: React.Dispatch<React.SetStateAction<boolean | undefined>>}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form className="auth-form auth-form--login" onSubmit={(e) => e.preventDefault()}>
      <span className="auth-form__title">
        Login
      </span>
      <input className="auth-form__field auth-form__field--login" type="text" placeholder="Username" />
      <input
        className="auth-form__field auth-form__field--pass"
        type={showPassword ? "text" : "password"}
        placeholder="Password" />
      <div>
        <input type="checkbox" id="login-checkbox" onChange={() => setShowPassword(!showPassword)}/>
        <label htmlFor="login-checkbox"> Show Password</label>
      </div>
      <button className="auth-form__button auth-form__button--submit">
        Login
      </button>
      <div className="self-end mt-[15px]">
        <span>Don&#39;t have an account?👉 </span>
        <button className="auth-form__button auth-form__button--switch-side" onClick={() => flipSetter(true)}>Sign up</button>
      </div>
    </form>
  )
}