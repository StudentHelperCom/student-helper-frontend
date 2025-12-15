import {LoaderProvider} from "@components/contexts/LoaderContext";
import { SessionProvider } from 'next-auth/react';
import {ReactNode} from "react";
import AlertDialogContext, {AlertDialogProvider} from "@components/contexts/AlertDialogContext";

export default function ContextWrapper({children}: { children: ReactNode }) {
  return (
    <>
      <SessionProvider>
        <LoaderProvider>
          <AlertDialogProvider>
            {children}
          </AlertDialogProvider>
        </LoaderProvider>
      </SessionProvider>
    </>
  )
}