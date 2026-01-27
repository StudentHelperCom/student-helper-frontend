'use client'

import AuthScreen from "@components/screens/AuthScreen";
import {LoaderProvider} from "@components/contexts/LoaderContext";
import { SessionProvider } from 'next-auth/react';
import {AlertDialogProvider} from "@components/contexts/AlertDialogContext";
import {useEffect} from "react";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("callbackUrl")) {
        url.searchParams.delete("callbackUrl");

        window.history.replaceState({}, "", url.pathname);
      }
    }
  }, []);

  return (
    <>
      <SessionProvider>
        <LoaderProvider>
          <AlertDialogProvider>
            <AuthScreen/>
          </AlertDialogProvider>
        </LoaderProvider>
      </SessionProvider>
    </>
  );
}
