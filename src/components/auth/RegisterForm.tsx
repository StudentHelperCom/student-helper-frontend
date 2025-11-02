'use client'

import React from "react";

export default function RegisterForm({flipSetter}: {flipSetter: React.Dispatch<React.SetStateAction<boolean | undefined>>}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form className="auth-form auth-form--register" onSubmit={(e) => e.preventDefault()}>
      <span className="auth-form__title">
        Sign Up
      </span>
      <input className="auth-form__field auth-form__field--login" type="text" placeholder="Username" />
      <input
        className="auth-form__field auth-form__field--pass"
        type={showPassword ? "text" : "password"}
        placeholder="Password" />
      <div>
        <input type="checkbox" id="register-checkbox" onChange={() => setShowPassword(!showPassword)} />
        <label htmlFor="register-checkbox"> Show Password</label>
      </div>
      <button className="auth-form__button auth-form__button--submit">
        Sign up
      </button>
      <div className="self-end mt-[15px]">
        <span>Already have an account?👉 </span>
        <button className="auth-form__button auth-form__button--switch-side" onClick={() => flipSetter(false)}>Sign in</button>
      </div>
    </form>
  )
}