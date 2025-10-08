import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Platform } from 'react-native';
import { SnackbarType, BaseComponentProps } from '../types';

interface SnackbarProps extends BaseComponentProps {
  type: SnackbarType;
  message: string;
  visible: boolean;
  autoHide?: boolean;
  duration?: number;
  onHide?: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  type,
  message,
  visible,
  autoHide = true,
  duration = 4000,
  onHide,
  className = '',
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide
      if (autoHide) {
        const timer = setTimeout(() => {
          hideSnackbar();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideSnackbar();
    }
  }, [visible]);

  const hideSnackbar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'info':
        return 'bg-primary';
      default:
        return 'bg-primary';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      className={`absolute top-12 left-4 right-4 z-50 ${getTypeClasses()} rounded-lg p-4 ${className}`}
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
        ...(Platform.OS === 'web' && {
          position: 'fixed',
          top: '48px',
          left: '16px',
          right: '16px',
          maxWidth: 'calc(100vw - 32px)',
        }),
      }}
    >
      <View className="flex-row items-center">
        <Text className="text-white text-lg mr-3">
          {getIcon()}
        </Text>
        <Text className="text-white text-body flex-1 font-medium">
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};
