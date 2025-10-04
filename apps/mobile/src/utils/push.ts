import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Android channel for foreground notifications
Notifications.setNotificationChannelAsync?.('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.DEFAULT,
});

export async function registerForPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
