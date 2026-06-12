import React, { createContext, useContext, useState } from 'react';

export type ReflectionData = {
  mood: number;       // 1–5
  energy: 'low' | 'medium' | 'high';
  intention: string;
};

type ReflectionContextValue = {
  completed: boolean;
  data: ReflectionData | null;
  complete: (d: ReflectionData) => void;
  reset: () => void;
};

const ReflectionContext = createContext<ReflectionContextValue>({
  completed: false,
  data: null,
  complete: () => {},
  reset: () => {},
});

export const ReflectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ReflectionData | null>(null);

  return (
    <ReflectionContext.Provider
      value={{
        completed: data !== null,
        data,
        complete: (d) => setData(d),
        reset: () => setData(null),
      }}
    >
      {children}
    </ReflectionContext.Provider>
  );
};

export const useReflection = () => useContext(ReflectionContext);
