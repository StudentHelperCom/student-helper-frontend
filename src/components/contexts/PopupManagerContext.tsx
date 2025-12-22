'use client'

import React, {useContext, useState} from "react";

type PopupName = 'add' | 'topics' | 'newClass' | null;

type PopupManagerType = {
  activePopup: PopupName;
  openPopup: (name: PopupName, data?: string) => void;
  closePopup: () => void;
  popupData: string | null;
}

const PopupManagerContext = React.createContext<PopupManagerType | undefined>(undefined);

export function PopupManagerProvider({ children }: { children: React.ReactNode }) {
  const [activePopup, setActivePopup] = useState<PopupName>(null);
  const [popupData, setPopupData] = useState<string | null>(null);

  const openPopup = (name: PopupName, data?: string) => {
    setActivePopup(name);
    if (data) setPopupData(data);
  };

  const closePopup = () => {
    setActivePopup(null);
    setPopupData(null);
  };

  return (
    <PopupManagerContext.Provider value={{ activePopup, openPopup, closePopup, popupData }}>
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