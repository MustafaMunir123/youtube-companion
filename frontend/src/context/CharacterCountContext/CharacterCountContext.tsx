'use client';

import { createContext, useContext, useState } from 'react';

import { CharacterCountContextProps } from './CharacterCountContext.types';

const CharacterCountContext = createContext<CharacterCountContextProps | undefined>(undefined);

export const CharacterCountProvider = ({ children }: { children: React.ReactNode }) => {
  const [characterCount, setCharacterCount] = useState<number>(0);

  const updateCharacterCount = (value: number) => {
    setCharacterCount((prevCount: number) => prevCount + Number(value));
  };

  const updateCharacterCountOnRetrain = (value: number) => {
    setCharacterCount(value);
  };

  const decreamentCharacterCount = (value: number) => {
    setCharacterCount((prevCount: number) => prevCount - Number(value));
  };

  return (
    <CharacterCountContext.Provider
      value={{
        characterCount,
        updateCharacterCount,
        decreamentCharacterCount,
        updateCharacterCountOnRetrain,
      }}
    >
      {children}
    </CharacterCountContext.Provider>
  );
};

export const useCharacterCount = (): CharacterCountContextProps => {
  const context = useContext(CharacterCountContext);

  if (!context) {
    throw new Error('useCharacterCount must be used within a CharacterCountProvider');
  }

  return context;
};
