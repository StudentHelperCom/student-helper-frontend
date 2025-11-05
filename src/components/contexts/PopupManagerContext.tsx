'use client'

import React, {useContext, useState} from "react";

type PopupName = 'add' | 'topics' | 'newClass' | null;

type PopupManagerType = {
  activePopup: PopupName;
  openPopup: (name: PopupName) => void;
  closePopup: () => void;
}

const PopupManagerContext = React.createContext<PopupManagerType | undefined>(undefined);

export function PopupManagerProvider({ children }: { children: React.ReactNode }) {
  const [activePopup, setActivePopup] = useState<PopupName>(null);

  const openPopup = (name: PopupName) => {
    setActivePopup(name);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <PopupManagerContext.Provider value={{ activePopup, openPopup, closePopup }}>
      {children}
    </PopupManagerContext.Provider>
  );
}

export function usePopupManager() {
  const context = useContext(PopupManagerContext);
  if (!context) {
    throw new Error("usePopupManager must be used within a PopupManagerProvider");
  }
  return context;
}