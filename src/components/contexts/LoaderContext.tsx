'use client'

import React from "react";
import LoaderOverlay from "@components/LoaderOverlay";

type LoaderType = {
  getter: boolean,
  setter: React.Dispatch<React.SetStateAction<boolean>>,
}

const LoaderContext = React.createContext<LoaderType | undefined>(undefined);

export function LoaderProvider({ children }: {children: React.ReactNode}) {
  const [loaderOpened, setLoaderOpened] = React.useState(false);

  return (
    <LoaderContext.Provider value={{getter: loaderOpened, setter: setLoaderOpened}}>
      {loaderOpened && <LoaderOverlay/>}
      {children}
    </LoaderContext.Provider>
  )
}

export function useLoaderContext() {
  const context = React.useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoaderContext must be used within the LoaderContext");
  }

  return context;
}