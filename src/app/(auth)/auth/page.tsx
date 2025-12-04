'use client'

import AuthScreen from "@components/screens/AuthScreen";
import {LoaderProvider} from "@components/contexts/LoaderContext";
import { SessionProvider } from 'next-auth/react';
import {AlertDialogProvider} from "@components/contexts/AlertDialogContext";

export default function Home() {
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
