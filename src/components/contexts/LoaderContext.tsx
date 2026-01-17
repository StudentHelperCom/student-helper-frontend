'use client'

import React, { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import LoaderOverlay from "@components/LoaderOverlay";

type Action = {
  type: 'ADD_LOADER' | 'REMOVE_LOADER';
  id: string
}

type LoaderContextType = {
  activeLoaders: string[];
  isLoaderOpen: boolean;
  startLoading: (id: string) => void;
  stopLoading: (id: string) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

const loaderReducer = (state: string[], action: Action): string[] => {
  switch (action.type) {
    case 'ADD_LOADER':
      if (state.includes(action.id)) {
        return state;
      }
      return [...state, action.id];

    case 'REMOVE_LOADER':
      return state.filter((loaderId) => loaderId !== action.id);

    default:
      return state;
  }
};

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [activeLoaders, dispatch] = useReducer(loaderReducer, []);
  const isLoaderOpen = activeLoaders.length > 0;

  const startLoading = useCallback((id: string) => {
    dispatch({ type: 'ADD_LOADER', id });
  }, []);

  const stopLoading = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_LOADER', id });
  }, []);

  const contextValue = useMemo(() => ({
    activeLoaders,
    isLoaderOpen,
    startLoading,
    stopLoading
  }), [activeLoaders, isLoaderOpen, startLoading, stopLoading]);

  return (
    <LoaderContext.Provider value={contextValue}>
      {isLoaderOpen && <LoaderOverlay />}
      {children}
    </LoaderContext.Provider>
  )
}

export function useLoader() {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoader must be used within the LoaderProvider");
  }

  return context;
}