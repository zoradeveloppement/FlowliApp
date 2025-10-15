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
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen 
          name="home" 
          options={({ route }) => ({
            animation: route.params?.animation || 'slide_from_right',
            gestureEnabled: true,
          })}
        />
        <Stack.Screen 
          name="factures" 
          options={({ route }) => ({
            animation: route.params?.animation || 'slide_from_right',
            gestureEnabled: true,
          })}
        />
        <Stack.Screen 
          name="profile" 
          options={({ route }) => ({
            animation: route.params?.animation || 'slide_from_right',
            gestureEnabled: true,
          })}
        />
      </Stack>
      
      {/* Bottom Navigation */}
      <AppBottomNav />
    </View>
  );
}
