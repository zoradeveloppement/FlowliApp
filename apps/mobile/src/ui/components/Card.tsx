import React from 'react';
import { View } from 'react-native';
import { BaseComponentProps } from '../types';

interface CardProps extends BaseComponentProps {
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = true,
  className = '',
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'sm':
        return 'p-3';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  const baseClasses = 'bg-white rounded-xl border border-gray-200';
  const paddingClasses = getPaddingClasses();
  const shadowClasses = shadow ? 'shadow-card' : '';

  return (
    <View className={`${baseClasses} ${paddingClasses} ${shadowClasses} ${className}`}>
      {children}
    </View>
  );
};
