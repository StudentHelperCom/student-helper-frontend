import type { Metadata } from "next";
import React from "react";
import ContextWrapper from "@components/contexts/ContextWrapper";

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
      <ContextWrapper>
        <AppShell>
          {children}
        </AppShell>
      </ContextWrapper>
    </>
  );
}
