import React, {createContext, useContext, useState} from "react";

interface ClassManagerType {
  selectedClass: string | null,
  setClass: React.Dispatch<React.SetStateAction<string | null>>;
}

const ClassManagerContext = createContext<ClassManagerType | undefined>(undefined);

export function ClassManagerProvider({children}: { children: React.ReactNode }) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

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