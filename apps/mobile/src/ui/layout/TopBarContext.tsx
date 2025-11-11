import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TopBarState {
  showBackButton?: boolean;
  projectName?: string;
  projectStatus?: string;
  onRefresh?: () => void;
}

interface TopBarContextType {
  topBarState: TopBarState;
  setTopBarState: (state: TopBarState) => void;
}

const TopBarContext = createContext<TopBarContextType | undefined>(undefined);

export const TopBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topBarState, setTopBarState] = useState<TopBarState>({});

  return (
    <TopBarContext.Provider value={{ topBarState, setTopBarState }}>
      {children}
    </TopBarContext.Provider>
  );
};

export const useTopBar = () => {
  const context = useContext(TopBarContext);
  if (!context) {
    throw new Error('useTopBar must be used within TopBarProvider');
  }
  return context;
};

