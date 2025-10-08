import React from 'react';
import { View, Text } from 'react-native';
import { BaseComponentProps } from '../types';

interface NotificationBadgeProps extends BaseComponentProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'danger' | 'warn';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count = 0,
  size = 'md',
  color = 'danger',
  className = '',
}) => {
  if (count === 0) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary';
      case 'danger':
        return 'bg-danger';
      case 'warn':
        return 'bg-warn';
      default:
        return 'bg-danger';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-xs';
      case 'lg':
        return 'text-sm';
      default:
        return 'text-xs';
    }
  };

  return (
    <View
      className={`absolute -top-1 -right-1 ${getSizeClasses()} ${getColorClasses()} rounded-full items-center justify-center ${className}`}
    >
      {count > 9 ? (
        <Text className={`${getTextSize()} text-white font-bold`}>9+</Text>
      ) : (
        <Text className={`${getTextSize()} text-white font-bold`}>{count}</Text>
      )}
    </View>
  );
};
