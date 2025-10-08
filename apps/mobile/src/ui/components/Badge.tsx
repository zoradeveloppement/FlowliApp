import React from 'react';
import { View, Text } from 'react-native';
import { BadgeStatus, BaseComponentProps } from '../types';

interface BadgeProps extends BaseComponentProps {
  status: BadgeStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'terminé':
        return 'bg-success text-white';
      case 'en cours':
        return 'bg-primary text-white';
      case 'à venir':
        return 'bg-gray-300 text-gray-600';
      case 'action requise':
        return 'bg-warn text-white';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'terminé':
        return '✅';
      case 'en cours':
        return '🔄';
      case 'à venir':
        return '⏳';
      case 'action requise':
        return '⚠️';
      default:
        return '';
    }
  };

  const baseClasses = 'rounded-full items-center justify-center flex-row';
  const statusClasses = getStatusClasses();
  const sizeClasses = getSizeClasses();

  return (
    <View className={`${baseClasses} ${statusClasses} ${sizeClasses} ${className}`}>
      <Text className="mr-1">{getStatusIcon()}</Text>
      <Text className="font-medium capitalize">
        {status}
      </Text>
    </View>
  );
};
