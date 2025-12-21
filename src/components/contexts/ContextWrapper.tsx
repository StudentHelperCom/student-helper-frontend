'use client'

import {LoaderProvider} from "@components/contexts/LoaderContext";
import {SessionProvider} from 'next-auth/react';
import {ReactNode, useState} from "react";
import AlertDialogContext, {AlertDialogProvider} from "@components/contexts/AlertDialogContext";
import {QueryClientProvider} from "@tanstack/react-query";
import {QueryClient} from "@tanstack/query-core";
import {ClassManagerProvider} from "@components/contexts/ClassManagerContext";
import {PopupManagerProvider} from "@components/contexts/PopupManagerContext";

export default function ContextWrapper({children}: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <LoaderProvider>
            <PopupManagerProvider>
              <AlertDialogProvider>
                <ClassManagerProvider>
                  {children}
                </ClassManagerProvider>
              </AlertDialogProvider>
            </PopupManagerProvider>
          </LoaderProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}