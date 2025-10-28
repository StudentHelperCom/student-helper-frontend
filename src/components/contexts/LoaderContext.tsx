import React from "react";

type LoaderType = {
  getter: boolean,
  setter: React.Dispatch<React.SetStateAction<boolean>>,
}

export const LoaderContext = React.createContext<LoaderType | undefined>(undefined);

export function useLoaderContext() {
  const loader = React.useContext(LoaderContext);

  if (loader === undefined) {
    throw new Error("useLoaderContext must be used within the LoaderContext");
  }

  return loader;
}