'use client'

import MainScreen from "@components/screens/MainScreen";
import {LoaderProvider} from "@components/contexts/LoaderContext";
import { SessionProvider } from 'next-auth/react';

export default function Home() {
  return (
    <>
      <SessionProvider>
        <LoaderProvider>
          <MainScreen/>
        </LoaderProvider>
      </SessionProvider>
    </>
  );
}
