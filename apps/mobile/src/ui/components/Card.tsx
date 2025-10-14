import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
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

  const getPaddingStyle = () => {
    switch (padding) {
      case 'sm':
        return styles.paddingSmall;
      case 'md':
        return styles.paddingMedium;
      case 'lg':
        return styles.paddingLarge;
      default:
        return styles.paddingMedium;
    }
  };

  const baseClasses = 'bg-white rounded-xl border border-gray-200';
  const paddingClasses = getPaddingClasses();
  const shadowClasses = shadow ? 'shadow-card' : '';

  return (
    <View 
      style={[
        styles.card,
        getPaddingStyle(),
        shadow && styles.cardShadow,
        style
      ]}
    >
      {children}
    </View>
  );
};

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paddingSmall: {
    padding: 12,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
});
