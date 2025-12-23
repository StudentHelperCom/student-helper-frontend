'use client'

import React, {createContext, useContext, useState} from "react";
import AlertDialog from "@components/popups/dialogs/AlertDialog";

interface AlertDialogType {
  showAlert: (message: string, autoCloseOn: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogType | undefined>(undefined);

export function AlertDialogProvider({ children }: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [autoClose, setAutoClose] = useState(false);

  const showAlert = (message: string, autoCloseOn: boolean) => {
    setMessage(message);
    setAutoClose(autoCloseOn);
    setIsOpen(true);

    if (autoCloseOn) {
      // calculating time to read a message
      // base-time = 2 s, time-per-char = 0.05 s, max-time = 10 s
      const delay = Math.min(2000 + (message.length * 50), 10000);

      setTimeout(() => {
        setIsOpen(false);
      }, delay)
    }
  }

  return (
    <AlertDialogContext.Provider value={{ showAlert }}>
      {children}

      {isOpen && <AlertDialog
        message={message}
        showCloseButton={!autoClose}
        closeFn={() => setIsOpen(false)}
      />}
    </AlertDialogContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertDialogContext);

  if (!context) {
    throw new Error('useAlert must be used within an AuthShell');
  }

  return context;
}

export default AlertDialogContext;