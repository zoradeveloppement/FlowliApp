import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { NotificationBadge } from '../components';
import { useNotificationStore } from '../store/notificationStore';

interface SidebarProps {
  onLogout?: () => void;
}

const navigationItems = [
  { name: 'Accueil', href: '/home', icon: '🏠' },
  { name: 'Mon dossier', href: '/dossier', icon: '📁' },
  { name: 'Factures', href: '/factures', icon: '💰' },
  { name: 'Contact', href: '/contact', icon: '📞' },
];

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isWeb } = useTheme();
  const { hasNewTasks, hasNewInvoices, hasNewMessages } = useNotificationStore();

  if (!isWeb) return null;

  return (
    <View className="w-64 bg-white border-r border-gray-200 h-full flex-col">
      {/* Logo */}
      <View className="p-6 border-b border-gray-200">
        <Text className="text-h1 text-primary font-poppins font-semibold">
          Flowli
        </Text>
      </View>

      {/* Navigation */}
      <View className="flex-1 py-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const isDossierTab = item.href === '/dossier';
          const isFacturesTab = item.href === '/factures';
          const isContactTab = item.href === '/contact';
          
          // Déterminer s'il y a des notifications pour cet élément
          const hasNotifications = 
            (isDossierTab && hasNewTasks) ||
            (isFacturesTab && hasNewInvoices) ||
            (isContactTab && hasNewMessages);
          
          return (
            <TouchableOpacity
              key={item.href}
              className={`px-6 py-3 mx-2 rounded-lg flex-row items-center ${
                isActive ? 'bg-primary' : 'hover:bg-gray-50'
              }`}
              onPress={() => router.push(item.href)}
              style={Platform.OS === 'web' ? {
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              } : undefined}
            >
              <View className="relative">
                <Text className="text-lg mr-3">{item.icon}</Text>
                {hasNotifications && (
                  <NotificationBadge size="sm" />
                )}
              </View>
              <Text className={`font-medium ${
                isActive ? 'text-white' : 'text-textMain'
              }`}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout */}
      {onLogout && (
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            className="px-4 py-2 border border-danger rounded-lg"
            onPress={onLogout}
            style={Platform.OS === 'web' ? {
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            } : undefined}
          >
            <Text className="text-danger font-medium text-center">Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
