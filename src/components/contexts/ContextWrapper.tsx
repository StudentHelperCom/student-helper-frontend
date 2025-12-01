import {LoaderProvider} from "@components/contexts/LoaderContext";
import { SessionProvider } from 'next-auth/react';
import {ReactNode} from "react";

export default function ContextWrapper({children}: { children: ReactNode }) {
  return (
    <>
      <SessionProvider>
        <LoaderProvider>
          {children}
        </LoaderProvider>
      </SessionProvider>
    </>
  )
}