import React from 'react';
import { View, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { BottomTabs } from './BottomTabs';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  hasNewTasks?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  onLogout,
  hasNewTasks = false,
}) => {
  const { isWeb, isMobile } = useTheme();

  if (isWeb) {
    return (
      <View className="h-screen flex-row bg-bgGray">
        <Sidebar onLogout={onLogout} />
        <View className="flex-1 flex-col">
          <TopBar onLogout={onLogout} />
          <View className="flex-1 overflow-auto">
            {children}
          </View>
        </View>
      </View>
    );
  }

  if (isMobile) {
    return (
      <View className="h-screen flex-col bg-bgGray">
        <View className="flex-1">
          {children}
        </View>
        <BottomTabs hasNewTasks={hasNewTasks} />
      </View>
    );
  }

  return <>{children}</>;
};
