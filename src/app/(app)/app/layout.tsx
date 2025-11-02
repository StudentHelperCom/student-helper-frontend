import type { Metadata } from "next";
import "@assets/globals.scss";
import Head from "next/head";
import { Poppins } from "next/font/google";
import React from "react";
const poppins = Poppins({
  weight: "400",
  variable: "--poppins",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "/SH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
