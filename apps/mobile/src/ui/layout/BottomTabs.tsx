import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { NotificationBadge } from '../components';
import { useNotificationStore } from '../store/notificationStore';
import { globalStyles, colors } from '../styles/globalStyles';

interface BottomTabsProps {
  hasNewTasks?: boolean;
}

const tabItems = [
  { name: 'Accueil', href: '/home', icon: '🏠' },
  { name: 'Dossier', href: '/dossier', icon: '📁' },
  { name: 'Factures', href: '/factures', icon: '💰' },
  { name: 'Contact', href: '/contact', icon: '📞' },
];

export const BottomTabs: React.FC<BottomTabsProps> = ({ hasNewTasks = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useTheme();
  const { hasNewTasks: storeHasNewTasks, hasNewInvoices, hasNewMessages } = useNotificationStore();

  if (!isMobile) return null;

  return (
    <View style={styles.container}>
      {tabItems.map((item) => {
        const isActive = pathname === item.href;
        const isDossierTab = item.href === '/dossier';
        const isFacturesTab = item.href === '/factures';
        const isContactTab = item.href === '/contact';
        
        // Déterminer s'il y a des notifications pour cet onglet
        const hasNotifications = 
          (isDossierTab && (hasNewTasks || storeHasNewTasks)) ||
          (isFacturesTab && hasNewInvoices) ||
          (isContactTab && hasNewMessages);
        
        return (
          <TouchableOpacity
            key={item.href}
            style={[
              styles.tab,
              isActive && styles.activeTab
            ]}
            onPress={() => router.push(item.href)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
              {hasNotifications && (
                <NotificationBadge size="sm" />
              )}
            </View>
            <Text style={[
              styles.label,
              isActive && styles.activeLabel
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary + '10',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  activeLabel: {
    color: colors.primary,
  },
});
