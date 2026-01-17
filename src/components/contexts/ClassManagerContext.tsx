'use client'

import React, {createContext, useContext, useState} from "react";

export interface ClassInfo {
  classID: string;
  name: string;
}

interface ClassManagerType {
  selectedClass: ClassInfo | null,
  setClass: React.Dispatch<React.SetStateAction<ClassInfo | null>>;
}

const ClassManagerContext = createContext<ClassManagerType | undefined>(undefined);

export function ClassManagerProvider({children}: { children: React.ReactNode }) {
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

  return (
    <ClassManagerContext.Provider value={{selectedClass, setClass: setSelectedClass}}>
      {children}
    </ClassManagerContext.Provider>
  );
}

export const useClassManager = () => {
  const context = useContext(ClassManagerContext);

  if (!context) {
    throw new Error('useClassManager must be used within an AuthShell');
  }

  return context;
}

export default ClassManagerContext;