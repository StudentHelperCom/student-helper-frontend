import type { Metadata } from "next";
import "@assets/globals.scss";
import { Poppins } from "next/font/google";
import React from "react";
import ContextWrapper from "@components/contexts/ContextWrapper";
const poppins = Poppins({
  weight: "400",
  variable: "--poppins",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "/404",
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
        <ContextWrapper>
          {children}
        </ ContextWrapper>
      </body>
    </html>
  );
}
