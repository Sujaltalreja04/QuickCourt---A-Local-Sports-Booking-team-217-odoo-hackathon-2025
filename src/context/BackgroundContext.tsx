import React, { createContext, useContext, useState } from 'react';

interface BackgroundContextType {
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
  resetBackground: () => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState<string>('https://thesportsschool.com/wp-content/uploads/2020/06/216-scaled-1.jpg');

  const resetBackground = () => {
    setBackgroundImage('https://thesportsschool.com/wp-content/uploads/2020/06/216-scaled-1.jpg');
  };

  return (
    <BackgroundContext.Provider value={{
      backgroundImage,
      setBackgroundImage,
      resetBackground,
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
