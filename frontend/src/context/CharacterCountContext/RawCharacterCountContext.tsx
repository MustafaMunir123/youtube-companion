'use client';

import { createContext, useContext, useState } from 'react';

export interface RawCharacterCountContextProps {
  rawCharacterCount: number;
  updateRawCharacterCount: (value: number) => void;
  decreamentRawCharacterCount: (value: number) => void;
}

const RawCharacterCountContext = createContext<RawCharacterCountContextProps | undefined>(
  undefined,
);

export const RawCharacterCountProvider = ({ children }: { children: React.ReactNode }) => {
  const [rawCharacterCount, setRawCharacterCount] = useState<number>(0);

  const updateRawCharacterCount = (value: number) => {
    setRawCharacterCount((prevCount: number) => prevCount + Number(value));
  };

  const decreamentRawCharacterCount = (value: number) => {
    setRawCharacterCount((prevCount: number) => prevCount - Number(value));
  };

  return (
    <RawCharacterCountContext.Provider
      value={{ rawCharacterCount, updateRawCharacterCount, decreamentRawCharacterCount }}
    >
      {children}
    </RawCharacterCountContext.Provider>
  );
};

export const useRawCharacterCount = (): RawCharacterCountContextProps => {
  const context = useContext(RawCharacterCountContext);

  if (!context) {
    throw new Error('useRawCharacterCount must be used within a CharacterCountProvider');
  }

  return context;
};
