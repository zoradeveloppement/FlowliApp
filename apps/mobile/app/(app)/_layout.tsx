import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // We'll use our custom BottomTabs
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Accueil',
          tabBarIcon: () => '🏠',
        }}
      />
      <Tabs.Screen 
        name="dossier" 
        options={{
          title: 'Mon dossier',
          tabBarIcon: () => '📁',
        }}
      />
      <Tabs.Screen 
        name="factures" 
        options={{
          title: 'Factures',
          tabBarIcon: () => '💰',
        }}
      />
      <Tabs.Screen 
        name="contact" 
        options={{
          title: 'Contact',
          tabBarIcon: () => '📞',
        }}
      />
    </Tabs>
  );
}
