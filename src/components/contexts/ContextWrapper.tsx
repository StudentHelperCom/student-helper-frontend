import {LoaderProvider} from "@components/contexts/LoaderContext";
import {SessionProvider} from 'next-auth/react';
import {ReactNode, useState} from "react";
import AlertDialogContext, {AlertDialogProvider} from "@components/contexts/AlertDialogContext";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";

export default function ContextWrapper({children}: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <LoaderProvider>
            <AlertDialogProvider>
              {children}
            </AlertDialogProvider>
          </LoaderProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}