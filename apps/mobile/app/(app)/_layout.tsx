import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, Text } from 'react-native';
import { AppIcon } from '@/src/ui/icons/AppIcon';

export default function AppLayout() {
  // Configuration du channel Android par défaut
  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }
  }, []);

  // Debug listener pour voir les notifications en premier plan
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(n => {
      console.log('[PUSH RECEIVED]', n.request.content.title, n.request.content.body);
    });
    return () => sub.remove();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarActiveTintColor: '#6C63FF', // Violet Flowli
        tabBarInactiveTintColor: '#6E6E6E',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <AppIcon name="home" size={24} color={color} variant={undefined as any} />,
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <AppIcon name="user" size={24} color={color} variant={undefined as any} />,
        }}
      />
      <Tabs.Screen 
        name="factures" 
        options={{
          title: 'Facturation',
          tabBarIcon: ({ color }) => <AppIcon name="receipt" size={24} color={color} variant={undefined as any} />,
        }}
      />
    </Tabs>
  );
}
