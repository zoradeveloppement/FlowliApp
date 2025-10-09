import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
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

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.badgeSmall;
      case 'md':
        return styles.badgeMedium;
      case 'lg':
        return styles.badgeLarge;
      default:
        return styles.badgeMedium;
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case 'terminé':
        return styles.badgeSuccess;
      case 'en cours':
        return styles.badgePrimary;
      case 'à venir':
        return styles.badgeGray;
      case 'action requise':
        return styles.badgeWarning;
      default:
        return styles.badgeGray;
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
    <View 
      className={`${baseClasses} ${statusClasses} ${sizeClasses} ${className}`}
      style={[
        styles.badge,
        getSizeStyle(),
        getStatusStyle()
      ]}
    >
      <Text className="mr-1" style={styles.badgeIcon}>{getStatusIcon()}</Text>
      <Text className="font-medium capitalize" style={styles.badgeText}>
        {status}
      </Text>
    </View>
  );
};

// Styles de fallback pour Expo Go (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeSuccess: {
    backgroundColor: '#4CAF50',
  },
  badgePrimary: {
    backgroundColor: '#7C3AED',
  },
  badgeGray: {
    backgroundColor: '#D1D5DB',
  },
  badgeWarning: {
    backgroundColor: '#FF9800',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontWeight: '500',
    textTransform: 'capitalize',
    color: '#FFFFFF',
  },
});
