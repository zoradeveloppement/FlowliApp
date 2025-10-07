import { Stack } from 'expo-router';
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
}
