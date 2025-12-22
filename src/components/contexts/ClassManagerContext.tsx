'use client'

import React, {createContext, useContext, useState} from "react";

type ClassInfoType = {
  name: string,
  id: string,
} | null;

interface ClassManagerType {
  selectedClass: ClassInfoType,
  setClass: React.Dispatch<React.SetStateAction<ClassInfoType>>;
}

const ClassManagerContext = createContext<ClassManagerType | undefined>(undefined);

export function ClassManagerProvider({children}: { children: React.ReactNode }) {
  const [selectedClass, setSelectedClass] = useState<ClassInfoType>(null);

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