import React from 'react';
import { Platform } from 'react-native';

interface ThemeContextType {
  isWeb: boolean;
  isMobile: boolean;
}

const ThemeContext = React.createContext<ThemeContextType>({
  isWeb: false,
  isMobile: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;

  return (
    <ThemeContext.Provider value={{ isWeb, isMobile }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
