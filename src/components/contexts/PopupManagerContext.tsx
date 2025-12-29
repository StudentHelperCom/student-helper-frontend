'use client'

import React, {useContext, useState} from "react";
import {availableModes} from "@components/popups/dialogs/TopicsListPopup";

export type PopupName = 'Add' | 'Topics' | 'NewClass' | null | keyof typeof availableModes;

type PopupManagerType = {
  activePopup: PopupName;
  openPopup: <T>(name: PopupName, data?: T) => void;
  closePopup: () => void;
  popupData: unknown;
}

const PopupManagerContext = React.createContext<PopupManagerType | undefined>(undefined);

export function PopupManagerProvider({ children }: { children: React.ReactNode }) {
  const [activePopup, setActivePopup] = useState<PopupName>('Cards');
  const [popupData, setPopupData] = useState<unknown>(null);

  const openPopup = <T = unknown>(name: PopupName, data?: T) => {
    setActivePopup(name);
    setPopupData(data || null);
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