'use client'

import React, {createContext, useContext, useState} from "react";
import AlertDialog from "@components/popups/dialogs/AlertDialog";

interface AlertDialogType {
  showAlert: (message: string) => void;
}

const AlertDialogContext = createContext<AlertDialogType | undefined>(undefined);

export function AlertDialogProvider({ children }: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showAlert = (message: string) => {
    setMessage(message);
    setIsOpen(true);
  }

  return (
    <AlertDialogContext.Provider value={{ showAlert }}>
      {children}

      {isOpen && <AlertDialog
        message={message}
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