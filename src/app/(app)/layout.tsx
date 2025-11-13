import type { Metadata } from "next";
import React from "react";
import AppShell from "@components/AppShell";
import {PopupManagerProvider} from "@components/contexts/PopupManagerContext";

export const metadata: Metadata = {
  title: "/SH",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PopupManagerProvider>
        <AppShell>
          {children}
        </AppShell>
      </PopupManagerProvider>
    </>
  );
}
