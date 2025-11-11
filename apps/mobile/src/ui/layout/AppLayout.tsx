import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { BottomTabs } from './BottomTabs';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  hasNewTasks?: boolean;
  showBackButton?: boolean;
  projectName?: string;
  projectStatus?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  onLogout,
  hasNewTasks = false,
  showBackButton = false,
  projectName,
  projectStatus,
}) => {
  const { isWeb, isMobile } = useTheme();

  // Sur web, la sidebar et TopBar sont déjà dans le _layout.tsx
  // On retourne juste les children avec un conteneur pour le scroll
  if (isWeb) {
    return (
      <View style={styles.webChildren}>
        {children}
      </View>
    );
  }

  if (isMobile) {
    return (
      <View className="flex-1 bg-bgGray">
        {children}
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: '#F7F8FA',
  },
  webContent: {
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
  },
  webChildren: {
    flex: 1,
    ...(Platform.OS === 'web' ? {
      overflowY: 'auto',
      overflowX: 'hidden',
    } : {
      overflow: 'auto',
    }),
  },
});
