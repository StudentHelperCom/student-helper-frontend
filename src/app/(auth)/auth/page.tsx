'use client'

import AuthScreen from "@components/screens/AuthScreen";
import {LoaderProvider} from "@components/contexts/LoaderContext";
import { SessionProvider } from 'next-auth/react';

export default function Home() {
  return (
    <>
      <SessionProvider>
        <LoaderProvider>
          <AuthScreen/>
        </LoaderProvider>
      </SessionProvider>
    </>
  );
}
