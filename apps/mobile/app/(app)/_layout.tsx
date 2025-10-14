import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, Text, View } from 'react-native';
import { AppIcon } from '@/src/ui/icons/AppIcon';
import AppBottomNav from '../../components/AppBottomNav';

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
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="factures" />
        <Stack.Screen name="profile" />
      </Stack>
      
      {/* Bottom Navigation */}
      <AppBottomNav />
    </View>
  );
}
