import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "/SH sign-in",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
