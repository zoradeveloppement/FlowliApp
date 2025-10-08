import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';
import { useToast } from '../components';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const { setHasNewTasks, setHasNewInvoices, setHasNewMessages } = useNotificationStore();
  const { showInfo } = useToast();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        // Ici vous pourriez envoyer le token à votre API
        console.log('Push token:', token);
      }
    });

    // Écouter les notifications reçues
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      handleNotificationReceived(notification);
    });

    // Écouter les interactions avec les notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const handleNotificationReceived = (notification: Notifications.Notification) => {
    const { data } = notification.request.content;
    
    // Mettre à jour le store selon le type de notification
    if (data?.type === 'task') {
      setHasNewTasks(true);
      showInfo('Nouvelle tâche disponible !');
    } else if (data?.type === 'invoice') {
      setHasNewInvoices(true);
      showInfo('Nouvelle facture disponible !');
    } else if (data?.type === 'message') {
      setHasNewMessages(true);
      showInfo('Nouveau message reçu !');
    }
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const { data } = response.notification.request.content;
    
    // Navigation basée sur le type de notification
    if (data?.type === 'task') {
      // Navigation vers l'écran des tâches
      console.log('Navigate to tasks');
    } else if (data?.type === 'invoice') {
      // Navigation vers l'écran des factures
      console.log('Navigate to invoices');
    } else if (data?.type === 'message') {
      // Navigation vers l'écran de contact
      console.log('Navigate to contact');
    }
  };

  const sendTestNotification = async () => {
    if (expoPushToken) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Flowli',
          body: 'Ceci est une notification de test',
          data: { type: 'task' },
        },
        trigger: { seconds: 2 },
      });
    }
  };

  return {
    expoPushToken,
    notification,
    sendTestNotification,
  };
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Platform.OS === 'ios') {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  }

  try {
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } catch (error) {
    console.error('Error getting push token:', error);
  }

  return token;
}
