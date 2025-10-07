import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Android channel for foreground notifications
Notifications.setNotificationChannelAsync?.('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.DEFAULT,
});

export async function registerForPushToken(): Promise<string | null> {
  // 1) Ne rien faire sur le web (MVP = email côté web)
  if (Platform.OS === 'web') return null;

  // 2) Vérifier que c'est un device réel (mobile)
  if (!Device.isDevice) return null;

  // 3) Permissions (mobile)
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  // 4) Récupérer le projectId
  const projectId =
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID ||
    (Constants?.expoConfig as any)?.extra?.eas?.projectId;

  if (!projectId) {
    console.warn('No EAS projectId; skipping push token registration.');
    return null;
  }

  // 5) Expo push token (mobile) avec projectId explicite
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}
