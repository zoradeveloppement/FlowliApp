import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNotificationStore } from '../store/notificationStore';
import { AppIcon } from '@/src/ui/icons/AppIcon';

interface InAppNotificationProps {
  onMarkAsRead?: () => void;
}

export const InAppNotification: React.FC<InAppNotificationProps> = ({
  onMarkAsRead,
}) => {
  const { hasNewTasks, hasNewInvoices, hasNewMessages, markAsRead } = useNotificationStore();
  const [visible, setVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    const hasAnyNotification = hasNewTasks || hasNewInvoices || hasNewMessages;
    setVisible(hasAnyNotification);

    if (hasAnyNotification) {
      // Animation d'entrée
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      // Animation de sortie
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [hasNewTasks, hasNewInvoices, hasNewMessages, slideAnim]);

  const handleMarkAsRead = () => {
    markAsRead();
    onMarkAsRead?.();
  };

  const getNotificationMessage = () => {
    if (hasNewTasks) return 'Nouvelle tâche disponible';
    if (hasNewInvoices) return 'Nouvelle facture disponible';
    if (hasNewMessages) return 'Nouveau message reçu';
    return '';
  };

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute top-12 left-4 right-4 z-50 bg-primary rounded-lg p-4 shadow-lg"
      style={{
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <AppIcon name="bell" size={20} color="#FFFFFF" />
          <Text className="text-white text-body font-medium flex-1">
            {getNotificationMessage()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleMarkAsRead}
          className="ml-3"
        >
          <Text className="text-white text-sm font-medium">Marquer comme lu</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
