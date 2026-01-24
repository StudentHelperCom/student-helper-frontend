'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SessionWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "AccessTokenError") {
      console.warn("Sesja wygasła. Wylogowywanie...");
      signOut();
    }
  }, [session]);

  return null;
}