import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { NotificationBadge } from '../components';
import { useNotificationStore } from '../store/notificationStore';

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
    <View className="bg-white border-t border-gray-200 px-2 py-2 flex-row justify-around">
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
            className={`flex-1 items-center py-2 px-1 ${
              isActive ? 'bg-primary/10' : ''
            }`}
            onPress={() => router.push(item.href)}
          >
            <View className="relative mb-1">
              <Text className="text-2xl">{item.icon}</Text>
              {hasNotifications && (
                <NotificationBadge size="sm" />
              )}
            </View>
            <Text className={`text-xs font-medium ${
              isActive ? 'text-primary' : 'text-textMuted'
            }`}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

