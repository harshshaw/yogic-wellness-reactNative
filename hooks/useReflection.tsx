import React, { createContext, useContext, useState } from 'react';

export type ReflectionData = {
  mood: string;
  energy: 'low' | 'slightly_low' | 'moderate' | 'high' | 'very_high';
  sleep: 'poor' | 'average' | 'good' | 'excellent';
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
